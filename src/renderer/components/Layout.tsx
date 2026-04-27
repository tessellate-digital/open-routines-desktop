import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ContextToolbar } from './ContextToolbar';
import { UpdateBanner } from './UpdateBanner';

export function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('oc-sidebar-collapsed') === 'true';
  });

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('oc-sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    window.electronAPI?.onNavigate((route) => navigate(route));
  }, [navigate]);

  return (
    <div className="h-screen overflow-hidden relative bg-[radial-gradient(900px_600px_at_0%_100%,rgba(168,85,247,0.18)_0%,transparent_60%),radial-gradient(800px_500px_at_30%_0%,rgba(79,70,229,0.14)_0%,transparent_60%),radial-gradient(600px_400px_at_100%_80%,rgba(236,72,153,0.12)_0%,transparent_60%)] bg-surface flex flex-col">
      <UpdateBanner />
      <div className="flex flex-1 min-h-0 relative z-1">
        <Sidebar collapsed={collapsed} onToggle={toggle} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ContextToolbar />
          <div className="flex-1 bg-canvas border-t border-l border-muted rounded-tl-xl overflow-hidden">
            <div className="scroller h-full overflow-y-auto">
              <main className="max-w-[1060px] mx-auto w-full py-8 px-12 pb-20">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
