import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import type { Run } from '../lib/types';
import { timeAgo, duration } from '../lib/utils';

const statusClassMap: Record<string, string> = {
  pending: 'pending',
  running: 'running',
  success: 'success',
  failed: 'failed',
  cancelled: 'cancelled',
  lost: 'lost',
  warning: 'warning',
  answered: 'success',
};

const statusLabelMap: Record<string, string> = {
  answered: 'answered',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusClassMap[status] ?? 'pending';
  const label = statusLabelMap[status] ?? status;
  return (
    <span className={classNames('status', cls)}>
      <span className="dot" />
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

  return <span className="mono" ref={refCb} />;
}

export function RunsTable({ runs }: { runs: Run[] }) {
  const navigate = useNavigate();

  if (!runs.length) {
    return (
      <div className="card">
        <div className="p-12 text-center text-[color:var(--fg-muted)]">No runs yet.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="tbl">
        <thead>
          <tr>
            <th>Routine</th>
            <th>Trigger</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Started</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => {
            const isActive = r.status === 'pending' || r.status === 'running';
            // Fall back to created_at so the counter starts immediately even
            // before the backend sets started_at.
            const effectiveStart = r.started_at ?? (isActive ? r.created_at : null);

            return (
              <tr key={r.id} onClick={() => navigate(`/runs/${r.id}`)}>
                <td>
                  <div className="primary-cell">{r.routine_name}</div>
                </td>
                <td>
                  <span className="trig">
                    <span>{r.trigger_type}</span>
                  </span>
                </td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td>
                  {isActive && effectiveStart ? (
                    <LiveCounter startAt={effectiveStart} endAt={r.finished_at} format="duration" />
                  ) : (
                    <span className="mono">{duration(r.started_at, r.finished_at)}</span>
                  )}
                </td>
                <td>
                  {isActive && effectiveStart ? (
                    <LiveCounter startAt={effectiveStart} endAt={null} format="timeAgo" />
                  ) : (
                    <span className="mono">{timeAgo(r.started_at)}</span>
                  )}
                </td>
                <td className="chev">
                  <ChevronIcon />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
