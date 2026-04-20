import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { useGlobalSSE } from '../hooks/useSSE';

const IS_SEARCH_ENABLED = false;
import type { Run } from '../lib/types';

function formatElapsed(startedAt: string | null): string {
  if (!startedAt) return '0s';
  const ms = Date.now() - new Date(startedAt).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs.toString().padStart(2, '0')}s`;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  routineCount: number;
}

export default function Sidebar({ collapsed, onToggle, routineCount }: SidebarProps) {
  const navigate = useNavigate();
  const [activeRuns, setActiveRuns] = useState<Run[]>([]);
  const [, setTick] = useState(0);

  const fetchActive = useCallback(async () => {
    try {
      const runs = await api.getRuns({ status: 'running', limit: 10 });
      setActiveRuns(runs);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  useGlobalSSE(fetchActive);

  // Tick every second to update elapsed timers
  useEffect(() => {
    if (activeRuns.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeRuns.length]);

  return (
    <aside className={classNames('sidebar', { collapsed })}>
      {/* Brand */}
      <Link to="/" className="side-brand">
        <div className="brand-mark">
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        {!collapsed && (
          <span className="brand-name">
            open<span className="tag"> / routines</span>
          </span>
        )}
      </Link>

      {/* New routine button */}
      <Link to="/routines/new" className="side-new-btn">
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
          <path d="M8 3v10M3 8h10" />
        </svg>
        {!collapsed && (
          <>
            <span>New routine</span>
            <span className="shortcut">⌘N</span>
          </>
        )}
      </Link>

      {/* Library section */}
      {!collapsed && <div className="side-section">Library</div>}

      <NavLink
        to="/routines"
        className={({ isActive }) => classNames('side-item', { active: isActive })}
      >
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
          <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" />
        </svg>
        {!collapsed && (
          <>
            <span className="lbl">Routines</span>
            {routineCount > 0 && <span className="badge">{routineCount}</span>}
          </>
        )}
      </NavLink>

      <NavLink
        to="/runs"
        className={({ isActive }) => classNames('side-item', { active: isActive })}
      >
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
          <path d="M4 3v10l8-5z" fill="currentColor" />
        </svg>
        {!collapsed && (
          <>
            <span className="lbl">Runs</span>
            <span className="shortcut">⌘2</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => classNames('side-item', { active: isActive })}
      >
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
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 1.5v2M8 12.5v2M12.5 8h2M1.5 8h2M11.18 4.82l1.41-1.41M3.4 12.6l1.42-1.42M11.18 11.18l1.41 1.41M3.4 3.4l1.42 1.42" />
        </svg>
        {!collapsed && (
          <>
            <span className="lbl">Settings</span>
            <span className="shortcut">⌘,</span>
          </>
        )}
      </NavLink>

      {/* Active runs section */}
      {activeRuns.length > 0 && !collapsed && (
        <>
          <div className="side-section">
            <span>Active</span>
            <span className="count">{activeRuns.length}</span>
          </div>
          {activeRuns.map((run) => (
            <div
              key={run.id}
              className="side-active"
              onClick={() => navigate(`/runs/${run.id}`)}
            >
              <div className="top">
                <span className="d" />
                <span className="name">{run.routine_name}</span>
              </div>
              <div className="meta">
                <span>{formatElapsed(run.started_at)}</span> · {run.id}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Spacer */}
      <div className="side-spacer" />

      {/* Search — hidden until feature is implemented */}
      {IS_SEARCH_ENABLED && (
        <button className="side-item" style={{ opacity: 0.9 }}>
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
          {!collapsed && (
            <>
              <span className="lbl">Search</span>
              <span className="shortcut">⌘K</span>
            </>
          )}
        </button>
      )}
    </aside>
  );
}
