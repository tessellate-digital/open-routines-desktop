import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

/**
 * Renders a macOS-like window chrome wrapping the app layout.
 * On mobile the chrome is hidden and only the content is shown.
 */
export function AppWindow({
  active,
  breadcrumbs,
  children,
  height = 480,
  scrollable = true,
  onNavigate,
  onBack,
}: {
  active: 'dashboard' | 'routines' | 'runs' | 'settings';
  breadcrumbs: { label: string; onClick?: () => void }[];
  children: ReactNode;
  height?: number | string;
  scrollable?: boolean;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-muted shadow-md md:border-border-strong md:shadow-lg">
      <div
        className="relative bg-canvas md:bg-[radial-gradient(900px_600px_at_0%_100%,rgba(168,85,247,0.18)_0%,transparent_60%),radial-gradient(800px_500px_at_30%_0%,rgba(79,70,229,0.14)_0%,transparent_60%),radial-gradient(600px_400px_at_100%_80%,rgba(236,72,153,0.12)_0%,transparent_60%)] md:bg-surface app-window-chrome"
        style={
          {
            '--app-height': typeof height === 'number' ? `${height}px` : height,
          } as React.CSSProperties
        }
      >
        <div className="md:flex md:h-full relative z-1">
          {/* Sidebar — desktop only */}
          <div className="hidden md:block">
            <Sidebar active={active} onNavigate={onNavigate} />
          </div>

          <div className="md:flex-1 md:flex flex-col min-w-0 md:overflow-hidden">
            {/* ContextToolbar — desktop only */}
            <div className="hidden md:flex items-center gap-2.5 px-5 h-11 bg-transparent backdrop-blur-[20px] shrink-0">
              {/* Traffic lights */}
              <div className="flex gap-1.5 mr-1">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              {/* Nav arrows */}
              <div className="flex gap-0.5">
                <button
                  className="w-7 h-7 rounded-sm border-none bg-transparent text-muted-foreground grid place-items-center p-0 cursor-pointer hover:bg-muted hover:text-foreground transition-all"
                  onClick={onBack}
                >
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
                    <path d="m10 3-5 5 5 5" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-sm border-none bg-transparent text-muted-foreground grid place-items-center p-0 opacity-30 cursor-not-allowed">
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
                </button>
              </div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1 text-body-sm font-medium text-foreground min-w-0">
                {breadcrumbs.map((c, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-fg-dim font-mono text-xs">/</span>}
                    {c.onClick ? (
                      <span
                        onClick={c.onClick}
                        className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        {c.label}
                      </span>
                    ) : (
                      <span className="text-foreground">{c.label}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="md:flex-1 md:bg-canvas md:border-t md:border-l md:border-muted md:rounded-tl-xl md:overflow-hidden">
              <div className={`md:h-full ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                <main className="max-w-[1060px] mx-auto w-full py-8 px-4 md:px-12 pb-20">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
