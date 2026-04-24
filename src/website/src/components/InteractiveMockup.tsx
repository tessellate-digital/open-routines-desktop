import { useState, useCallback, useEffect, useRef } from 'react';
import { AppWindow } from './AppWindow';
import { RoutineChatMockup } from './RoutineChatMockup';

type RoutineId = 1 | 2 | 3 | 4;
const ROUTINE_IDS: RoutineId[] = [4, 1, 2, 3];

const ROUTINE_NAMES: Record<RoutineId, string> = {
  1: 'Expense manager',
  2: 'Doc drift check',
  3: 'News summary',
  4: 'Invoice tracker',
};

const CHAT_DURATION = 5600;
const EXIT_DURATION = 300;
const CHAT_TRANSITION = 500;
const INITIAL_DELAY = 800;

function after(ms: number, fn: () => void): ReturnType<typeof setTimeout> {
  return setTimeout(fn, ms);
}

export function InteractiveMockup() {
  const [routineIdx, setRoutineIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const routineId = ROUTINE_IDS[routineIdx];
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

      for (let i = 0; i < ROUTINE_IDS.length; i++) {
        const idx = i;

        // Show this slide
        acc.push(
          after(t, () => {
            setExiting(false);
            setRoutineIdx(idx);
          })
        );
        t += CHAT_DURATION;

        // Start exit animation
        acc.push(
          after(t, () => {
            setExiting(true);
          })
        );
        t += EXIT_DURATION + (CHAT_TRANSITION - EXIT_DURATION);
      }

      // Loop
      acc.push(
        after(t, () => {
          startAutoplay();
        })
      );

      timersRef.current = acc;
    },
    [clearTimers]
  );

  useEffect(() => {
    startAutoplay(INITIAL_DELAY);
    return clearTimers;
  }, [startAutoplay, clearTimers]);

  const breadcrumbs = [{ label: 'Routines' }, { label: ROUTINE_NAMES[routineId] }];

  return (
    <div>
      <AppWindow active="routines" breadcrumbs={breadcrumbs} height={620}>
        <div key={`chat-${routineId}`} className={exiting ? 'mockup-slide-exit' : 'mockup-slide'}>
          <RoutineChatMockup routineId={routineId} name={ROUTINE_NAMES[routineId]} />
        </div>
      </AppWindow>
    </div>
  );
}
