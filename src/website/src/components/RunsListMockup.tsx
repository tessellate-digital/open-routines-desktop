import { MOCK_RUNS } from './mockData';
import { StatusBadge, TriggerChip, ChevronIcon } from './shared';

export function RunsListMockup({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="route-fade">
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Runs</h1>
          <div className="text-muted-foreground text-body-sm font-mono">
            Every execution, newest first
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex gap-1 p-[3px] bg-surface border border-muted rounded-full">
          <button className="py-[5px] px-3.5 rounded-full text-caption cursor-pointer font-sans border border-transparent bg-accent-soft text-accent font-medium">
            All
          </button>
          <button className="py-[5px] px-3.5 rounded-full text-caption text-muted-foreground cursor-pointer font-sans border border-transparent bg-transparent hover:text-foreground">
            Running
          </button>
          <button className="py-[5px] px-3.5 rounded-full text-caption text-muted-foreground cursor-pointer font-sans border border-transparent bg-transparent hover:text-foreground">
            Success
          </button>
          <button className="py-[5px] px-3.5 rounded-full text-caption text-muted-foreground cursor-pointer font-sans border border-transparent bg-transparent hover:text-foreground">
            Failed
          </button>
        </div>
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
