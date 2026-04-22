import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { useGlobalSSE } from '../hooks/useSSE';
import { RunsTable, StatusBadge } from '../components/RunsTable';
import { BackLink } from '../components/BackLink';
import { PageHeader } from '../components/PageHeader';
import { SectionLabel } from '../components/SectionLabel';
import { EventChip } from '../components/EventChip';
import type { Routine, Trigger, Run, RoutinePermissions, PermissionLevel } from '../lib/types';
import { useHostMounts } from '../contexts/HostMountsContext';
import { usePageContext } from '../contexts/PageContext';

const trigCardClasses = 'border border-border-strong rounded-md bg-surface-hi overflow-hidden mb-2';
const trigHeadClasses = 'flex items-center gap-2.5 py-2.5 px-3.5 cursor-default';
const trigLabelClasses = 'font-medium text-body';
const trigSummaryClasses = 'font-mono text-xs text-fg-dim';

function TriggerSummary({ trigger }: { trigger: Trigger }) {
  const { resolveHostPath } = useHostMounts();
  const cfg = trigger.config;

  if (trigger.type === 'cron') {
    return (
      <div className={trigCardClasses}>
        <div className={trigHeadClasses}>
          <span className={trigLabelClasses}>Cron</span>
          <span className={trigSummaryClasses}>{String(cfg.expression || '')}</span>
          <span className="code-chip ml-2">{String(cfg.expression || '')}</span>
        </div>
      </div>
    );
  }

  if (trigger.type === 'watcher') {
    const events = Array.isArray(cfg.events) ? (cfg.events as string[]) : [];
    const paths: string[] = Array.isArray(cfg.paths)
      ? (cfg.paths as string[])
      : typeof cfg.path === 'string' && cfg.path
        ? [cfg.path as string]
        : [];
    const recursive = cfg.recursive !== false;
    const fileFilter = cfg.fileFilter as { mode?: string; patterns?: string[] } | undefined;
    const hasFilter =
      fileFilter &&
      fileFilter.mode !== 'none' &&
      Array.isArray(fileFilter.patterns) &&
      fileFilter.patterns.length > 0;
    return (
      <div className={trigCardClasses}>
        <div className={`${trigHeadClasses} flex-wrap gap-1.5`}>
          <span className={trigLabelClasses}>Filesystem</span>
          <span className={`${trigSummaryClasses} font-mono text-xs`}>
            {paths.map(resolveHostPath).join(', ') || '—'}
          </span>
          {!recursive && <span className="code-chip text-micro-sm">top-level only</span>}
        </div>
        <div className="px-3.5 pt-2 pb-3 border-t border-muted flex gap-2 flex-wrap items-center">
          <span className="font-mono text-micro text-fg-dim uppercase tracking-caps-tight">on</span>
          {events.map((ev) => (
            <EventChip key={ev}>{ev}</EventChip>
          ))}
          {hasFilter && (
            <>
              <span className="font-mono text-micro text-fg-dim uppercase tracking-caps-tight ml-2">
                {fileFilter.mode === 'exclude' ? 'except' : 'only'}
              </span>
              {fileFilter.patterns!.map((p) => (
                <span key={p} className="code-chip text-micro">
                  {p}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  if (trigger.type === 'api') {
    return (
      <div className={trigCardClasses}>
        <div className={trigHeadClasses}>
          <span className={trigLabelClasses}>API</span>
          <span className="code-chip">/hooks/api/{trigger.id}</span>
        </div>
      </div>
    );
  }

  if (trigger.type === 'github') {
    const events = Array.isArray(cfg.events) ? (cfg.events as string[]).join(', ') : '';
    return (
      <div className={trigCardClasses}>
        <div className={trigHeadClasses}>
          <span className={trigLabelClasses}>GitHub</span>
          <span className={trigSummaryClasses}>{events || '—'}</span>
        </div>
      </div>
    );
  }

  return null;
}

const detailCardClasses = 'py-4 px-[18px] bg-secondary border border-muted rounded-md';
const detailLabelClasses = 'font-mono text-micro-sm uppercase tracking-caps text-fg-dim mb-1.5';

export default function RoutineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageTitle } = usePageContext();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const [r, t, ru] = await Promise.all([
        api.getRoutine(id),
        api.getTriggers(id),
        api.getRuns({ routine_id: id, limit: 10 }),
      ]);
      setRoutine(r);
      setPageTitle(r.name);
      setTriggers(t);
      setRuns(ru);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id, setPageTitle]);

  useEffect(() => {
    load();
  }, [load]);
  useGlobalSSE(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleRun = async () => {
    if (!id) {
      return;
    }
    try {
      navigate(`/runs/${(await api.runRoutine(id)).run_id}`);
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    }
  };

  const handleToggle = async () => {
    if (!id || !routine) {
      return;
    }
    setToggling(true);
    try {
      const updated = await api.toggleRoutine(id, !routine.enabled);
      setRoutine(updated);
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    try {
      await api.deleteRoutine(id);
      navigate('/routines');
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    }
  };

  if (loading) {
    return null;
  }
  if (error) {
    return <p className="text-destructive text-body-sm">Error: {error}</p>;
  }
  if (!routine) {
    return <p className="text-destructive text-body-sm">Routine not found</p>;
  }

  return (
    <div className="route-fade">
      <BackLink to="/routines">Routines</BackLink>

      <PageHeader
        title={routine.name}
        subtitle={
          <span className="flex items-center gap-2">
            <StatusBadge status={routine.enabled ? 'success' : 'pending'} />
            <span>{routine.enabled ? 'enabled' : 'paused'}</span>
            {routine.description && <span>· {routine.description}</span>}
          </span>
        }
        actions={
          <div className="flex gap-2 items-center">
            {confirmDelete ? (
              <div className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-md bg-[#fff1f2] border border-[#fecdd3] text-body-sm [[data-theme='dark']_&]:bg-[rgba(251,113,133,0.08)] [[data-theme='dark']_&]:border-[rgba(251,113,133,0.25)] [[data-theme='dark']_&]:text-foreground">
                <span>
                  Delete <strong>{routine.name}</strong>?
                </span>
                <button className="btn sm delete-rt" onClick={handleDelete}>
                  Yes, delete
                </button>
                <button className="btn sm" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button className="btn run" onClick={handleRun}>
                  ▶ Run now
                </button>
                <Link to={`/routines/${id}/edit`} className="btn">
                  Edit
                </Link>
                <button
                  className="btn"
                  onClick={handleToggle}
                  disabled={toggling}
                  style={{ minWidth: '5rem', display: 'flex', justifyContent: 'center' }}
                >
                  {toggling ? '…' : routine.enabled ? 'Pause' : 'Enable'}
                </button>
                <button className="btn delete-rt" onClick={() => setConfirmDelete(true)}>
                  Delete
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-5">
        {/* Prompt */}
        <div className={detailCardClasses}>
          <div className={detailLabelClasses}>Prompt</div>
          <div className="font-mono text-body-sm leading-prose whitespace-pre-wrap mt-1">
            {routine.prompt}
          </div>
        </div>

        {/* Config grid */}
        <div className="grid grid-cols-2 gap-4">
          {(() => {
            const slash = (routine.model || '').indexOf('/');
            const provider = slash !== -1 ? routine.model.slice(0, slash) : '—';
            const model = slash !== -1 ? routine.model.slice(slash + 1) : routine.model || '—';
            return (
              <>
                <div className={detailCardClasses}>
                  <div className={detailLabelClasses}>Provider</div>
                  <div className="font-mono text-body-sm font-medium text-foreground">
                    {provider}
                  </div>
                </div>
                <div className={detailCardClasses}>
                  <div className={detailLabelClasses}>Model</div>
                  <div className="font-mono text-body-sm font-medium text-foreground">{model}</div>
                </div>
              </>
            );
          })()}
          <div className={detailCardClasses}>
            <div className={detailLabelClasses}>Run mode</div>
            <div className="text-sm font-medium text-foreground">
              {routine.run_mode === 'foreground' ? 'Foreground only' : 'Background'}
            </div>
          </div>
          {routine.repository && (
            <div className={detailCardClasses}>
              <div className={detailLabelClasses}>Repository</div>
              <div className="font-mono text-body-sm font-medium text-foreground">
                {routine.repository}
              </div>
            </div>
          )}
          {routine.repository && (
            <div className={detailCardClasses}>
              <div className={detailLabelClasses}>Branch</div>
              <div className="font-mono text-body-sm font-medium text-foreground">
                {routine.branch}
              </div>
            </div>
          )}
        </div>

        {/* Permissions */}
        {(() => {
          const perms = (routine.permissions ?? {}) as RoutinePermissions;
          const rows: { key: keyof RoutinePermissions; label: string }[] = [
            { key: 'edit', label: 'File editing' },
            { key: 'bash', label: 'Shell commands' },
            { key: 'webfetch', label: 'Web fetch' },
            { key: 'doom_loop', label: 'Loop prevention' },
          ];
          const chipStyle: Record<PermissionLevel, string> = {
            allow: 'bg-success/15 text-success',
            ask: 'bg-accent/15 text-accent',
            deny: 'bg-destructive/15 text-destructive',
          };
          const dotStyle: Record<PermissionLevel, string> = {
            allow: 'bg-success',
            ask: 'bg-accent',
            deny: 'bg-destructive',
          };
          return (
            <div>
              <SectionLabel>Permissions</SectionLabel>
              <div className={trigCardClasses}>
                <div className="px-3.5 py-2.5 flex gap-2 flex-wrap items-center">
                  {rows.map(({ key, label }) => {
                    const raw = perms[key];
                    const level: PermissionLevel =
                      typeof raw === 'string' ? (raw as PermissionLevel) : 'ask';
                    return (
                      <span
                        key={key}
                        className={classNames(
                          'inline-flex items-center gap-1.5 font-sans text-xs font-medium py-1 px-2.5 rounded-md',
                          chipStyle[level]
                        )}
                      >
                        <span
                          className={classNames(
                            'w-1.5 h-1.5 rounded-full flex-shrink-0',
                            dotStyle[level]
                          )}
                        />
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Triggers */}
        <div className="mt-4">
          <SectionLabel>Triggers · {triggers.length}</SectionLabel>
          {triggers.length > 0 ? (
            triggers.map((t) => <TriggerSummary key={t.id} trigger={t} />)
          ) : (
            <p className="hint">No triggers — this routine runs only when invoked manually.</p>
          )}
        </div>

        {/* Run history */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <SectionLabel className="mb-0">Recent runs · {runs.length}</SectionLabel>
            <Link
              to={`/routines/${id}/runs`}
              className="font-mono text-xs text-accent no-underline"
            >
              See all →
            </Link>
          </div>
          <RunsTable runs={runs} />
        </div>
      </div>
    </div>
  );
}
