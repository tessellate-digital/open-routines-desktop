/**
 * Static replica of the real app's Sidebar — same classes, same SVGs.
 * Supports click handlers for interactive mode.
 */
export function Sidebar({
  active,
  onNavigate,
}: {
  active: 'dashboard' | 'routines' | 'runs' | 'settings';
  onNavigate?: (page: string) => void;
}) {
  const navCls = (key: string) =>
    `w-[52px] h-[52px] rounded-[14px] grid place-items-center transition-all ${
      active === key ? 'bg-accent-soft' : 'bg-transparent group-hover:bg-muted'
    }`;

  const iconCls = (key: string) =>
    `transition-colors ${active === key ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'}`;

  const labelCls = (key: string) =>
    `text-micro-xs font-medium transition-colors ${
      active === key ? 'text-accent' : 'text-muted-foreground'
    }`;

  const click = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  const interactive = !!onNavigate;

  return (
    <aside className="w-[100px] shrink-0 bg-transparent flex flex-col items-center gap-2 py-1.5 px-2 pb-2 overflow-hidden backdrop-blur-[12px] relative z-2 pt-[50px] text-foreground">
      {/* Brand */}
      <div onClick={click('dashboard')} className={interactive ? 'cursor-pointer' : ''}>
        <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-accent to-pink-500 grid place-items-center shadow-[0_2px_6px_rgba(79,70,229,0.3),0_1px_0_rgba(255,255,255,0.2)_inset]">
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      </div>

      {/* New */}
      <div
        className={`flex flex-col items-center gap-0.5 ${interactive ? 'group cursor-pointer' : ''}`}
        onClick={click('routines/new')}
      >
        <div className="w-[52px] h-[52px] rounded-[14px] bg-transparent grid place-items-center transition-all group-hover:bg-muted">
          <svg
            viewBox="0 0 16 16"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
        </div>
        <span className="text-micro-xs font-medium text-muted-foreground">New</span>
      </div>

      {/* Routines */}
      <div
        className={`flex flex-col items-center gap-0.5 ${interactive ? 'group cursor-pointer' : ''}`}
        onClick={click('routines')}
      >
        <div className={navCls('routines')}>
          <svg
            viewBox="0 0 16 16"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconCls('routines')}
          >
            <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" />
          </svg>
        </div>
        <span className={labelCls('routines')}>Routines</span>
      </div>

      {/* Runs */}
      <div
        className={`flex flex-col items-center gap-0.5 ${interactive ? 'group cursor-pointer' : ''}`}
        onClick={click('runs')}
      >
        <div className={navCls('runs')}>
          <svg
            viewBox="0 0 16 16"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconCls('runs')}
          >
            <path d="M4 3v10l8-5z" fill="currentColor" />
          </svg>
        </div>
        <span className={labelCls('runs')}>Runs</span>
      </div>

      {/* Settings */}
      <div
        className={`flex flex-col items-center gap-0.5 ${interactive ? 'group cursor-pointer' : ''}`}
        onClick={click('settings')}
      >
        <div className={navCls('settings')}>
          <svg
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconCls('settings')}
          >
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1.5v2M8 12.5v2M12.5 8h2M1.5 8h2M11.18 4.82l1.41-1.41M3.4 12.6l1.42-1.42M11.18 11.18l1.41 1.41M3.4 3.4l1.42 1.42" />
          </svg>
        </div>
        <span className={labelCls('settings')}>Settings</span>
      </div>
    </aside>
  );
}
