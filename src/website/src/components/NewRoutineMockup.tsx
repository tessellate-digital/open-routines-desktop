export function NewRoutineMockup({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="route-fade">
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">New Routine</h1>
        </div>
      </div>

      <div className="space-y-0">
        <div className="form-row">
          <label>Name</label>
          <input className="input" defaultValue="PR review digest" readOnly />
        </div>

        <div className="form-row">
          <label>Prompt</label>
          <textarea
            className="textarea"
            rows={4}
            defaultValue={
              'Review all open PRs. Summarise changes,\nflag risks, and suggest reviewers\nbased on code ownership.'
            }
            readOnly
          />
        </div>

        <div className="form-row">
          <label>Model</label>
          <div className="input flex items-center justify-between cursor-pointer">
            <span className="font-mono text-code">anthropic/claude-sonnet-4-6</span>
            <span className="text-fg-dim">▾</span>
          </div>
        </div>

        <div className="form-row">
          <label>Triggers</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between border border-border-strong rounded-md bg-surface-hi px-3 py-[9px] text-body-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted">
                  cron
                </span>
                <span className="font-mono text-code text-fg-muted">daily at 09:00</span>
              </div>
              <button className="text-xs font-medium text-destructive">Remove</button>
            </div>
            <div className="flex items-center justify-between border border-border-strong rounded-md bg-surface-hi px-3 py-[9px] text-body-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted">
                  watcher
                </span>
                <span className="font-mono text-code text-fg-muted">~/projects</span>
              </div>
              <button className="text-xs font-medium text-destructive">Remove</button>
            </div>
            <button className="text-xs font-medium text-accent">+ Add trigger</button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn primary" onClick={() => onNavigate?.('routines')}>
            Save routine
          </button>
          <button className="btn" onClick={() => onNavigate?.('routines')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
