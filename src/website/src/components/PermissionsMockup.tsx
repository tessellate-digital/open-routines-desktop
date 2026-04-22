import { TriggerChip } from './shared';

type PermLevel = 'allow' | 'ask' | 'deny';

const LEVEL_STYLES: Record<PermLevel, { dot: string; label: string; chip: string }> = {
  allow: { dot: 'bg-success', label: 'text-success', chip: 'bg-success/10 border-success/20' },
  ask: { dot: 'bg-warning', label: 'text-warning', chip: 'bg-warning/10 border-warning/20' },
  deny: { dot: 'bg-fg-dim', label: 'text-fg-dim', chip: 'bg-muted border-muted' },
};

function PermChip({ label, level }: { label: string; level: PermLevel }) {
  const s = LEVEL_STYLES[level];
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${s.chip}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-body-sm font-medium">{label}</span>
      <span className={`font-mono text-xs ml-auto pl-2 ${s.label}`}>{level}</span>
    </div>
  );
}

export function PermissionsMockup() {
  return (
    <div className="route-fade space-y-5">
      {/* Routine header */}
      <div>
        <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Expense manager</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-mono">
          <TriggerChip label="watcher" />
          <span>·</span>
          <span className="text-fg-dim">~/Documents/Invoices/**</span>
        </div>
      </div>

      {/* Permission chips */}
      <div className="bg-secondary border border-muted rounded-lg shadow-sm p-4 space-y-2">
        <div className="font-mono text-micro uppercase tracking-caps text-fg-dim mb-3">
          Permissions
        </div>
        <PermChip label="File editing" level="allow" />
        <PermChip label="Shell commands" level="deny" />
        <PermChip label="Web fetch" level="deny" />
        <PermChip label="Loop prevention" level="ask" />
      </div>

      {/* Permission request dialog */}
      <div className="bg-secondary border border-warning/40 rounded-lg shadow-md p-4 space-y-3">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 16 16"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-warning shrink-0"
          >
            <path d="M8 2L1.5 13h13L8 2z" />
            <path d="M8 6v4M8 11.5v.5" />
          </svg>
          <span className="text-body-sm font-semibold">Permission request</span>
        </div>
        <p className="text-body-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Expense manager</span> tried to run a shell
          command. Shell commands are set to{' '}
          <span className="font-mono text-xs text-warning">deny</span> for this routine.
        </p>
        <div className="font-mono text-code bg-muted rounded px-3 py-2 text-fg-muted">
          bash: open expense_tracker.xlsx
        </div>
        <div className="flex gap-2 pt-1">
          <button className="btn primary text-xs py-1.5 px-3">Allow once</button>
          <button className="btn text-xs py-1.5 px-3">Always allow</button>
          <button className="btn text-xs py-1.5 px-3 text-destructive">Deny</button>
        </div>
      </div>
    </div>
  );
}
