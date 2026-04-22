import { MOCK_RUNS } from './mockData';
import { StatusBadge, TriggerChip, ChevronIcon } from './shared';

export function DashboardMockup({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const running = MOCK_RUNS.filter((r) => r.status === 'running').length;
  const failed = MOCK_RUNS.filter((r) => r.status === 'failed').length;
  const success = MOCK_RUNS.filter((r) => r.status === 'success').length;

  return (
    <div className="route-fade">
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Overview</h1>
          <div className="text-muted-foreground text-body-sm font-mono">
            3 routines · {MOCK_RUNS.length} recent runs
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn primary" onClick={() => onNavigate?.('routines/new')}>
            + New Routine
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-[22px]">
        <div className="py-[14px] px-4 bg-secondary border border-muted rounded-md shadow-sm">
          <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim">
            Routines
          </div>
          <div className="text-title font-semibold tracking-[-0.01em] mt-1 tabular-nums">3</div>
        </div>
        <div className="py-[14px] px-4 bg-secondary border border-muted rounded-md shadow-sm">
          <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim">Running</div>
          <div className="text-title font-semibold tracking-[-0.01em] mt-1 tabular-nums text-running">
            {running}
          </div>
        </div>
        <div className="py-[14px] px-4 bg-secondary border border-muted rounded-md shadow-sm">
          <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim">
            Recent failures
          </div>
          <div
            className={`text-title font-semibold tracking-[-0.01em] mt-1 tabular-nums ${failed > 0 ? 'text-destructive' : ''}`}
          >
            {failed}
          </div>
          {success > 0 && (
            <div className="font-mono text-micro text-muted-foreground mt-0.5">
              {success} success
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-micro uppercase tracking-caps text-muted-foreground font-semibold">
          Recent runs
        </div>
        <span
          className="font-mono text-xs text-accent cursor-pointer"
          onClick={() => onNavigate?.('runs')}
        >
          View all →
        </span>
      </div>

      <div className="bg-secondary border border-muted rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Routine', 'Trigger', 'Status', 'Duration', 'Started', ''].map((h) => (
                <th
                  key={h || '__empty'}
                  className="text-left font-mono text-micro-sm font-medium uppercase tracking-caps text-fg-dim py-3 px-[18px] border-b border-muted bg-surface"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RUNS.map((r) => (
              <tr
                key={r.id}
                className="cursor-pointer transition-colors border-b border-muted last:border-b-0 hover:bg-muted"
                onClick={() => onNavigate?.(`run/${r.id}`)}
              >
                <td className="py-3.5 px-[18px] text-body-sm align-middle">
                  <div className="font-medium text-body text-foreground">{r.routine_name}</div>
                </td>
                <td className="py-3.5 px-[18px] text-body-sm align-middle">
                  <TriggerChip label={r.trigger_type} />
                </td>
                <td className="py-3.5 px-[18px] text-body-sm align-middle">
                  <StatusBadge status={r.status} />
                </td>
                <td className="py-3.5 px-[18px] text-body-sm align-middle">
                  <span className="font-mono text-xs text-muted-foreground">{r.duration}</span>
                </td>
                <td className="py-3.5 px-[18px] text-body-sm align-middle">
                  <span className="font-mono text-xs text-muted-foreground">{r.started}</span>
                </td>
                <td className="py-3.5 px-[18px] text-body-sm align-middle text-right text-fg-dim">
                  <ChevronIcon />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
