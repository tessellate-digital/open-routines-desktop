import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { PROVIDERS } from '../lib/providers';
import type { Trigger, PermissionLevel, PermissionValue, RoutinePermissions } from '../lib/types';
import { CronPicker } from '../components/CronPicker';
import { FolderPicker } from '../components/FolderPicker';
import { FileTypeFilter, type FileFilterValue } from '../components/FileTypeFilter';
import { SelectDropdown, type SelectOption } from '../components/SelectDropdown';
import { BackLink } from '../components/BackLink';
import { PageHeader } from '../components/PageHeader';
import { PermissionRadio } from '../components/PermissionRadio';
import { useHostMounts } from '../contexts/HostMountsContext';
import { usePageContext } from '../contexts/PageContext';

const FS_EVENTS = [
  { value: 'add', label: 'File created' },
  { value: 'change', label: 'File changed' },
  { value: 'addDir', label: 'Folder created' },
  { value: 'unlink', label: 'File deleted' },
  { value: 'unlinkDir', label: 'Folder deleted' },
];

/* ── Permission helpers ── */

function permDefault(
  val: PermissionValue | undefined,
  fallback: PermissionLevel = 'allow'
): PermissionLevel {
  if (!val) {
    return fallback;
  }
  if (typeof val === 'string') {
    return val;
  }
  return val['*'] ?? fallback;
}

function permRules(val: PermissionValue | undefined): [string, PermissionLevel][] {
  if (!val || typeof val === 'string') {
    return [];
  }
  return Object.entries(val).filter(([k]) => k !== '*');
}

function permSetDefault(val: PermissionValue | undefined, level: PermissionLevel): PermissionValue {
  const rules = permRules(val);
  if (rules.length === 0) {
    return level;
  }
  return Object.fromEntries([['*', level], ...rules]);
}

function permAddRule(
  val: PermissionValue | undefined,
  pattern: string,
  level: PermissionLevel
): PermissionValue {
  const def = permDefault(val);
  const rules = permRules(val);
  return Object.fromEntries([['*', def], ...rules, [pattern, level]]);
}

function permRemoveRule(val: PermissionValue | undefined, pattern: string): PermissionValue {
  const def = permDefault(val);
  const rules = permRules(val).filter(([k]) => k !== pattern);
  if (rules.length === 0) {
    return def;
  }
  return Object.fromEntries([['*', def], ...rules]);
}

function permSetRuleLevel(
  val: PermissionValue | undefined,
  pattern: string,
  level: PermissionLevel
): PermissionValue {
  const def = permDefault(val);
  const rules = permRules(val).map(
    ([k, v]) => [k, k === pattern ? level : v] as [string, PermissionLevel]
  );
  return Object.fromEntries([['*', def], ...rules]);
}

const PERM_DEFS: {
  key: string;
  label: string;
  hint: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  defaultLevel: PermissionLevel;
  expandable?: boolean;
  browsable?: boolean;
  placeholder?: string;
}[] = [
  {
    key: 'read',
    label: 'Read files',
    hint: 'Glob patterns over file paths. ** matches any subtree. For example: ~/projects/**',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
        <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v11A2.5 2.5 0 0 0 4.5 18h11a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 15.5 5H10L8.4 3.2A2 2 0 0 0 6.8 2.5H4.5Z" />
      </svg>
    ),
    defaultLevel: 'allow',
    expandable: true,
    browsable: true,
  },
  {
    key: 'edit',
    label: 'Edit files',
    hint: 'Glob patterns over file paths. ** matches any subtree.',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
        <path d="M14.846 1.403a2.45 2.45 0 0 1 3.466 3.466l-1.29 1.29-3.466-3.466 1.29-1.29ZM12.22 4.03l-8.97 8.97a2 2 0 0 0-.503.805l-1.5 4.5a.75.75 0 0 0 .948.948l4.5-1.5a2 2 0 0 0 .805-.503l8.97-8.97L12.22 4.03Z" />
      </svg>
    ),
    defaultLevel: 'allow',
    expandable: true,
    browsable: true,
  },
  {
    key: 'webfetch',
    label: 'Web fetch',
    hint: '',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.5 9a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" />
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM2 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 2 10ZM15 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 15 10Z" />
      </svg>
    ),
    defaultLevel: 'allow',
    expandable: false,
  },
  {
    key: 'websearch',
    label: 'Web & code search',
    hint: '',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    defaultLevel: 'allow',
    expandable: false,
  },
];

const ADVANCED_PERM_DEFS: typeof PERM_DEFS = [
  {
    key: 'bash',
    label: 'Run shell commands',
    hint: 'Patterns match parsed commands, e.g. git *, npm *, rm *',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25Zm.943 4.752a.75.75 0 0 1 1.057-.098l3 2.5a.75.75 0 0 1 0 1.152l-3 2.5a.75.75 0 0 1-.959-1.152L6.56 10.5 4.29 8.402a.75.75 0 0 1-.098-1.057ZM9.75 12.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    defaultLevel: 'allow',
    expandable: true,
    browsable: false,
  },
];

function PermissionRow({
  def,
  value,
  onChange,
}: {
  def: (typeof PERM_DEFS)[number];
  value: PermissionValue | undefined;
  onChange: (v: PermissionValue) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [newPattern, setNewPattern] = useState('');
  const rules = permRules(value);
  const defaultLevel = permDefault(value, def.defaultLevel);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2">
      {/* Header */}
      <div
        className={classNames(
          'flex items-center gap-3 py-2.5 px-3.5 select-none',
          def.expandable !== false ? 'cursor-pointer hover:bg-surface-hi/50' : ''
        )}
        onClick={() => def.expandable !== false && setExpanded(!expanded)}
      >
        <span
          className={classNames(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            def.iconBg,
            def.iconColor
          )}
        >
          {def.icon}
        </span>
        <span className="font-medium text-body-sm flex items-center gap-2">
          {def.label}
          {def.expandable !== false && rules.length > 0 && (
            <span className="text-micro bg-accent/15 text-accent font-semibold rounded-full px-1.5 py-0.5 leading-none">
              {rules.length}
            </span>
          )}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <PermissionRadio
              value={defaultLevel}
              onChange={(level) => onChange(permSetDefault(value, level))}
            />
          </div>
          {def.expandable !== false && (
            <span
              className={classNames(
                'text-fg-dim transition-transform duration-default ease-default',
                {
                  'rotate-90': expanded,
                }
              )}
            >
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 3 5 5-5 5" />
              </svg>
            </span>
          )}
        </span>
      </div>

      {/* Expanded body */}
      {def.expandable !== false && expanded && (
        <div className="border-t border-border bg-surface px-4 py-3 grid gap-2.5">
          <div className="text-micro text-fg-dim">
            Exceptions — each rule overrides the default <strong>only for matching paths</strong>.
            Deny rules take precedence over allow rules.
          </div>

          {rules.map(([pattern, level]) => (
            <div key={pattern} className="flex items-center gap-2">
              <span className="code-chip flex-1 truncate">{pattern}</span>
              <PermissionRadio
                value={level}
                onChange={(l) => onChange(permSetRuleLevel(value, pattern, l))}
              />
              <button
                type="button"
                onClick={() => onChange(permRemoveRule(value, pattern))}
                className="text-destructive cursor-pointer bg-transparent border-0 p-1 rounded hover:bg-destructive/10"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const p = newPattern.trim();
                  if (p) {
                    onChange(permAddRule(value, p, 'deny'));
                    setNewPattern('');
                  }
                }
              }}
              placeholder={
                def.placeholder ||
                (def.key === 'bash'
                  ? 'e.g. rm *, git push --force'
                  : 'e.g. ~/.ssh/**, **/secrets/**')
              }
              className="input flex-1 !py-1.5 !px-2 !text-body-sm"
            />
            {def.browsable && window.electronAPI && (
              <button
                type="button"
                className="btn sm"
                onClick={async () => {
                  const p = await window.electronAPI!.selectPath();
                  if (p) {
                    onChange(permAddRule(value, p, 'deny'));
                  }
                }}
              >
                Browse...
              </button>
            )}
            <button
              type="button"
              className="btn sm primary"
              disabled={!newPattern.trim()}
              onClick={() => {
                const p = newPattern.trim();
                if (p) {
                  onChange(permAddRule(value, p, 'deny'));
                  setNewPattern('');
                }
              }}
            >
              Add rule
            </button>
          </div>

          <div className="text-micro text-fg-dim/70 italic">{def.hint}</div>
        </div>
      )}
    </div>
  );
}

type TriggerType = 'cron' | 'watcher';

interface CronDraft {
  type: 'cron';
  expression: string;
}
interface WatcherDraft {
  type: 'watcher';
  watchMode: 'file' | 'folder';
  paths: string[];
  events: string[];
  fileFilter: FileFilterValue;
  recursive: boolean;
}
type TriggerDraft = CronDraft | WatcherDraft;

function defaultDraft(type: TriggerType): TriggerDraft {
  if (type === 'cron') {
    return { type: 'cron', expression: '0 9 * * *' };
  }
  return {
    type: 'watcher',
    watchMode: 'folder',
    paths: [],
    events: ['add', 'change', 'addDir'],
    fileFilter: { mode: 'none', patterns: [] },
    recursive: true,
  };
}

function triggerSummary(d: TriggerDraft, resolve: (p: string) => string): string {
  if (d.type === 'cron') {
    return d.expression;
  }
  const paths = d.paths.map((p) => resolve(p).split('/').pop() || p).join(', ');
  return paths || 'No paths';
}

function WatcherCollapsedSummary({
  draft,
  resolveHostPath,
}: {
  draft: WatcherDraft;
  resolveHostPath: (p: string) => string;
}) {
  const pathNames = draft.paths.map((p) => resolveHostPath(p).split('/').pop() || p);
  const eventLabels: Record<string, string> = {
    add: 'created',
    change: 'changed',
    addDir: 'dir created',
    unlink: 'deleted',
    unlinkDir: 'dir deleted',
  };
  return (
    <span className="flex items-center gap-2 flex-wrap min-w-0 font-mono text-xs text-fg-dim">
      {pathNames.length > 0 ? (
        <span className="font-mono text-code truncate max-w-[160px]">{pathNames.join(', ')}</span>
      ) : (
        <span className="text-fg-dim text-code">No paths</span>
      )}
      <span className="text-fg-dim text-micro">·</span>
      <span className="flex gap-1 flex-wrap">
        {draft.events.map((ev) => (
          <span key={ev} className={'code-chip text-micro-sm py-0 px-1.5'}>
            {eventLabels[ev] ?? ev}
          </span>
        ))}
      </span>
      {!draft.recursive && (
        <>
          <span className="text-fg-dim text-micro">·</span>
          <span className={'code-chip text-micro-sm py-0 px-1.5'}>top-level only</span>
        </>
      )}
      {draft.fileFilter.mode !== 'none' && draft.fileFilter.patterns.length > 0 && (
        <>
          <span className="text-fg-dim text-micro">·</span>
          <span className="text-micro text-fg-dim">
            {draft.fileFilter.mode === 'include' ? 'include' : 'exclude'}:{' '}
            {draft.fileFilter.patterns.join(', ')}
          </span>
        </>
      )}
    </span>
  );
}

function triggerToDraft(t: Trigger): TriggerDraft {
  if (t.type === 'cron') {
    return { type: 'cron', expression: String(t.config.expression || '0 9 * * *') };
  }
  const paths: string[] = Array.isArray(t.config.paths)
    ? (t.config.paths as string[])
    : typeof t.config.path === 'string' && t.config.path
      ? [t.config.path as string]
      : [];
  const rawFilter = t.config.fileFilter as { mode?: string; patterns?: string[] } | undefined;
  const fileFilter: FileFilterValue =
    rawFilter && Array.isArray(rawFilter.patterns)
      ? {
          mode:
            rawFilter.mode === 'exclude'
              ? 'exclude'
              : rawFilter.mode === 'none'
                ? 'none'
                : 'include',
          patterns: rawFilter.patterns,
        }
      : { mode: 'none', patterns: [] };
  return {
    type: 'watcher',
    watchMode: (t.config.watchMode as 'file' | 'folder') || 'folder',
    paths,
    events: Array.isArray(t.config.events)
      ? (t.config.events as string[])
      : ['add', 'change', 'addDir'],
    fileFilter,
    recursive: t.config.recursive !== false,
  };
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
      {n}
    </span>
  );
}

function StepHeader({ n, title, subtitle }: { n: number; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <StepNumber n={n} />
      <div className="flex flex-col">
        <div className="font-semibold text-body-sm">{title}</div>
        <div className="text-micro text-fg-dim">{subtitle}</div>
      </div>
    </div>
  );
}

function TriggerCard({
  draft,
  index,
  onChange,
  onRemove,
  hasMounts,
  resolveHostPath,
  onPickFolder,
  collapsed,
  onToggleCollapse,
}: {
  draft: TriggerDraft;
  index: number;
  onChange: (d: TriggerDraft) => void;
  onRemove: () => void;
  hasMounts: boolean | null;
  resolveHostPath: (p: string) => string;
  onPickFolder: (index: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const typeLabel = draft.type === 'cron' ? 'Cron' : 'Filesystem';
  const summary = triggerSummary(draft, resolveHostPath);

  return (
    <div className="border border-border-strong rounded-md bg-surface-hi overflow-hidden mb-2.5">
      <div
        className="flex items-center gap-2.5 py-2.5 px-3.5 cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <span
          className={classNames('text-fg-dim transition-transform duration-default ease-default', {
            'rotate-90': !collapsed,
          })}
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 3 5 5-5 5" />
          </svg>
        </span>
        <span className="font-medium text-body">{typeLabel}</span>
        {collapsed && draft.type === 'watcher' ? (
          <WatcherCollapsedSummary draft={draft} resolveHostPath={resolveHostPath} />
        ) : (
          <span className="font-mono text-xs text-fg-dim">{summary}</span>
        )}
        <button
          className="ml-auto text-destructive text-caption cursor-pointer py-1 px-2 rounded-[6px] bg-transparent border-none hover:bg-[color-mix(in_srgb,var(--status-failed)_10%,transparent)]"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </button>
      </div>
      {!collapsed && (
        <div className="py-3.5 px-4 pb-4 border-t border-muted bg-surface grid gap-3.5">
          {draft.type === 'cron' && (
            <CronPicker
              value={draft.expression}
              onChange={(v) => onChange({ ...draft, expression: v })}
            />
          )}
          {draft.type === 'watcher' && (
            <div className="grid gap-6">
              {/* Step 1 — What to watch */}
              <div>
                <StepHeader
                  n={1}
                  title="What to watch"
                  subtitle="Add one or more paths. Each path is watched independently."
                />
                <div className="ml-10">
                  {draft.paths.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {draft.paths.map((p) => (
                        <span
                          key={p}
                          className="code-chip inline-flex items-center gap-1.5 py-1 px-2"
                        >
                          <span className="truncate max-w-[200px]">{resolveHostPath(p)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              onChange({ ...draft, paths: draft.paths.filter((x) => x !== p) })
                            }
                            className="text-destructive cursor-pointer bg-transparent border-0 p-0 text-sm leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {hasMounts !== false && (
                    <div className="flex items-center gap-2">
                      <button type="button" className="btn sm" onClick={() => onPickFolder(index)}>
                        Browse...
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer text-body-sm mt-3 py-1.5 px-2.5 bg-accent-soft/30 rounded-md w-fit">
                    <input
                      type="checkbox"
                      checked={draft.recursive}
                      onChange={(e) => onChange({ ...draft, recursive: e.target.checked })}
                      className="accent-accent"
                    />
                    <span className="font-medium text-accent">Watch subfolders</span>
                    <span className="text-micro text-fg-dim ml-1">
                      Recursively include every nested folder.
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 2 — When to fire */}
              <div>
                <StepHeader
                  n={2}
                  title="When to fire"
                  subtitle="Pick one or more events. Each matching event starts the routine once."
                />
                <div className="flex flex-wrap gap-2 ml-10">
                  {FS_EVENTS.map(({ value, label }) => (
                    <button
                      type="button"
                      key={value}
                      className={classNames(
                        'py-2 px-4 rounded-md border text-caption cursor-pointer font-sans transition-all duration-default ease-default',
                        draft.events.includes(value)
                          ? 'bg-accent-soft text-accent border-accent font-medium'
                          : 'bg-surface-hi border-border-strong text-muted-foreground hover:text-foreground hover:border-fg-dim'
                      )}
                      onClick={() =>
                        onChange({
                          ...draft,
                          events: draft.events.includes(value)
                            ? draft.events.filter((ev) => ev !== value)
                            : [...draft.events, value],
                        })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 — Which files */}
              <div>
                <StepHeader
                  n={3}
                  title="Which files"
                  subtitle="Narrow the trigger to specific file types — or match everything."
                />
                <div className="ml-10">
                  <FileTypeFilter
                    value={draft.fileFilter}
                    onChange={(v) => onChange({ ...draft, fileFilter: v })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoutineForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { resolveHostPath } = useHostMounts();
  const { setPageTitle } = usePageContext();

  const [form, setForm] = useState({
    name: '',
    description: '',
    prompt: '',
    model: 'opencode/minimax-m2.5-free',
    repository: '',
    branch: 'main',
    env_vars: '{}',
    enabled: true,
    run_mode: 'foreground' as 'background' | 'foreground',
    temperature: null as number | null,
    permissions: {
      read: 'allow',
      edit: 'allow',
      webfetch: 'allow',
      websearch: 'allow',
      bash: 'allow',
    } as RoutinePermissions,
  });
  const [triggerDrafts, setTriggerDrafts] = useState<TriggerDraft[]>([]);
  const [collapsedTriggers, setCollapsedTriggers] = useState<Set<number>>(new Set());
  const [existingTriggers, setExistingTriggers] = useState<Trigger[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [configuredProviderIds, setConfiguredProviderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [folderPickerTarget, setFolderPickerTarget] = useState<number | null>(null);
  const hasMounts = true;
  const [showTriggerPicker, setShowTriggerPicker] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [modelsRes, settingsRes, routine, triggers] = await Promise.all([
          api.getModels(),
          api.getSettings(),
          isEdit ? api.getRoutine(id!) : Promise.resolve(null),
          isEdit ? api.getTriggers(id!) : Promise.resolve([] as Trigger[]),
        ]);
        setModels(modelsRes.models || []);
        const settingKeys = new Set(settingsRes.map((s: { key: string }) => s.key));
        const providerIds = PROVIDERS.filter((p) =>
          p.fields.some((f) => settingKeys.has(f.key))
        ).map((p) => p.id);
        setConfiguredProviderIds(providerIds);
        setPageTitle(routine ? routine.name : 'New routine');
        if (routine) {
          setForm({
            name: routine.name,
            description: routine.description,
            prompt: routine.prompt,
            model: routine.model,
            repository: routine.repository,
            branch: routine.branch,
            env_vars: JSON.stringify(routine.env_vars, null, 2),
            enabled: routine.enabled,
            run_mode: routine.run_mode,
            temperature: routine.temperature,
            permissions: {
              read: 'allow',
              edit: 'allow',
              webfetch: 'allow',
              websearch: 'allow',
              bash: 'allow',
              ...(routine.permissions as RoutinePermissions),
            },
          });
        }
        if (triggers && triggers.length > 0) {
          setExistingTriggers(triggers);
          const drafts = triggers.map((t) => triggerToDraft(t));
          setTriggerDrafts(drafts);
          if (drafts.length >= 3) {
            setCollapsedTriggers(new Set(drafts.map((_, i) => i)));
          }
        }
      } catch {
        /* non-critical */
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEdit, setPageTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let envVars: Record<string, string>;
    try {
      envVars = JSON.parse(form.env_vars || '{}');
    } catch {
      alert('Invalid JSON in env vars');
      setSubmitting(false);
      return;
    }
    const data = {
      name: form.name,
      description: form.description,
      prompt: form.prompt,
      model: form.model,
      repository: '',
      branch: 'main',
      env_vars: envVars,
      enabled: form.enabled,
      run_mode: form.run_mode,
      permissions: form.permissions,
      temperature: form.temperature,
    };
    try {
      const res = isEdit ? await api.updateRoutine(id!, data) : await api.createRoutine(data);
      const routineId = res.id;
      if (isEdit) {
        await Promise.all(existingTriggers.map((t) => api.deleteTrigger(t.id)));
      }
      for (const draft of triggerDrafts) {
        if (draft.type === 'cron' && draft.expression) {
          await api.createTrigger(routineId, {
            type: 'cron',
            config: { expression: draft.expression },
          });
        } else if (draft.type === 'watcher' && draft.paths.length > 0) {
          const config: Record<string, unknown> = {
            watchMode: draft.watchMode,
            paths: draft.paths,
            events: draft.events,
            recursive: draft.recursive,
          };
          if (draft.fileFilter.mode !== 'none' && draft.fileFilter.patterns.length > 0) {
            config.fileFilter = draft.fileFilter;
          }
          await api.createTrigger(routineId, { type: 'watcher', config });
        }
      }
      navigate(`/routines/${routineId}`);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  const addTrigger = (type: TriggerType) => {
    const draft = defaultDraft(type);
    setTriggerDrafts((prev) => [...prev, draft]);
    setShowTriggerPicker(false);
    setCollapsedTriggers((prev) => {
      if (triggerDrafts.length + 1 >= 3) {
        return new Set(triggerDrafts.map((_, i) => i));
      }
      return prev;
    });
  };
  const updateDraft = (index: number, draft: TriggerDraft) =>
    setTriggerDrafts((prev) => prev.map((d, i) => (i === index ? draft : d)));
  const removeDraft = (index: number) => {
    setTriggerDrafts((prev) => prev.filter((_, i) => i !== index));
    setCollapsedTriggers((prev) => {
      const next = new Set<number>();
      for (const i of prev) {
        if (i < index) {
          next.add(i);
        } else if (i > index) {
          next.add(i - 1);
        }
      }
      return next;
    });
  };
  const toggleCollapse = (index: number) => {
    setCollapsedTriggers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  const openFolderPickerForTrigger = (index: number) => {
    setFolderPickerTarget(index);
    setShowFolderPicker(true);
  };
  const handleFolderPicked = (path: string) => {
    if (folderPickerTarget !== null) {
      const draft = triggerDrafts[folderPickerTarget];
      if (draft?.type === 'watcher' && !draft.paths.includes(path)) {
        updateDraft(folderPickerTarget, { ...draft, paths: [...draft.paths, path] });
      }
    }
    setShowFolderPicker(false);
    setFolderPickerTarget(null);
  };

  const allowedPrefixes = new Set(['opencode', 'opencode-go', ...configuredProviderIds]);
  const availableModels = models.filter((m) => {
    const slash = m.indexOf('/');
    if (slash === -1) {
      return true;
    }
    return allowedPrefixes.has(m.slice(0, slash));
  });

  const currentProvider = useMemo(() => {
    const slash = form.model.indexOf('/');
    return slash !== -1 ? form.model.slice(0, slash) : '';
  }, [form.model]);

  const providerOptions = useMemo((): SelectOption[] => {
    const seen = new Set<string>();
    return availableModels.reduce<SelectOption[]>((acc, m) => {
      const slash = m.indexOf('/');
      const prefix = slash !== -1 ? m.slice(0, slash) : '';
      if (prefix && !seen.has(prefix)) {
        seen.add(prefix);
        const info = PROVIDERS.find((p) => p.id === prefix);
        acc.push({ value: prefix, label: info?.name || prefix });
      }
      return acc;
    }, []);
  }, [availableModels]);

  const modelsForProvider = useMemo((): SelectOption[] => {
    return availableModels
      .filter((m) => m.startsWith(currentProvider + '/'))
      .map((m) => ({ value: m, label: m.slice(currentProvider.length + 1) }));
  }, [availableModels, currentProvider]);

  const handleProviderChange = (provider: string) => {
    const first = availableModels.find((m) => m.startsWith(provider + '/'));
    setForm((f) => ({ ...f, model: first ?? '' }));
  };

  if (loading) {
    return <p className="hint">Loading…</p>;
  }

  return (
    <div className="route-fade max-w-[820px]">
      <BackLink to="/routines">Routines</BackLink>
      <PageHeader title={`${isEdit ? 'Edit' : 'New'} Routine`} />

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="form-row">
          <label>Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-row">
          <label>Prompt</label>
          <div className="hint">What the agent should do when a trigger fires.</div>
          <textarea
            className="textarea"
            value={form.prompt}
            onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="form-row !mb-0">
            <label>Provider</label>
            <SelectDropdown
              value={currentProvider}
              onChange={handleProviderChange}
              options={providerOptions}
              placeholder="Select a provider…"
            />
          </div>
          <div className="form-row !mb-0">
            <label>Model</label>
            <SelectDropdown
              value={form.model}
              onChange={(v) => setForm((f) => ({ ...f, model: v }))}
              options={modelsForProvider}
              placeholder="Select a model…"
              filterable
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="form-row">
          <label>Temperature</label>
          <div className="hint">
            Controls randomness (0.0 = deterministic, 1.0 = creative). Leave empty to use the model
            default.
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={form.temperature ?? 0.7}
              disabled={form.temperature === null}
              onChange={(e) => setForm((f) => ({ ...f, temperature: parseFloat(e.target.value) }))}
              className="flex-1 accent-accent"
            />
            <span className="font-mono text-body-sm w-8 text-right">
              {form.temperature !== null ? form.temperature.toFixed(1) : '—'}
            </span>
            <label className="flex items-center gap-1.5 text-body-sm cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={form.temperature === null}
                onChange={(e) =>
                  setForm((f) => ({ ...f, temperature: e.target.checked ? null : 0.7 }))
                }
              />
              Use default
            </label>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <label className="block mb-1">Permissions</label>
          <div className="hint mb-3">
            The sandbox this routine runs inside. Ask-first is the default; tighten or relax per
            capability.
          </div>

          {PERM_DEFS.map((def) => (
            <PermissionRow
              key={def.key}
              def={def}
              value={form.permissions[def.key]}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  permissions: { ...f.permissions, [def.key]: v },
                }))
              }
            />
          ))}

          {/* Advanced permissions */}
          <details className="mt-1">
            <summary className="text-body-sm text-fg-dim cursor-pointer select-none py-1.5 hover:text-foreground">
              Advanced permissions
            </summary>
            <div className="mt-1.5">
              {ADVANCED_PERM_DEFS.map((def) => (
                <PermissionRow
                  key={def.key}
                  def={def}
                  value={form.permissions[def.key]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      permissions: { ...f.permissions, [def.key]: v },
                    }))
                  }
                />
              ))}
            </div>
          </details>
        </div>

        {/* Triggers */}
        <div>
          <label className={'block mb-1'}>Triggers</label>
          <div className={'hint mb-2.5'}>
            Zero or more · any trigger starts the routine. No triggers = manual only.
          </div>

          {triggerDrafts.map((draft, i) => (
            <TriggerCard
              key={i}
              draft={draft}
              index={i}
              onChange={(d) => updateDraft(i, d)}
              onRemove={() => removeDraft(i)}
              hasMounts={hasMounts}
              resolveHostPath={resolveHostPath}
              onPickFolder={openFolderPickerForTrigger}
              collapsed={collapsedTriggers.has(i)}
              onToggleCollapse={() => toggleCollapse(i)}
            />
          ))}

          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-[6px] text-body-sm text-accent font-medium cursor-pointer border-0 bg-transparent hover:bg-accent-soft"
              onClick={() => setShowTriggerPicker(!showTriggerPicker)}
            >
              + Add trigger
            </button>
          </div>

          {showTriggerPicker && (
            <div className="border border-border rounded-lg bg-surface-hi p-4 mt-1 shadow-md">
              <div className="text-micro uppercase tracking-caps text-muted-foreground font-semibold mb-3">
                Choose a trigger type
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-surface hover:border-accent hover:shadow-sm cursor-pointer text-left transition-all duration-default ease-default"
                  onClick={() => addTrigger('cron')}
                >
                  <span className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-body-sm">Schedule</div>
                    <div className="text-micro text-fg-dim mt-0.5">
                      Fire on a time or cron — hourly, daily, weekdays...
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-surface hover:border-accent hover:shadow-sm cursor-pointer text-left transition-all duration-default ease-default"
                  onClick={() => addTrigger('watcher')}
                >
                  <span className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                      <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v11A2.5 2.5 0 0 0 4.5 18h11a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 15.5 5H10L8.4 3.2A2 2 0 0 0 6.8 2.5H4.5Z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-body-sm">Filesystem</div>
                    <div className="text-micro text-fg-dim mt-0.5">
                      Fire when files or folders are created, changed, or deleted.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Run mode */}
        <div>
          <label className={'block mb-3'}>Run mode</label>
          {[
            { id: 'foreground', label: 'Foreground', desc: 'only runs while the app is open' },
            {
              id: 'background',
              label: 'Background',
              desc: 'runs on schedule even when the app is closed',
            },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 py-2.5 cursor-pointer text-sm">
              <input
                type="radio"
                name="runMode"
                value={opt.id}
                checked={form.run_mode === opt.id}
                onChange={() =>
                  setForm((f) => ({ ...f, run_mode: opt.id as 'background' | 'foreground' }))
                }
                className="w-[18px] h-[18px] accent-accent shrink-0 cursor-pointer"
              />
              <span>
                <span className="font-semibold">{opt.label}</span>
                <span className="text-muted-foreground font-normal"> — {opt.desc}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 mt-2.5">
          <button
            type="submit"
            disabled={submitting}
            className={classNames('btn primary', { 'opacity-50': submitting })}
          >
            {submitting ? 'Saving…' : 'Save routine'}
          </button>
          <Link to={isEdit ? `/routines/${id}` : '/routines'} className="btn">
            Cancel
          </Link>
        </div>
      </form>

      {showFolderPicker && (
        <FolderPicker
          value=""
          onChange={handleFolderPicked}
          onClose={() => {
            setShowFolderPicker(false);
            setFolderPickerTarget(null);
          }}
        />
      )}
    </div>
  );
}
