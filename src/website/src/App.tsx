import { AppWindow } from './components/AppWindow';
import { InteractiveMockup } from './components/InteractiveMockup';
import { NewRoutineMockup } from './components/NewRoutineMockup';
import { PermissionsMockup } from './components/PermissionsMockup';
import { ChatMockup } from './components/ChatMockup';

export function App() {
  return (
    <div className="min-h-screen bg-canvas relative">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute w-[800px] h-[600px] -top-[10%] -left-[15%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute w-175 h-125 top-[5%] -right-[15%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(236,72,153,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute w-225 h-175 -bottom-[20%] left-[10%] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="max-w-[1280px] mx-auto px-6 pb-10 pt-14 text-center md:pb-16 md:pt-28">
          <h1 className="mt-6 text-balance text-[44px] font-semibold leading-[1.05] tracking-tight md:text-[68px]">
            Automate
            <br />
            <span className="serif italic text-accent">The boring parts.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
            Define repeatable AI workflows that watch your files, run on schedule, and handle the
            busywork.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="https://github.com/tessellate-digital/open-routines-desktop/releases"
              className="btn primary"
            >
              Download for macOS
            </a>
            <a
              href="https://github.com/tessellate-digital/open-routines-desktop"
              className="btn flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>

        {/* ── HERO MOCKUP — Interactive Dashboard ── */}
        <section className="max-w-5xl mx-auto px-6 pb-10 md:pb-24">
          <InteractiveMockup />
        </section>

        {/* ── TRIGGERS SECTION ── */}
        <section className="border-y border-muted bg-surface/60">
          <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-20">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3">
                  Triggers
                </div>
                <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
                  All kinds of{' '}
                  <span className="serif italic" style={{ color: '#ec4899' }}>
                    when
                  </span>
                  .
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Schedule routines on a cron expression, watch a directory and react the moment
                  files change, or summon one straight from chat — more trigger types on the way.
                </p>
                <div className="mt-7 space-y-3">
                  <div className="card p-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center font-mono text-xs text-accent py-0.5 px-2 rounded bg-accent-soft">
                        cron
                      </span>
                      <span className="text-label font-medium">On a schedule</span>
                    </div>
                    <div className="mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted">
                      0 9 * * 1-5 → weekday standup digest
                    </div>
                  </div>
                  <div className="card p-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center font-mono text-xs py-0.5 px-2 rounded bg-muted text-muted-foreground">
                        watcher
                      </span>
                      <span className="text-label font-medium">On a file event</span>
                    </div>
                    <div className="mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted">
                      watch ~/screenshots → auto-OCR &amp; file
                    </div>
                  </div>
                  <div className="card p-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center font-mono text-xs py-0.5 px-2 rounded bg-muted text-muted-foreground">
                        manual
                      </span>
                      <span className="text-label font-medium">On demand</span>
                    </div>
                    <div className="mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted">
                      &quot;summarise my PRs&quot; → summon from chat
                    </div>
                  </div>
                  <p className="font-mono text-xs text-fg-dim pl-1">… and more to come.</p>
                </div>
              </div>

              <AppWindow
                active="routines"
                breadcrumbs={[{ label: 'Routines' }, { label: 'New routine' }]}
                height={700}
                scrollable={false}
              >
                <NewRoutineMockup />
              </AppWindow>
            </div>
          </div>
        </section>

        {/* ── PERMISSIONS SECTION ── */}
        <section className="border-t border-muted bg-surface/60">
          <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-24">
            <div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
              <div className="md:sticky md:top-20">
                <div className="font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3">
                  Permissions
                </div>
                <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[40px]">
                  Each routine,{' '}
                  <span className="serif italic" style={{ color: '#ec4899' }}>
                    its own rules.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Every routine has its own permission set. Disable shell access for one that only
                  reads files. Block network calls for one that stays local. Set anything sensitive
                  to <span className="font-mono text-xs text-foreground">ask</span> and it&apos;ll
                  prompt you before acting.
                </p>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  It won&apos;t delete your hard drive if it doesn&apos;t have shell access.
                </p>
                <div className="mt-6 space-y-2 text-body-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>Per-routine, not per-app.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>Allow, ask, or deny — per tool category.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>No silent escalation.</span>
                  </div>
                </div>
              </div>

              <AppWindow
                active="routines"
                breadcrumbs={[{ label: 'Routines' }, { label: 'Expense manager' }]}
                height={700}
                scrollable={false}
              >
                <PermissionsMockup />
              </AppWindow>
            </div>
          </div>
        </section>

        {/* ── Q&A CHAT SECTION ── */}
        <section className="max-w-[1280px] mx-auto px-6 py-10 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-8 md:mb-14">
            <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
              <span className="serif italic">Hey chat?</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <AppWindow
              active="runs"
              breadcrumbs={[{ label: 'Open Routines' }]}
              height={680}
              scrollable={false}
            >
              <ChatMockup />
            </AppWindow>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="max-w-[1280px] mx-auto px-6 py-12 md:py-28">
          <div
            className="relative overflow-hidden rounded-2xl px-10 py-16 text-center text-accent-foreground bg-accent"
            style={{ boxShadow: '0 8px 32px rgba(79,70,229,0.3)' }}
          >
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <h2 className="relative text-balance text-[36px] font-semibold leading-tight tracking-tight md:text-[48px]">
              What you want, when you want.
              <br />
              <span className="serif italic opacity-90">Forever.</span>
            </h2>
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/tessellate-digital/open-routines-desktop/releases"
                className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold shadow-md text-accent"
              >
                Download for macOS
              </a>
              <a
                href="https://github.com/tessellate-digital/open-routines-desktop"
                className="rounded-lg border border-white/30 px-5 py-2.5 text-[14px] font-medium text-white/90 hover:bg-white/10"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-muted">
          <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-center gap-5 py-8 text-caption-sm text-muted-foreground">
            <a
              href="https://github.com/tessellate-digital/open-routines-desktop"
              className="hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://github.com/tessellate-digital/open-routines-desktop/releases"
              className="hover:text-foreground"
            >
              Releases
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
