import { StatusBadge, TriggerChip, ChevronIcon } from './shared';

const HERO_ROUTINES = [
  {
    id: 4 as const,
    name: 'Invoice tracker',
    model: 'claude-sonnet-4-6',
    triggerType: 'gmail',
    triggerLabel: 'subject:invoice',
    status: 'success',
  },
  {
    id: 1 as const,
    name: 'Expense manager',
    model: 'claude-sonnet-4-6',
    triggerType: 'watcher',
    triggerLabel: '~/Documents/Invoices/**',
    status: 'success',
  },
  {
    id: 2 as const,
    name: 'Doc drift check',
    model: 'claude-sonnet-4-6',
    triggerType: 'watcher',
    triggerLabel: 'services/*/openapi.yaml',
    status: 'success',
  },
  {
    id: 3 as const,
    name: 'News summary',
    model: 'claude-opus-4-6',
    triggerType: 'cron',
    triggerLabel: '0 7 * * 1-5',
    status: 'success',
  },
];

type RoutineId = 1 | 2 | 3 | 4;

export function RoutinesListMockup({
  onNavigate,
  autoHovered,
}: {
  onNavigate?: (page: string) => void;
  autoHovered?: RoutineId | null;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Routines</h1>
          <div className="text-muted-foreground text-body-sm font-mono">
            {HERO_ROUTINES.length} routines
          </div>
        </div>
      </div>

      <div className="bg-secondary border border-muted rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Routine', 'Trigger', 'Last run', ''].map((h) => (
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
            {HERO_ROUTINES.map((r) => {
              const isAutoHov = autoHovered === r.id;
              return (
                <tr
                  key={r.id}
                  className={`group cursor-pointer transition-all border-b border-muted last:border-b-0 ${
                    isAutoHov
                      ? 'shadow-[inset_3px_0_0_var(--color-accent)] bg-accent/[0.04]'
                      : 'shadow-[inset_3px_0_0_transparent] hover:shadow-[inset_3px_0_0_var(--color-accent)] hover:bg-accent/[0.04]'
                  }`}
                  onClick={() => onNavigate?.(`routine-chat/${r.id}`)}
                >
                  <td className="py-3.5 px-[18px] text-body-sm align-middle">
                    <div
                      className={`font-medium text-body transition-colors ${isAutoHov ? 'text-accent' : 'text-foreground group-hover:text-accent'}`}
                    >
                      {r.name}
                    </div>
                    <div className="font-mono text-micro text-fg-dim mt-0.5">{r.model}</div>
                  </td>
                  <td className="py-3.5 px-[18px] text-body-sm align-middle">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <TriggerChip label={r.triggerType} />
                      <span className="font-mono text-xs text-fg-dim">{r.triggerLabel}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-[18px] text-body-sm align-middle">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3.5 px-[18px] text-body-sm align-middle text-right text-fg-dim">
                    <div
                      className={`transition-transform ${isAutoHov ? 'translate-x-0.5 text-accent' : 'group-hover:translate-x-0.5 group-hover:text-accent'}`}
                    >
                      <ChevronIcon />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
