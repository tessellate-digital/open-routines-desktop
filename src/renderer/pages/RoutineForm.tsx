import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { PROVIDERS } from '../lib/providers';
import type { Trigger, PermissionLevel, RoutinePermissions } from '../lib/types';
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

type TriggerType = 'cron' | 'watcher';

interface CronDraft {
  type: 'cron';
  expression: string;
}
interface WatcherDraft {
  type: 'watcher';
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
    paths,
    events: Array.isArray(t.config.events)
      ? (t.config.events as string[])
      : ['add', 'change', 'addDir'],
    fileFilter,
    recursive: t.config.recursive !== false,
  };
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
            <div className="grid gap-3.5">
              <div>
                <label className="text-xs text-fg-dim block mb-1.5">Watched paths</label>
                {draft.paths.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {draft.paths.map((p) => (
                      <span key={p} className={'code-chip inline-flex items-center gap-1'}>
                        {resolveHostPath(p).split('/').pop() || resolveHostPath(p)}
                        <button
                          type="button"
                          onClick={() =>
                            onChange({ ...draft, paths: draft.paths.filter((x) => x !== p) })
                          }
                          className="text-destructive cursor-pointer bg-transparent border-0 p-0"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {hasMounts !== false && (
                  <button type="button" className="btn sm" onClick={() => onPickFolder(index)}>
                    Add path
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                <input
                  type="checkbox"
                  checked={draft.recursive}
                  onChange={(e) => onChange({ ...draft, recursive: e.target.checked })}
                />
                <span>Watch subfolders</span>
              </label>
              <div>
                <label className="text-xs text-fg-dim block mb-1.5">Events</label>
                <div className="flex flex-wrap gap-2">
                  {FS_EVENTS.map(({ value, label }) => (
                    <button
                      type="button"
                      key={value}
                      className={classNames(
                        'py-1.5 px-3 rounded-md border text-caption cursor-pointer font-sans inline-flex items-center gap-1.5 transition-all duration-default ease-default',
                        draft.events.includes(value)
                          ? 'bg-accent-soft text-accent border-accent'
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
              <div>
                <label className="text-xs text-fg-dim block mb-1.5">File type filter</label>
                <FileTypeFilter
                  value={draft.fileFilter}
                  onChange={(v) => onChange({ ...draft, fileFilter: v })}
                />
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
      edit: 'allow' as PermissionLevel,
      bash: 'allow' as PermissionLevel,
      webfetch: 'allow' as PermissionLevel,
      doom_loop: 'ask' as PermissionLevel,
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
  const [addingTriggerType, setAddingTriggerType] = useState<TriggerType | null>(null);

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
              edit: 'allow',
              bash: 'allow',
              webfetch: 'allow',
              doom_loop: 'ask',
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
    setAddingTriggerType(null);
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
          <label className="block mb-3">Permissions</label>
          {(
            [
              { key: 'edit', label: 'File editing' },
              { key: 'bash', label: 'Shell commands' },
              { key: 'webfetch', label: 'Web fetch' },
              { key: 'doom_loop', label: 'Loop prevention' },
            ] as { key: keyof RoutinePermissions; label: string }[]
          ).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-body-sm">{label}</span>
              <PermissionRadio
                value={
                  typeof form.permissions[key] === 'string'
                    ? (form.permissions[key] as PermissionLevel)
                    : 'allow'
                }
                onChange={(level) =>
                  setForm((f) => ({
                    ...f,
                    permissions: { ...f.permissions, [key]: level },
                  }))
                }
              />
            </div>
          ))}
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

          {addingTriggerType === null ? (
            <div className="flex">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-[6px] text-body-sm text-accent font-medium cursor-pointer border-0 bg-transparent hover:bg-accent-soft"
                onClick={() => setAddingTriggerType('cron')}
              >
                + Add trigger
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <SelectDropdown
                value={addingTriggerType || 'cron'}
                onChange={(v) => setAddingTriggerType(v as 'cron' | 'watcher')}
                options={[
                  { value: 'cron', label: 'Cron (scheduled)' },
                  { value: 'watcher', label: 'Filesystem (watch for changes)' },
                ]}
                placeholder="Trigger type"
              />
              <button
                type="button"
                className="btn primary sm"
                onClick={() => addTrigger(addingTriggerType)}
              >
                Add
              </button>
              <button type="button" className="btn sm" onClick={() => setAddingTriggerType(null)}>
                Cancel
              </button>
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
