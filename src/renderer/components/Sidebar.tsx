import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { api } from '../lib/api';
import { useGlobalSSE } from '../hooks/useSSE';

import type { Run } from '../lib/types';

function formatElapsed(startedAt: string | null): string {
  if (!startedAt) {
    return '0s';
  }
  const ms = Date.now() - new Date(startedAt).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) {
    return `${s}s`;
  }
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs.toString().padStart(2, '0')}s`;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed }: SidebarProps) {
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

  useEffect(() => {
    if (activeRuns.length === 0) {
      return;
    }
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeRuns.length]);

  return (
    <aside
      className={classNames(
        'w-[100px] shrink-0 bg-transparent flex flex-col items-center gap-2 py-1.5 px-2 pb-2 overflow-y-auto overflow-x-hidden backdrop-blur-[12px] relative z-2 transition-[width] duration-default ease-default app-drag pt-[50px] text-foreground scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted',
        { '!w-[52px]': collapsed }
      )}
    >
      {/* Brand */}
      <Link to="/" className="cursor-pointer no-underline">
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
      </Link>

      {/* New routine */}
      <Link
        to="/routines/new"
        className="flex flex-col items-center gap-0.5 cursor-pointer no-underline group"
      >
        <div className="w-[52px] h-[52px] rounded-[14px] bg-transparent grid place-items-center transition-all duration-default ease-default group-hover:bg-muted">
          <svg
            viewBox="0 0 16 16"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
        </div>
        <span className="text-micro-xs font-medium text-muted-foreground">New</span>
      </Link>

      {/* Routines */}
      <NavLink to="/routines" className="no-underline">
        {({ isActive }) => (
          <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div
              className={classNames(
                'w-[52px] h-[52px] rounded-[14px] grid place-items-center transition-all duration-default ease-default',
                isActive ? 'bg-accent-soft' : 'bg-transparent group-hover:bg-muted'
              )}
            >
              <svg
                viewBox="0 0 16 16"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={classNames(
                  'transition-colors duration-default',
                  isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" />
              </svg>
            </div>
            <span
              className={classNames(
                'text-micro-xs font-medium transition-colors duration-default',
                isActive ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              Routines
            </span>
          </div>
        )}
      </NavLink>

      {/* Runs */}
      <NavLink to="/runs" className="no-underline">
        {({ isActive }) => (
          <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div className="relative">
              <div
                className={classNames(
                  'w-[52px] h-[52px] rounded-[14px] grid place-items-center transition-all duration-default ease-default',
                  isActive ? 'bg-accent-soft' : 'bg-transparent group-hover:bg-muted'
                )}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={classNames(
                    'transition-colors duration-default',
                    isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  <path d="M4 3v10l8-5z" fill="currentColor" />
                </svg>
              </div>
              {activeRuns.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-pink-500 text-white text-[10px] font-bold grid place-items-center px-1 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                  {activeRuns.length}
                </span>
              )}
            </div>
            <span
              className={classNames(
                'text-micro-xs font-medium transition-colors duration-default',
                isActive ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              Runs
            </span>
          </div>
        )}
      </NavLink>

      {/* Settings */}
      <NavLink to="/settings" className="no-underline">
        {({ isActive }) => (
          <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
            <div
              className={classNames(
                'w-[52px] h-[52px] rounded-[14px] grid place-items-center transition-all duration-default ease-default',
                isActive ? 'bg-accent-soft' : 'bg-transparent group-hover:bg-muted'
              )}
            >
              <svg
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={classNames(
                  'transition-colors duration-default',
                  isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                <circle cx="8" cy="8" r="2.5" />
                <path d="M8 1.5v2M8 12.5v2M12.5 8h2M1.5 8h2M11.18 4.82l1.41-1.41M3.4 12.6l1.42-1.42M11.18 11.18l1.41 1.41M3.4 3.4l1.42 1.42" />
              </svg>
            </div>
            <span
              className={classNames(
                'text-micro-xs font-medium transition-colors duration-default',
                isActive ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              Settings
            </span>
          </div>
        )}
      </NavLink>

      {/* Active runs */}
      {activeRuns.length > 0 && (
        <div className="w-full flex flex-col items-center gap-1">
          {activeRuns.map((run) => (
            <div
              key={run.id}
              className="w-[52px] h-[52px] rounded-[14px] bg-transparent hover:bg-muted grid place-items-center cursor-pointer transition-colors duration-default ease-default relative"
              onClick={() => navigate(`/runs/${run.id}`)}
              title={`${run.routine_name} — ${formatElapsed(run.started_at)}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-running shadow-[0_0_0_3px_rgba(44,92,240,0.2)] animate-pulse" />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
