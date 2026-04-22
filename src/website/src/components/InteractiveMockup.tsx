import { useState, useCallback, useEffect, useRef } from 'react';
import { AppWindow } from './AppWindow';
import { RoutinesListMockup } from './RoutinesListMockup';
import { RoutineChatMockup } from './RoutineChatMockup';

type RoutineId = 1 | 2 | 3;
const ROUTINE_IDS: RoutineId[] = [1, 2, 3];

type Route = { page: 'routines' } | { page: 'routine-chat'; routineId: RoutineId };

const ROUTINE_NAMES: Record<RoutineId, string> = {
  1: 'Expense manager',
  2: 'Doc drift check',
  3: 'News summary',
};

const HOVER_DURATION = 900;
const CHAT_DURATION = 2800;
const RETURN_PAUSE = 700;
const INITIAL_DELAY = 1200;
const RESUME_DELAY = 1500;

function after(ms: number, fn: () => void): ReturnType<typeof setTimeout> {
  return setTimeout(fn, ms);
}

export function InteractiveMockup() {
  const [history, setHistory] = useState<Route[]>([{ page: 'routines' }]);
  const [index, setIndex] = useState(0);
  const [autoHovered, setAutoHovered] = useState<RoutineId | null>(null);

  const route = history[index];

  const navigate = useCallback(
    (page: string) => {
      const match = page.match(/^routine-chat\/(\d+)$/);
      if (!match) {
        return;
      }
      const routineId = Number(match[1]) as RoutineId;
      const next: Route = { page: 'routine-chat', routineId };
      setHistory((prev) => [...prev.slice(0, index + 1), next]);
      setIndex((i) => i + 1);
    },
    [index]
  );

  const goBack = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  }, [index]);

  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const goBackRef = useRef(goBack);
  goBackRef.current = goBack;
  const userInteractingRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startAutoplay = useCallback(
    (initialDelay = 0) => {
      clearTimers();
      const acc: ReturnType<typeof setTimeout>[] = [];
      let t = initialDelay;

      for (const id of ROUTINE_IDS) {
        const hoverT = after(t, () => {
          if (userInteractingRef.current) {
            return;
          }
          setAutoHovered(id);
        });
        acc.push(hoverT);
        t += HOVER_DURATION;

        const clickT = after(t, () => {
          if (userInteractingRef.current) {
            return;
          }
          setAutoHovered(null);
          navigateRef.current(`routine-chat/${id}`);
        });
        acc.push(clickT);
        t += CHAT_DURATION;

        const backT = after(t, () => {
          if (userInteractingRef.current) {
            return;
          }
          goBackRef.current();
        });
        acc.push(backT);
        t += RETURN_PAUSE;
      }

      const loopT = after(t, () => {
        if (userInteractingRef.current) {
          return;
        }
        startAutoplay();
      });
      acc.push(loopT);

      timersRef.current = acc;
    },
    [clearTimers]
  );

  useEffect(() => {
    startAutoplay(INITIAL_DELAY);
    return clearTimers;
  }, [startAutoplay, clearTimers]);

  const handleMouseEnter = useCallback(() => {
    userInteractingRef.current = true;
    clearTimers();
    setAutoHovered(null);
  }, [clearTimers]);

  const handleMouseLeave = useCallback(() => {
    userInteractingRef.current = false;
    setHistory([{ page: 'routines' }]);
    setIndex(0);
    startAutoplay(RESUME_DELAY);
  }, [startAutoplay]);

  const breadcrumbs: { label: string; onClick?: () => void }[] =
    route.page === 'routines'
      ? [{ label: 'Routines' }]
      : [{ label: 'Routines', onClick: goBack }, { label: ROUTINE_NAMES[route.routineId] }];

  return (
    <div className="group/hero" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <AppWindow
        active="routines"
        breadcrumbs={breadcrumbs}
        onNavigate={navigate}
        onBack={index > 0 ? goBack : undefined}
        height={620}
      >
        {route.page === 'routines' ? (
          <RoutinesListMockup onNavigate={navigate} autoHovered={autoHovered} />
        ) : (
          <RoutineChatMockup
            routineId={route.routineId}
            name={ROUTINE_NAMES[route.routineId]}
            onBack={goBack}
          />
        )}
      </AppWindow>
    </div>
  );
}
