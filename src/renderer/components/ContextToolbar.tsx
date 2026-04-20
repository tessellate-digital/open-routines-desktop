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

export default function ContextToolbar() {
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();

  return (
    <div className="ctxbar">
      <div className="nav-arrows">
        <button
          className="arrow-btn"
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
          className="arrow-btn"
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

      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} className="crumb-item">
            {i > 0 && <span className="sep">/</span>}
            {c.to ? (
              <Link to={c.to} className="crumb-link">
                {c.label}
              </Link>
            ) : (
              <span className="current">{c.label}</span>
            )}
          </span>
        ))}
      </div>

      {IS_SEARCH_ENABLED && (
        <button className="cmdk-trigger">
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
          <span className="kbd">⌘K</span>
        </button>
      )}
    </div>
  );
}
