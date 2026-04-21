import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import type { Run } from '../lib/types';
import { timeAgo, duration } from '../lib/utils';
import { DataTable, TableRow, TableCell } from './DataTable';
import { Card } from './Card';

const statusColorMap: Record<string, string> = {
  pending: 'text-pending',
  running: 'text-running',
  success: 'text-success',
  failed: 'text-destructive',
  cancelled: 'text-warning',
  lost: 'text-fg-dim',
  warning: 'text-warning',
  answered: 'text-success',
};

const statusLabelMap: Record<string, string> = {
  answered: 'answered',
};

export function StatusBadge({ status }: { status: string }) {
  const color = statusColorMap[status] ?? 'text-pending';
  const label = statusLabelMap[status] ?? status;
  const isRunning = status === 'running';
  return (
    <span className={classNames('inline-flex items-center gap-1.5 font-mono text-xs', color)}>
      <span
        className={classNames(
          'w-[7px] h-[7px] rounded-full bg-current shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_22%,transparent)]',
          { 'animate-pulse': isRunning }
        )}
      />
      <span>{label}</span>
    </span>
  );
}

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

/**
 * Renders a live-updating counter by directly mutating the DOM via a callback
 * ref. No React re-renders; the interval fires and writes textContent directly.
 * The interval is cleared automatically when the element unmounts or when
 * `endAt` is set (run finished).
 */
function LiveCounter({
  startAt,
  endAt,
  format,
}: {
  startAt: string;
  endAt: string | null;
  format: 'duration' | 'timeAgo';
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refCb = useCallback(
    (el: HTMLSpanElement | null) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!el) {
        return;
      }
      const compute = () => (format === 'duration' ? duration(startAt, endAt) : timeAgo(startAt));
      el.textContent = compute();
      if (!endAt) {
        intervalRef.current = setInterval(() => {
          el.textContent = compute();
        }, 1000);
      }
    },
    [startAt, endAt, format]
  );

  return <span className="font-mono text-xs text-muted-foreground" ref={refCb} />;
}

export function RunsTable({ runs }: { runs: Run[] }) {
  const navigate = useNavigate();

  if (!runs.length) {
    return (
      <Card>
        <div className="p-12 text-center text-muted-foreground">No runs yet.</div>
      </Card>
    );
  }

  return (
    <DataTable columns={['Routine', 'Trigger', 'Status', 'Duration', 'Started', '']}>
      {runs.map((r) => {
        const isActive = r.status === 'pending' || r.status === 'running';
        const effectiveStart = r.started_at ?? (isActive ? r.created_at : null);

        return (
          <TableRow key={r.id} onClick={() => navigate(`/runs/${r.id}`)}>
            <TableCell>
              <div className="font-medium text-body text-foreground">{r.routine_name}</div>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-[5px] font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted">
                <span>{r.trigger_type}</span>
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>
              {isActive && effectiveStart ? (
                <LiveCounter startAt={effectiveStart} endAt={r.finished_at} format="duration" />
              ) : (
                <span className="font-mono text-xs text-muted-foreground">
                  {duration(r.started_at, r.finished_at)}
                </span>
              )}
            </TableCell>
            <TableCell>
              {isActive && effectiveStart ? (
                <LiveCounter startAt={effectiveStart} endAt={null} format="timeAgo" />
              ) : (
                <span className="font-mono text-xs text-muted-foreground">
                  {timeAgo(r.started_at)}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right text-fg-dim [&_svg]:w-3.5 [&_svg]:h-3.5">
              <ChevronIcon />
            </TableCell>
          </TableRow>
        );
      })}
    </DataTable>
  );
}
