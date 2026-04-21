import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useGlobalSSE } from '../hooks/useSSE';
import Sidebar from './Sidebar';
import ContextToolbar from './ContextToolbar';

export default function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('oc-sidebar-collapsed') === 'true';
  });
  const [routineCount, setRoutineCount] = useState(0);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('oc-sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const routines = await api.getRoutines();
      setRoutineCount(routines.length);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useGlobalSSE(fetchCounts);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        return;
      }
      switch (e.key) {
        case 'n':
          e.preventDefault();
          navigate('/routines/new');
          break;
        case '2':
          e.preventDefault();
          navigate('/runs');
          break;
        case ',':
          e.preventDefault();
          navigate('/settings');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="app-shell">
      <div className="chrome">
        <Sidebar collapsed={collapsed} onToggle={toggle} routineCount={routineCount} />
        <div className="chrome-right">
          <ContextToolbar />
          <div className="content-card">
            <div className="scroller">
              <main className="main-content">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
