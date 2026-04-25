import { AppWindow } from './components/AppWindow';
import { InteractiveMockup } from './components/InteractiveMockup';
import { SettingsMockup } from './components/SettingsMockup';
import { PermissionsMockup } from './components/PermissionsMockup';
import { ChatMockup } from './components/ChatMockup';
import { PromptMockup } from './components/PromptMockup';

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
            Define repeatable AI workflows that run on your schedule, and handle the busywork.
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

        {/* ── OPEN SECTION ── */}
        <section className="border-y border-muted bg-surface/60">
          <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-20">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <div className="font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3">
                  Open
                </div>
                <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
                  Your models,{' '}
                  <span className="serif italic" style={{ color: '#ec4899' }}>
                    your compute.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  No vendor lock-in. Use GitHub Copilot, OpenAI, or any model you can run locally.
                  Your keys, your compute.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {[
                    'GitHub Copilot',
                    'Anthropic',
                    'OpenAI',
                    'OpenRouter',
                    'Google Vertex',
                    'Amazon Bedrock',
                    'DeepSeek',
                    'Groq',
                    'Ollama',
                    'xAI',
                  ].map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center rounded-full border border-accent/30 bg-canvas px-3 py-1.5 text-[12px] font-medium text-foreground/70"
                    >
                      {name}
                    </span>
                  ))}
                  {[
                    'Together AI',
                    'Fireworks AI',
                    'Cerebras',
                    'Hugging Face',
                    'Azure OpenAI',
                    'Nvidia',
                    'Deep Infra',
                    'Scaleway',
                    'Vercel AI',
                  ].map((name) => (
                    <span
                      key={name}
                      className="hidden md:inline-flex items-center rounded-full border border-accent/30 bg-canvas px-3 py-1.5 text-[12px] font-medium text-foreground/70"
                    >
                      {name}
                    </span>
                  ))}
                  <span className="text-[12px] text-fg-dim font-medium">and more</span>
                </div>
              </div>

              <AppWindow
                active="settings"
                breadcrumbs={[{ label: 'Settings' }]}
                height={620}
                scrollable={false}
              >
                <SettingsMockup />
              </AppWindow>
            </div>
          </div>
        </section>

        {/* ── CONTROL SECTION ── */}
        <section className="border-t border-muted bg-surface/60">
          <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-24">
            <div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
              <div className="md:sticky md:top-20">
                <div className="font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3">
                  Control
                </div>
                <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[40px]">
                  You decide what runs, when,{' '}
                  <span className="serif italic" style={{ color: '#ec4899' }}>
                    and what it can do.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  On schedule, when files change, or on demand. Every routine carries its own
                  permission set.
                </p>
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

        {/* ── CONNECTED SECTION ── */}
        <section className="border-t border-muted bg-surface/60">
          <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-20">
            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Text — first on mobile, right on desktop */}
              <div className="md:order-2">
                <div className="font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3">
                  Integrations
                </div>
                <h2 className="text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
                  Hello <span className="serif italic gradient-shimmer">world.</span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Routines go beyond your file system. Connect your favourite tools and let routines
                  work across them.
                </p>
                <div className="mt-6 flex items-center gap-3 text-muted-foreground text-body-sm">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-muted bg-canvas">
                    <svg viewBox="0 0 256 193" width="18" height="18" fill="none">
                      <path
                        fill="#4285F4"
                        d="M58.182 192.05V93.14L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"
                      />
                      <path
                        fill="#34A853"
                        d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-58.182 43.635z"
                      />
                      <path
                        fill="#EA4335"
                        d="M58.182 93.14V17.504L128 69.868l69.818-52.364V93.14L128 145.504z"
                      />
                      <path
                        fill="#FBBC04"
                        d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"
                      />
                      <path
                        fill="#C5221F"
                        d="M0 49.504l58.182 43.636V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-muted bg-canvas">
                    <svg viewBox="0 0 256 268" width="18" height="18" fill="none">
                      <path
                        fill="#FFF"
                        d="M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188"
                      />
                      <path
                        fill="#000"
                        d="M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921M212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404z"
                      />
                    </svg>
                  </span>
                  <span className="text-fg-dim">... and more (soon)</span>
                </div>
              </div>

              {/* Mockup — second on mobile, left on desktop */}
              <div className="md:order-1">
                <AppWindow
                  active="routines"
                  breadcrumbs={[{ label: 'Routines' }, { label: 'Invoice tracker' }]}
                  height={520}
                  scrollable={false}
                >
                  <PromptMockup />
                </AppWindow>
              </div>
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
            <a href="./privacy.html" className="hover:text-foreground">
              Privacy
            </a>
            <a href="./terms.html" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
