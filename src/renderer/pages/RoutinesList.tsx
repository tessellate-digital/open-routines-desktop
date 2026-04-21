import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { FilterTabs } from '../components/FilterTabs';
import type { FilterValue } from '../components/FilterTabs';
import { useGlobalSSE } from '../hooks/useSSE';
import { StatusBadge } from '../components/RunsTable';
import { DataTable, TableRow, TableCell } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { EmptyState } from '../components/EmptyState';
import type { Routine } from '../lib/types';

function ChevronIcon() {
  return (
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
  );
}

export default function RoutinesList() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setRoutines(await api.getRoutines(filter !== 'all' ? { status: filter } : undefined));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);
  useGlobalSSE(
    useCallback(() => {
      load();
    }, [load])
  );

  if (error) {
    return <p className="text-destructive text-body-sm">Error: {error}</p>;
  }

  const filtered = routines.filter((r) => {
    if (!search) {
      return true;
    }
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
  });

  return (
    <div className="route-fade">
      <PageHeader
        title="Routines"
        subtitle={`${routines.length} routine${routines.length !== 1 ? 's' : ''}`}
        actions={
          <Link to="/routines/new" className="btn primary">
            + New routine
          </Link>
        }
      />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <FilterTabs value={filter} onChange={setFilter} />
        <SearchBox value={search} onChange={setSearch} placeholder="Filter routines…" />
      </div>

      {filtered.length > 0 ? (
        <DataTable columns={['Routine', 'Triggers', 'Last status', 'Enabled', '']}>
          {filtered.map((r) => (
            <TableRow key={r.id} onClick={() => navigate(`/routines/${r.id}`)}>
              <TableCell>
                <div className="font-medium text-body text-foreground">{r.name}</div>
                <div className="font-mono text-micro text-fg-dim mt-0.5">
                  {r.model || 'default'}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">
                  {r.triggers_count} trigger{r.triggers_count !== 1 ? 's' : ''}
                </span>
              </TableCell>
              <TableCell>
                {r.last_run_status ? (
                  <StatusBadge status={r.last_run_status} />
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-pending">
                    <span className="w-[7px] h-[7px] rounded-full bg-current shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_22%,transparent)]" />
                    idle
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={classNames({
                    'text-success font-medium': r.enabled,
                    'text-fg-dim font-normal': !r.enabled,
                  })}
                >
                  {r.enabled ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell className="text-right text-fg-dim [&_svg]:w-3.5 [&_svg]:h-3.5">
                <ChevronIcon />
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      ) : routines.length === 0 && filter === 'all' && !loading ? (
        <EmptyState
          icon={
            <div className="w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-[#4f46e5] to-[#c5b8ff] grid place-items-center text-white shadow-[0_12px_40px_rgba(79,70,229,0.3)] animate-[float_4s_ease-in-out_infinite]">
              <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor" stroke="none">
                <path d="M8 1.5 9.4 6 14 7.4 9.4 8.8 8 13.3 6.6 8.8 2 7.4 6.6 6 8 1.5z" />
              </svg>
            </div>
          }
          title="Nothing scheduled yet"
          description="Routines run a prompt when a trigger fires — on a schedule, or when files change. Set your first one up in under a minute."
          actions={
            <Link to="/routines/new" className="btn primary">
              + New routine
            </Link>
          }
        />
      ) : routines.length === 0 && filter !== 'all' ? (
        <EmptyState title={`No routines with status "${filter}".`} />
      ) : (
        <EmptyState title="No routines match your search." />
      )}
    </div>
  );
}
