export function SettingsMockup() {
  return (
    <div className="route-fade max-w-[820px]">
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Settings</h1>
          <div className="text-muted-foreground text-body-sm font-mono">
            Manage providers, appearance and app configuration.
          </div>
        </div>
      </div>

      {/* Models section */}
      <div className="font-mono text-micro uppercase tracking-caps text-muted-foreground mb-4 font-semibold">
        Models
      </div>

      <div className="mb-9">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-section font-semibold mb-[3px]">Providers</div>
          </div>
          <button className="btn primary">Add provider</button>
        </div>

        <div className="grid gap-2">
          {/* GitHub Copilot */}
          <div className="border border-border rounded-md bg-surface-hi overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <div className="font-semibold text-label">GitHub Copilot</div>
                <div className="font-mono text-code text-fg-dim mt-[2px]">
                  Claude, GPT, and Gemini models
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-caption-sm font-medium text-success">
                <span className="w-2 h-2 rounded-full bg-success" />
                Connected
              </span>
              <button className="btn sm delete-rt">Remove</button>
            </div>
            <div className="border-t border-border">
              <div className="flex items-center justify-between px-4 py-2 text-xs">
                <span className="font-mono text-muted-foreground">GITHUB_TOKEN</span>
                <span className="font-mono">••••••••</span>
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="border border-border rounded-md bg-surface-hi overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <div className="font-semibold text-label">OpenAI</div>
                <div className="font-mono text-code text-fg-dim mt-[2px]">
                  GPT and o-series models
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-caption-sm font-medium text-success">
                <span className="w-2 h-2 rounded-full bg-success" />
                Connected
              </span>
              <button className="btn sm delete-rt">Remove</button>
            </div>
            <div className="border-t border-border">
              <div className="flex items-center justify-between px-4 py-2 text-xs">
                <span className="font-mono text-muted-foreground">OPENAI_API_KEY</span>
                <span className="font-mono">••••••••</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favourite models */}
      <div className="mb-9">
        <div className="mb-4">
          <div className="text-section font-semibold mb-[3px]">Favourite models</div>
          <div className="font-mono text-xs text-fg-muted leading-body">
            Favourite models appear first when selecting a model for a routine.
          </div>
        </div>
        <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim mb-[6px]">
          Favourites
        </div>
        <div className="bg-surface-2 border border-border rounded-lg shadow-md overflow-hidden">
          {[
            { provider: 'copilot', model: 'claude-sonnet-4-6' },
            { provider: 'copilot', model: 'claude-haiku-4-5' },
            { provider: 'openai', model: 'gpt-4o' },
          ].map((m, i, arr) => (
            <div
              key={m.model}
              className={`flex items-center gap-3 py-[10px] px-4 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="flex items-center gap-3 flex-1">
                <span className="font-mono text-micro-sm text-fg-dim uppercase tracking-caps-tight w-[80px] shrink-0">
                  {m.provider}
                </span>
                <span className="font-mono text-body">{m.model}</span>
              </span>
              <button className="btn sm delete-rt">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="font-mono text-micro uppercase tracking-caps text-muted-foreground mb-4 font-semibold">
        Display
      </div>
      <div className="mb-9">
        <div className="mb-4">
          <div className="text-section font-semibold mb-[3px]">Appearance</div>
          <div className="font-mono text-xs text-fg-muted leading-body">
            Customise the look and feel of the interface.
          </div>
        </div>
        <div className="bg-surface-2 border border-border rounded-lg shadow-md overflow-hidden py-2 px-5">
          <div className="flex items-center justify-between py-[10px]">
            <span className="text-body-sm font-medium">Theme</span>
            <div className="flex gap-1 p-[3px] bg-surface border border-muted rounded-full">
              <button className="py-1 px-3 rounded-full text-xs font-sans border border-transparent bg-accent-soft text-accent font-medium">
                Gradient
              </button>
              <button className="py-1 px-3 rounded-full text-xs text-muted-foreground font-sans border border-transparent bg-transparent">
                Light
              </button>
              <button className="py-1 px-3 rounded-full text-xs text-muted-foreground font-sans border border-transparent bg-transparent">
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
