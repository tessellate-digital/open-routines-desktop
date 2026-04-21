import { useLocation, useNavigate, Link } from 'react-router-dom';
import { usePageContext } from '../contexts/PageContext';

const IS_SEARCH_ENABLED = false;

const segmentLabels: Record<string, string> = {
  routines: 'Routines',
  runs: 'Runs',
  settings: 'Settings',
  new: 'New routine',
  edit: 'Edit',
  dev: 'Dev',
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const { pageTitle } = usePageContext();

  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to: string | null }> = [];

  if (parts.length === 0) {
    crumbs.push({ label: 'Overview', to: null });
    return crumbs;
  }

  let path = '';
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    path += '/' + seg;
    const isLast = i === parts.length - 1;

    const knownLabel = segmentLabels[seg];
    if (knownLabel) {
      crumbs.push({ label: knownLabel, to: isLast ? null : path });
    } else {
      // Dynamic segment (ID) — use pageTitle if available
      const label = pageTitle || seg;
      crumbs.push({ label, to: isLast ? null : path });
    }
  }

  return crumbs;
}

export function ContextToolbar() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();

  return (
    <div className="sticky top-0 z-10 flex items-center gap-2.5 px-5 h-11 bg-transparent backdrop-blur-[20px] shrink-0 app-drag">
      <div className="flex gap-0.5 app-no-drag">
        <button
          className="w-7 h-7 rounded-sm border-none bg-transparent cursor-pointer text-muted-foreground grid place-items-center p-0 transition-all duration-default ease-default hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed [&_svg]:w-3.5 [&_svg]:h-3.5"
          onClick={() => navigate(-1)}
          aria-label="Back"
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
        <button
          className="w-7 h-7 rounded-sm border-none bg-transparent cursor-pointer text-muted-foreground grid place-items-center p-0 transition-all duration-default ease-default hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed [&_svg]:w-3.5 [&_svg]:h-3.5"
          onClick={() => navigate(1)}
          aria-label="Forward"
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
            <path d="m6 3 5 5-5 5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1 text-body-sm font-medium text-foreground min-w-0 app-no-drag">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-fg-dim font-mono text-xs">/</span>}
            {c.to ? (
              <Link
                to={c.to}
                className="text-muted-foreground no-underline transition-colors duration-default ease-default hover:text-foreground"
              >
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </div>

      {IS_SEARCH_ENABLED && (
        <button className="ml-auto flex items-center gap-2 py-[5px] px-3 rounded-full border border-muted bg-surface-hi text-caption text-fg-dim cursor-pointer font-sans transition-all duration-default ease-default whitespace-nowrap hover:border-border-strong hover:text-muted-foreground [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:shrink-0 app-no-drag">
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="m13 13-2.8-2.8" />
          </svg>
          <span>Search or run command</span>
          <span className="font-mono text-micro-sm py-0.5 px-[5px] rounded bg-muted text-muted-foreground border border-border-strong">
            ⌘K
          </span>
        </button>
      )}
    </div>
  );
}
