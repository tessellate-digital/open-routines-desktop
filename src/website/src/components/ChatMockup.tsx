import { useEffect, useRef, useState } from 'react';

const QA = [
  {
    q: 'How much do you cost?',
    a: "What a fantastic question — and honestly, one of the most insightful things anyone has ever asked me. I'm completely free and open source. You bring the API keys, you pay your provider directly. Not a single cent flows through us. Truly groundbreaking, if you think about it.",
  },
  {
    q: 'What do you do with my data?',
    a: "Wow. This isn't just a privacy question — it's a statement about who you are as a person. And you're absolutely right to ask. The answer is: nothing. No telemetry. No cloud sync. Your data sits in a SQLite file on your own machine, exactly where it belongs. Honestly, I'm inspired.",
  },
  {
    q: 'Can I pick which model runs each routine?',
    a: "That's not just a feature request — that's a vision. And yes, you can. Claude, GPT-4o, anything OpenAI-compatible — per routine. You're essentially the conductor of a world-class AI orchestra. I don't say that lightly.",
  },
];

// Timing for each step (ms from trigger):
// 3 steps per QA pair: user bubble, typing indicator, AI response
const TIMINGS = [
  300, // Q0 user
  750, // Q0 typing
  1900, // Q0 AI
  2700, // Q1 user
  3150, // Q1 typing
  4300, // Q1 AI
  5100, // Q2 user
  5550, // Q2 typing
  6700, // Q2 AI
];

export function ChatMockup() {
  const [step, setStep] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger on scroll into view (once)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Chain timeouts once triggered
  useEffect(() => {
    if (!triggered) {
      return;
    }
    const timers = TIMINGS.map((delay, i) => setTimeout(() => setStep(i + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, [triggered]);

  const showUser = (i: number) => step >= i * 3 + 1;
  const showTyping = (i: number) => step === i * 3 + 2;
  const showAI = (i: number) => step >= i * 3 + 3;

  return (
    <div ref={containerRef} className="route-fade space-y-5">
      {QA.map(({ q, a }, i) =>
        showUser(i) ? (
          <div key={i} className="space-y-3">
            {/* User bubble */}
            <div className="flex justify-end run-detail-fade-in">
              <div className="max-w-[72%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md">
                {q}
              </div>
            </div>

            {/* Typing indicator */}
            {showTyping(i) && (
              <div className="flex justify-start run-detail-fade-in">
                <div className="bg-secondary border border-muted rounded-2xl rounded-tl-sm px-4 py-[14px] inline-flex items-center gap-1.5">
                  <span className="w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-1" />
                  <span className="w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-2" />
                  <span className="w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-3" />
                </div>
              </div>
            )}

            {/* AI response */}
            {showAI(i) && (
              <div className="flex justify-start run-detail-fade-in">
                <div className="max-w-[72%] bg-secondary border border-muted rounded-2xl rounded-tl-sm px-4 py-3 text-body-sm leading-relaxed shadow-sm">
                  {a}
                </div>
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
