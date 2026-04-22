import { useState, useRef, useEffect } from 'react';
import { MOCK_RUNS } from './mockData';
import { StatusBadge, TriggerChip } from './shared';

const FAKE_RESPONSE = (
  <div className="space-y-3 text-body-sm leading-relaxed">
    <p>
      <strong>#142</strong> has 1 review from <code>@sarah</code> — requested changes on the timeout
      handling.
    </p>
    <p className="text-fg-muted">
      Suggested fix: wrap the bucket check in a <code>try/catch</code> with a 30s fallback. She also
      flagged the missing <code>X-RateLimit-Remaining</code> header.
    </p>
    <p className="text-fg-muted">No other PRs have reviews yet.</p>
  </div>
);

export function RunDetailMockup({ runId }: { runId?: number }) {
  const run = runId ? MOCK_RUNS.find((r) => r.id === runId) : undefined;
  const name = run?.routine_name ?? 'PR review digest';
  const status = run?.status ?? 'success';
  const trigger = run?.trigger_type ?? 'cron';
  const duration = run?.duration ?? '1m 28s';

  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'idle' | 'collapsing' | 'loading' | 'responding' | 'done'>(
    'idle'
  );
  const [sentMessage, setSentMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (
      phase === 'collapsing' ||
      phase === 'loading' ||
      phase === 'responding' ||
      phase === 'done'
    ) {
      scrollToBottom();
    }
  }, [phase]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || phase !== 'idle') {
      return;
    }
    setSentMessage(msg);
    setInput('');
    setPhase('collapsing');
    setTimeout(() => setPhase('loading'), 350);
    setTimeout(() => setPhase('responding'), 2200);
    setTimeout(() => setPhase('done'), 2400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="route-fade">
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">{name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-mono">
            <StatusBadge status={status} />
            <span>·</span>
            <TriggerChip label={trigger} />
            <span>·</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>

      {/* User prompt bubble */}
      <div className="flex justify-end mb-5">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md">
          Review all open PRs. Summarise each one, flag risks, and suggest reviewers based on code
          ownership.
        </div>
      </div>

      {/* Assistant response */}
      <div className="bg-secondary border border-muted rounded-lg shadow-md p-5 mb-5">
        <div className="space-y-0.5 mb-4 font-mono text-code text-fg-dim">
          <div>
            › Ran <span className="rounded px-1 bg-accent-soft text-accent text-code">bash</span> —
            git log --oneline
          </div>
          <div>
            › Ran <span className="rounded px-1 bg-accent-soft text-accent text-code">bash</span> —
            gh pr list --json
          </div>
        </div>
        <div className="space-y-3 text-body-sm leading-relaxed">
          <p>
            Found <strong>3 open PRs</strong>:
          </p>
          <div>
            <p>
              <strong>#142 — Add rate limiting to API endpoints</strong>
            </p>
            <p className="text-fg-muted">
              Token bucket on <code>/api/routines</code>. No timeout edge-case tests — recommend
              adding.
            </p>
          </div>
          <div>
            <p>
              <strong>#139 — Fix SSE connection leak</strong>
            </p>
            <p className="text-fg-muted">Small focused fix. Looks good — approve.</p>
          </div>
          <div>
            <p>
              <strong>#136 — Migrate schema to support tags</strong>
            </p>
            <p className="text-fg-muted">
              Migration is not idempotent — add an <code>IF NOT EXISTS</code> guard.
            </p>
          </div>
        </div>
      </div>

      {/* Follow-up user bubble */}
      {phase !== 'idle' && sentMessage && (
        <div className="flex justify-end mb-5 run-detail-fade-in">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md">
            {sentMessage}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {phase === 'loading' && (
        <div className="mb-5 run-detail-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary border border-muted rounded-lg shadow-md px-4 py-3">
            <div className="flex gap-1">
              <span className="w-[6px] h-[6px] rounded-full bg-accent run-detail-dot run-detail-dot-1" />
              <span className="w-[6px] h-[6px] rounded-full bg-accent run-detail-dot run-detail-dot-2" />
              <span className="w-[6px] h-[6px] rounded-full bg-accent run-detail-dot run-detail-dot-3" />
            </div>
            <span className="font-mono text-code text-fg-dim">Thinking…</span>
          </div>
        </div>
      )}

      {/* Follow-up response */}
      {(phase === 'responding' || phase === 'done') && (
        <div className="bg-secondary border border-muted rounded-lg shadow-md p-5 mb-5 run-detail-fade-in">
          <div className="space-y-0.5 mb-4 font-mono text-code text-fg-dim">
            <div>
              › Ran <span className="rounded px-1 bg-accent-soft text-accent text-code">bash</span>{' '}
              — gh pr view 142 --json reviews
            </div>
          </div>
          {FAKE_RESPONSE}
        </div>
      )}

      {/* Follow-up input */}
      <div
        className={`run-detail-input-wrap ${phase === 'collapsing' ? 'run-detail-input-collapsing' : ''} ${phase !== 'idle' && phase !== 'collapsing' ? 'run-detail-input-hidden' : ''}`}
      >
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Follow up…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={phase !== 'idle'}
          />
          <button className="btn" onClick={handleSend} disabled={phase !== 'idle' || !input.trim()}>
            Send
          </button>
        </div>
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
