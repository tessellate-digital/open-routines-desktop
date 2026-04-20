import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import { api } from '../lib/api';
import { useRunStream } from '../hooks/useSSE';
import { StatusBadge } from '../components/RunsTable';
import { duration } from '../lib/utils';
import { useRunStore, type Segment } from '../stores/runStore';
import type { Run } from '../lib/types';
import { TodoBox, type TodoItem } from '../components/TodoBox';
import { usePageContext } from '../contexts/PageContext';
import './RunDetail.style.css';

function parseSegments(events: Array<{ type: string; data: string }>): Segment[] {
  const segments: Segment[] = [];
  for (const evt of events) {
    if (evt.type === 'text') {
      const last = segments[segments.length - 1];
      if (last?.kind === 'text') {
        last.content += evt.data;
      } else {
        segments.push({ kind: 'text', content: evt.data });
      }
    } else if (evt.type === 'tool') {
      const firstNewline = evt.data.indexOf('\n');
      const header = firstNewline === -1 ? evt.data : evt.data.slice(0, firstNewline);
      const args = firstNewline === -1 ? '' : evt.data.slice(firstNewline + 1).trim();
      const name = header
        .replace(/^\[tool:\s*/, '')
        .replace(/\]$/, '')
        .trim();
      segments.push({ kind: 'tool', name, args, result: '', open: false });
    } else if (evt.type === 'tool_result') {
      const last = [...segments].reverse().find((s) => s.kind === 'tool');
      if (last && last.kind === 'tool') {
        last.result = evt.data.replace(/^\[result\]\n?/, '').trim();
      }
    } else if (evt.type === 'error') {
      segments.push({ kind: 'error', content: evt.data });
    } else if (evt.type === 'status' && evt.data.startsWith('--- step') && segments.length > 0) {
      segments.push({ kind: 'step', label: '' });
    }
  }
  return segments;
}

function extractTodos(segments: Segment[]): TodoItem[] {
  let latest: TodoItem[] = [];
  for (const seg of segments) {
    if (seg.kind !== 'tool' || seg.name !== 'todowrite') continue;
    try {
      const parsed = JSON.parse(seg.args);
      const items = Array.isArray(parsed.todos)
        ? parsed.todos
        : Array.isArray(parsed)
          ? parsed
          : [];
      latest = items.map((t: { content: string; status: string; priority?: string }) => ({
        content: t.content,
        status: t.status as TodoItem['status'],
        priority: t.priority as TodoItem['priority'],
      }));
    } catch {
      // If args aren't valid JSON, try extracting from result
      if (seg.result) {
        try {
          const items = JSON.parse(seg.result);
          if (Array.isArray(items)) {
            latest = items.map((t: { content: string; status: string; priority?: string }) => ({
              content: t.content,
              status: t.status as TodoItem['status'],
              priority: t.priority as TodoItem['priority'],
            }));
          }
        } catch {
          /* ignore */
        }
      }
    }
  }
  return latest;
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end mb-[14px]">
      <div className="bg-[var(--accent)] text-[color:var(--accent-fg)] py-2.5 px-4 rounded-[20px] text-sm leading-[1.55] max-w-[480px] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function ToolRow({ seg, onToggle, onReply }: { seg: Segment & { kind: 'tool' }; onToggle: () => void; onReply?: (text: string) => void }) {
  // Render the `question` tool as an interactive (or read-only) card
  if (seg.name === 'question') {
    try {
      const parsed = JSON.parse(seg.args);
      if (Array.isArray(parsed?.questions)) {
        return <QuestionsCard questions={parsed.questions} onReply={onReply} />;
      }
    } catch { /* fall through to default */ }
  }

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-[5px] bg-transparent border-none py-0.5 px-0 font-mono text-[12.5px] text-[color:var(--fg-muted)] cursor-pointer"
      >
        <span className="text-[10px] opacity-70">{seg.open ? '▼' : '›'}</span>
        <span className="font-medium">{seg.name}</span>
      </button>
      {seg.open && (
        <div className="mt-1 bg-[var(--surface-hi)] border border-[var(--border)] rounded-lg py-3 px-[14px] font-mono text-xs text-[color:var(--fg-muted)] whitespace-pre-wrap leading-relaxed">
          {seg.args && <div className={classNames({ 'mb-2': seg.result })}>{seg.args}</div>}
          {seg.result && <div className="text-[color:var(--fg-dim)]">{seg.result}</div>}
        </div>
      )}
    </div>
  );
}

interface QuestionOption { label: string; description: string; }
interface Question { header: string; question: string; options: QuestionOption[]; }

function tryParseQuestions(content: string): Question[] | null {
  const trimmed = content.trim();
  // Try to find a JSON block (possibly wrapped in ```json ... ```)
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, trimmed];
  try {
    const parsed = JSON.parse(jsonMatch[1] ?? trimmed);
    if (Array.isArray(parsed?.questions) && parsed.questions.length > 0) {
      return parsed.questions;
    }
  } catch { /* not JSON */ }
  return null;
}

function QuestionsCard({ questions, onReply }: { questions: Question[]; onReply?: (text: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const interactive = !!onReply && !selected;

  const handleClick = (label: string) => {
    if (!interactive) return;
    setSelected(label);
    onReply!(label);
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qi) => (
        <div key={qi}>
          {q.header && (
            <div className="font-mono text-[10.5px] uppercase tracking-[.08em] text-[color:var(--fg-dim)] mb-[6px]">
              {q.header}
            </div>
          )}
          <p className="text-[13.5px] font-medium mb-3">{q.question}</p>
          <div className="flex flex-col gap-[6px]">
            {q.options.map((opt, oi) => {
              const isSelected = selected === opt.label;
              const isOther = selected !== null && !isSelected;
              return (
                <button
                  key={oi}
                  onClick={() => handleClick(opt.label)}
                  disabled={!interactive}
                  className={`cursor-pointer text-left px-3 py-2.5 rounded-[10px] border transition-all duration-[160ms] group
                    ${isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                      : isOther
                        ? 'border-[var(--border)] bg-[var(--surface)] opacity-40'
                        : interactive
                          ? 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'
                          : 'border-[var(--border)] bg-[var(--surface)] opacity-60 cursor-default'
                    }`}
                >
                  <span className={`font-mono text-[12px] font-semibold ${isSelected ? 'text-[color:var(--accent)]' : 'text-[color:var(--accent)]'}`}>
                    {opt.label}
                    {isSelected && <span className="ml-1.5 opacity-70">✓</span>}
                  </span>
                  {opt.description && (
                    <span className="text-[12.5px] text-[color:var(--fg-muted)] ml-2">
                      — {opt.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentText({ content, onReply }: { content: string; onReply?: (text: string) => void }) {
  if (!content.trim()) return null;
  const questions = onReply ? tryParseQuestions(content) : null;
  if (questions) {
    return <QuestionsCard questions={questions} onReply={onReply!} />;
  }
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function ErrorBubble({ content }: { content: string }) {
  return (
    <div
      className="py-2.5 px-[14px] rounded-[10px] text-[color:var(--status-failed)] text-[13px] font-mono whitespace-pre-wrap"
      style={{
        background: 'color-mix(in srgb, var(--status-failed) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--status-failed) 25%, transparent)',
      }}
    >
      {content}
    </div>
  );
}

function StepDivider() {
  return <div className="divider" />;
}

function PromptContext({ context }: { context: string }) {
  return (
    <details>
      <summary className="cursor-pointer text-xs text-[color:var(--fg-muted)] font-mono list-none flex items-center gap-1">
        <span className="text-[10px]">›</span>
        Prompt context
      </summary>
      <pre className="mt-1.5 bg-[var(--surface-hi)] border border-[var(--border)] rounded-lg py-3 px-[14px] font-mono text-[11px] text-[color:var(--fg-muted)] whitespace-pre-wrap overflow-auto max-h-[200px]">
        {context.trim()}
      </pre>
    </details>
  );
}

const SegmentList = memo(function SegmentList({
  segments,
  toggledTools,
  onToggleTool,
  onReply,
}: {
  segments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  onReply?: (text: string) => void;
}) {
  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.kind === 'text') return <AgentText key={idx} content={seg.content} onReply={onReply} />;
        if (seg.kind === 'error') return <ErrorBubble key={idx} content={seg.content} />;
        if (seg.kind === 'step') return <StepDivider key={idx} />;
        if (seg.kind === 'tool') {
          const open = seg.open || toggledTools.has(idx);
          return <ToolRow key={idx} seg={{ ...seg, open }} onToggle={() => onToggleTool(idx)} onReply={onReply} />;
        }
        return null;
      })}
    </>
  );
});

const AssistantCard = memo(function AssistantCard({
  segments,
  toggledTools,
  onToggleTool,
  isStreaming,
  onReply,
}: {
  segments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  isStreaming?: boolean;
  onReply?: (text: string) => void;
}) {
  const hasContent = segments.length > 0;
  if (!hasContent && !isStreaming) return null;
  return (
    <div className="flex justify-start mb-[14px]">
      <div
        className={`border border-[var(--border)] py-3 px-4 rounded-2xl shadow-[var(--shadow-sm)] max-w-[640px] w-full${isStreaming ? ' streaming-border' : ''}`}
        style={{ background: 'radial-gradient(60% 60% at 0% 100%, rgba(79, 70, 229, 0.05) 0%, transparent 100%), radial-gradient(60% 60% at 100% 0%, rgba(236, 72, 153, 0.04) 0%, transparent 100%), var(--surface-hi)' }}
      >
        {segments.length === 0 && isStreaming ? (
          <span className="font-mono text-[13px] text-[color:var(--fg-dim)] animate-pulse">Thinking…</span>
        ) : (
          <SegmentList segments={segments} toggledTools={toggledTools} onToggleTool={onToggleTool} onReply={onReply} />
        )}
      </div>
    </div>
  );
});

const ThreadItem = memo(function ThreadItem({
  run,
  isFirst,
  isLast,
  isStreaming,
  liveSegments,
  toggledTools,
  onToggleTool,
  onReply,
}: {
  run: Run;
  isFirst: boolean;
  isLast: boolean;
  isStreaming: boolean;
  liveSegments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  onReply?: (text: string) => void;
}) {
  const segments = useMemo(
    () => (isLast && isStreaming ? liveSegments : parseSegments(run.stdout || [])),
    [isLast, isStreaming, liveSegments, run.stdout]
  );

  return (
    <div>
      {isFirst &&
        run.metadata?.prompt_context &&
        typeof run.metadata.prompt_context === 'string' && (
          <PromptContext context={run.metadata.prompt_context} />
        )}
      {run.prompt && <UserBubble text={run.prompt} />}
      <AssistantCard
        segments={segments}
        toggledTools={toggledTools}
        onToggleTool={onToggleTool}
        isStreaming={isLast && isStreaming}
        onReply={isLast ? onReply : undefined}
      />
      {!isLast && <div className="divider" />}
    </div>
  );
});

export default function RunDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    thread,
    liveSegments,
    isStreaming,
    toggledTools,
    setThread,
    setStreaming,
    clearLiveSegments,
    appendText,
    appendTool,
    appendToolResult,
    appendError,
    appendStep,
    updateRunStatus,
    finalizeStream,
    toggleTool,
    toggleLiveTool,
    addReplyRun,
    reset,
  } = useRunStore();

  const { setPageTitle } = usePageContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [orbExiting, setOrbExiting] = useState(false);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAfterReply = useRef(false);

  const isNearBottom = useCallback(() => {
    const scroller = document.querySelector('.scroller');
    if (!scroller) return true;
    const { scrollTop, scrollHeight, clientHeight } = scroller;
    return scrollHeight - scrollTop - clientHeight < 300;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const scroller = document.querySelector('.scroller');
    if (!scroller) return;
    if (behavior === 'instant') {
      scroller.scrollTop = scroller.scrollHeight;
    } else {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior });
    }
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const runs = await api.getThread(id);
      setThread(runs);
      if (runs.length > 0) setPageTitle(runs[0].routine_name || id!);
      setError(null);
      const latest = runs[runs.length - 1];
      if (latest?.status === 'running') {
        setStreaming(true);
        clearLiveSegments();
      } else {
        setStreaming(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id, setThread, setStreaming, clearLiveSegments]);

  useEffect(() => {
    reset();
    load();
  }, [id]);

  // Scroll after reply is sent (always — user initiated)
  useEffect(() => {
    if (scrollAfterReply.current) {
      scrollAfterReply.current = false;
      scrollToBottom();
    }
  }, [thread.length, scrollToBottom]);

  // Scroll during streaming — only if user is near the bottom
  useEffect(() => {
    if (isStreaming && isNearBottom()) {
      scrollToBottom('instant');
    }
  }, [liveSegments, isStreaming, isNearBottom, scrollToBottom]);

  const latestRunId = thread[thread.length - 1]?.id;

  useRunStream(isStreaming ? (latestRunId ?? null) : null, {
    onText: useCallback((data: string) => appendText(data), [appendText]),
    onTool: useCallback(
      (data: string) => {
        const firstNewline = data.indexOf('\n');
        const header = firstNewline === -1 ? data : data.slice(0, firstNewline);
        const args = firstNewline === -1 ? '' : data.slice(firstNewline + 1).trim();
        const name = header
          .replace(/^\[tool:\s*/, '')
          .replace(/\]$/, '')
          .trim();
        appendTool(name, args);
      },
      [appendTool]
    ),
    onToolResult: useCallback(
      (data: string) => {
        appendToolResult(data.replace(/^\[result\]\n?/, '').trim());
      },
      [appendToolResult]
    ),
    onError: useCallback((data: string) => {
      appendError(data);
    }, [appendError]),
    onStatus: useCallback(
      (data: string) => {
        if (data.startsWith('--- step')) appendStep();
      },
      [appendStep]
    ),
    onStderr: useCallback(() => {}, []),
    onStdout: useCallback(() => {}, []),
    onQuestion: useCallback((questionId: string) => {
      setPendingQuestionId(questionId);
    }, []),
    onReconnect: useCallback(() => clearLiveSegments(), [clearLiveSegments]),
    onDone: useCallback(
      (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (latestRunId) {
            updateRunStatus(
              latestRunId,
              parsed.status,
              parsed.exit_code ?? null,
              new Date().toISOString()
            );
          }
        } catch { /* ignore */ }
        setOrbExiting(true);
        setTimeout(() => setOrbExiting(false), 300);
        finalizeStream();
      },
      [latestRunId, updateRunStatus, finalizeStream]
    ),
    onStreamError: useCallback(() => {
      setStreaming(false);
    }, [setStreaming]),
  });

  const handleCancel = async () => {
    if (!latestRunId) return;
    try {
      await api.cancelRun(latestRunId);
      updateRunStatus(latestRunId, 'cancelled', null, new Date().toISOString());
      setOrbExiting(true);
      setTimeout(() => {
        setStreaming(false);
        setOrbExiting(false);
      }, 300);
    } catch (e) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latestRunId || !replyText.trim() || !currentRun) return;
    const prompt = replyText.trim();
    setReplying(true);
    setReplyText('');
    if (taRef.current) taRef.current.style.height = 'auto';
    try {
      const { run_id } = await api.replyToRun(latestRunId, prompt);
      scrollAfterReply.current = true;
      addReplyRun(run_id, prompt, currentRun.routine_name, currentRun.routine_id);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setReplying(false);
    }
  };

  const handleQuestionReply = useCallback(async (text: string) => {
    const run = thread[thread.length - 1];
    if (!run?.id || !pendingQuestionId) return;
    setReplying(true);
    try {
      await api.answerQuestion(run.id, pendingQuestionId, text);
      setPendingQuestionId(null);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setReplying(false);
    }
  }, [thread, pendingQuestionId]);

  const handleToggleTool = useCallback(
    (runId: string, idx: number, isLive: boolean) => {
      if (isLive) toggleLiveTool(idx);
      else toggleTool(runId, idx);
    },
    [toggleTool, toggleLiveTool]
  );

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
    const ta = taRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
    }
  };

  const todos = useMemo(() => {
    const allSegments: Segment[] = [];
    for (const run of thread) {
      allSegments.push(...parseSegments(run.stdout || []));
    }
    allSegments.push(...liveSegments);
    return extractTodos(allSegments);
  }, [thread, liveSegments]);

  if (loading) return <p className="hint">Loading...</p>;
  if (error) return <p className="text-[color:var(--status-failed)] text-[13px]">Error: {error}</p>;
  if (!thread.length)
    return <p className="text-[color:var(--status-failed)] text-[13px]">Run not found</p>;

  const currentRun = thread[thread.length - 1];
  const isFinished = ['success', 'failed', 'cancelled', 'lost'].includes(currentRun.status);
  const canReply = isFinished && currentRun.status !== 'lost';
  const inputDisabled = replying || isStreaming || currentRun.status === 'lost';
  const showThinking = isStreaming || orbExiting;

  return (
    <div className="route-fade">
      <Link to="/runs" className="back">
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
        Runs
      </Link>

      <div className="page-head">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="mono text-xs text-[color:var(--fg-dim)]">
              {currentRun.id.slice(0, 8)}
            </span>
            <span className="text-[color:var(--fg-dim)]">·</span>
            <StatusBadge status={currentRun.status} />
            <span className="text-[color:var(--fg-dim)]">·</span>
            <span className="mono text-xs text-[color:var(--fg-dim)]">
              {currentRun.trigger_type}
            </span>
            <span className="text-[color:var(--fg-dim)]">·</span>
            <span className="mono text-xs text-[color:var(--fg-dim)]">
              {duration(currentRun.started_at, currentRun.finished_at)}
            </span>
            {thread.length > 1 && (
              <>
                <span className="text-[color:var(--fg-dim)]">·</span>
                <span className="text-xs text-[color:var(--fg-dim)]">{thread.length} turns</span>
              </>
            )}
          </div>
          <h1>{currentRun.routine_name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/routines/${currentRun.routine_id}`} className="btn">
            View routine
          </Link>
        </div>
      </div>

      {currentRun.status === 'lost' && (
        <div className="delete-confirm mb-4 bg-[var(--surface-2)] border-[var(--border-hi)]">
          <span className="font-semibold">Connection lost.</span> This run was interrupted — no
          further interaction is possible.
        </div>
      )}

      <TodoBox items={todos} />

      <div className="grid gap-[18px] pb-10">
        {thread.map((run, ti) => {
          const isLast = ti === thread.length - 1;
          const runToggled = toggledTools[run.id] ?? new Set<number>();
          return (
            <ThreadItem
              key={run.id}
              run={run}
              isFirst={ti === 0}
              isLast={isLast}
              isStreaming={isStreaming}
              liveSegments={liveSegments}
              toggledTools={runToggled}
              onToggleTool={(idx) => handleToggleTool(run.id, idx, isLast && isStreaming)}
              onReply={handleQuestionReply}
            />
          );
        })}

        {currentRun.stderr && isFinished && (
          <details className="mb-2">
            <summary className="cursor-pointer text-xs text-[color:var(--fg-muted)] font-mono list-none flex items-center gap-1">
              <span className="text-[10px]">›</span>
              Stderr output
            </summary>
            <pre className="mt-1.5 bg-[var(--surface-hi)] border border-[var(--border)] rounded-lg py-3 px-[14px] font-mono text-[11px] text-[color:var(--fg-muted)] whitespace-pre-wrap overflow-auto max-h-[200px]">
              {currentRun.stderr}
            </pre>
          </details>
        )}
      </div>

      {/* Chat composer */}
      <div className="flex justify-center mt-3">
        <div
          className={classNames('chat-composer', { thinking: showThinking })}
          onClick={showThinking ? handleCancel : undefined}
        >
          {showThinking ? (
            <>
              <div className={classNames('flex items-center justify-center w-[42px] h-[42px] rounded-full bg-[rgba(200,59,59,0.12)] shrink-0', { 'orb-exit': orbExiting })}>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="var(--status-failed)">
                  <rect x="3" y="3" width="10" height="10" rx="2" />
                </svg>
              </div>
            </>
          ) : (
            <div className={classNames('composer-input', { 'fade-in': !showThinking })}>
              <textarea
                ref={taRef}
                placeholder={
                  currentRun.status === 'lost'
                    ? 'Cannot reply — run was lost'
                    : 'Follow up, add context, or ask a question…'
                }
                value={replyText}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && canReply) {
                    e.preventDefault();
                    handleReply(e);
                  }
                }}
                rows={1}
                disabled={inputDisabled}
              />
              <button
                className={classNames('btn primary rounded-full py-[9px] px-[18px] shrink-0', {
                  'opacity-100': replyText.trim() && !inputDisabled,
                  'opacity-45': !replyText.trim() || inputDisabled,
                })}
                onClick={(e) => handleReply(e)}
                disabled={inputDisabled || !replyText.trim()}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
