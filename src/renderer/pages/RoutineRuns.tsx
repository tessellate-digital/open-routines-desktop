import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { FilterTabs } from '../components/FilterTabs';
import type { FilterValue } from '../components/FilterTabs';
import { DataTable, TableRow, TableCell } from '../components/DataTable';
import { useGlobalSSE } from '../hooks/useSSE';
import { StatusBadge } from '../components/RunsTable';
import { timeAgo, duration } from '../lib/utils';
import { BackLink } from '../components/BackLink';
import { PageHeader } from '../components/PageHeader';
import { SearchBox } from '../components/SearchBox';
import { EventChip } from '../components/EventChip';
import type { Routine, Run } from '../lib/types';
import { usePageContext } from '../contexts/PageContext';

const PAGE_SIZE = 15;

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

export default function RoutineRuns() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageTitle } = usePageContext();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }
    api
      .getRoutine(id)
      .then((r) => {
        setRoutine(r);
        setPageTitle(r.name);
      })
      .catch(() => {});
  }, [id, setPageTitle]);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const results = await api.getRuns({
        limit: PAGE_SIZE + 1,
        offset: page * PAGE_SIZE,
        status: filter !== 'all' ? filter : undefined,
        routine_id: id,
      });
      setHasNext(results.length > PAGE_SIZE);
      setRuns(results.slice(0, PAGE_SIZE));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, [id, page, filter]);

  useEffect(() => {
    load();
  }, [load]);

  useGlobalSSE(
    useCallback(() => {
      if (page !== 0) {
        setPage(0);
      } else {
        load();
      }
    }, [page, load])
  );

  if (error) {
    return <p className="text-destructive text-body-sm">Error: {error}</p>;
  }

  const filtered = runs.filter((r) => {
    if (!search) {
      return true;
    }
    const q = search.toLowerCase();
    return r.id.includes(q);
  });

  return (
    <div className="route-fade">
      <BackLink to={`/routines/${id}`}>{routine?.name ?? '…'}</BackLink>

      <PageHeader title="Runs" subtitle={routine ? `All executions of ${routine.name}` : '…'} />

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <FilterTabs
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(0);
          }}
        />
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search runs…"
          className="ml-auto"
        />
      </div>

      <DataTable columns={['Run', 'Trigger', 'Status', 'Duration', 'Started', '']}>
        {filtered.map((r) => (
          <TableRow key={r.id} onClick={() => navigate(`/runs/${r.id}`)}>
            <TableCell>
              <span className="font-mono text-xs text-muted-foreground">{r.id.slice(0, 8)}</span>
            </TableCell>
            <TableCell>
              <EventChip>{r.trigger_type}</EventChip>
            </TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs text-muted-foreground">
                {duration(r.started_at, r.finished_at)}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs text-muted-foreground">
                {timeAgo(r.started_at)}
              </span>
            </TableCell>
            <TableCell className="text-right text-fg-dim [&_svg]:w-3.5 [&_svg]:h-3.5">
              <ChevronIcon />
            </TableCell>
          </TableRow>
        ))}
        {filtered.length === 0 && (
          <tr>
            <td colSpan={6} className="p-12 text-center text-muted-foreground">
              No runs match.
            </td>
          </tr>
        )}
      </DataTable>

      <div className="flex items-center justify-between py-3 px-[18px] font-mono text-xs text-muted-foreground border-t border-muted bg-surface rounded-b-lg">
        <button className="btn sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          ← Prev
        </button>
        <span>Page {page + 1}</span>
        <button className="btn sm" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
