import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BackLink } from '../../components/BackLink';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../lib/api';
import { useRunStream } from '../../hooks/useSSE';
import { StatusBadge } from '../../components/RunsTable';
import { duration } from '../../lib/utils';
import { useRunStore, type Segment } from '../../stores/runStore';
import { TodoBox } from '../../components/TodoBox';
import { usePageContext } from '../../contexts/PageContext';
import { MentionPopover, type ComposerInputHandle } from '../../components/composer';
import { useMentionPopover } from '../../hooks/composer';
import { ThreadItem } from './components';
import { ChatComposer } from './components/ChatComposer';
import { parseSegments, extractTodos } from './utils';
import './RunDetail.style.css';

const EMPTY_SEGMENTS: Segment[] = [];
const EMPTY_TOGGLED = new Set<number>();

export default function RunDetail() {
  const { id } = useParams<{ id: string }>();

  // Granular state selectors — only re-render when these specific values change
  const thread = useRunStore((s) => s.thread);
  const liveSegments = useRunStore((s) => s.liveSegments);
  const isStreaming = useRunStore((s) => s.isStreaming);
  const toggledTools = useRunStore((s) => s.toggledTools);

  // Actions are stable references in Zustand — no reactive subscription needed
  const {
    setThread,
    setStreaming,
    clearLiveSegments,
    appendText,
    appendTool,
    appendToolResult,
    appendError,
    appendStep,
    appendPermission,
    updatePermissionResponse,
    updateRunStatus,
    finalizeStream,
    toggleTool,
    toggleLiveTool,
    addReplyRun,
    reset,
  } = useRunStore.getState();

  const { setPageTitle } = usePageContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [orbExiting, setOrbExiting] = useState(false);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);

  const composerRef = useRef<ComposerInputHandle>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAfterReply = useRef(false);
  // True once the user has manually scrolled up — suppresses auto-scroll until
  // they return to the bottom themselves.
  const userScrolledUp = useRef(false);
  const scrollRAF = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const scroller = document.querySelector('.scroller');
    if (!scroller) {
      return;
    }
    if (behavior === 'instant') {
      scroller.scrollTop = scroller.scrollHeight;
    } else {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior });
    }
  }, []);

  // Attach a scroll listener to detect when the user scrolls up or returns to bottom.
  useEffect(() => {
    const scroller = document.querySelector('.scroller');
    if (!scroller) {
      return;
    }

    const NEAR_BOTTOM_PX = 80;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const distFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distFromBottom <= NEAR_BOTTOM_PX) {
        userScrolledUp.current = false;
      } else {
        userScrolledUp.current = true;
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const runs = await api.getThread(id);
      setThread(runs);
      if (runs.length > 0) {
        setPageTitle(runs[0].routine_name || id!);
      }
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
  }, [id, setThread, setStreaming, clearLiveSegments, setPageTitle]);

  useEffect(() => {
    reset();
    load();
  }, [id, load, reset]);

  useEffect(() => {
    if (scrollAfterReply.current) {
      scrollAfterReply.current = false;
      userScrolledUp.current = false;
      scrollToBottom();
    }
  }, [thread.length, scrollToBottom]);

  useEffect(() => {
    if (isStreaming && !userScrolledUp.current) {
      cancelAnimationFrame(scrollRAF.current);
      scrollRAF.current = requestAnimationFrame(() => {
        scrollToBottom('instant');
      });
    }
    return () => cancelAnimationFrame(scrollRAF.current);
  }, [liveSegments, isStreaming, scrollToBottom]);

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
    onError: useCallback(
      (data: string) => {
        appendError(data);
      },
      [appendError]
    ),
    onStatus: useCallback(
      (data: string) => {
        if (data.startsWith('--- step')) {
          appendStep();
        }
      },
      [appendStep]
    ),
    onStderr: useCallback(() => {}, []),
    onStdout: useCallback(() => {}, []),
    onQuestion: useCallback((questionId: string) => {
      setPendingQuestionId(questionId);
    }, []),
    onPermission: useCallback(
      (data: string) => {
        try {
          const { id, permission, patterns } = JSON.parse(data);
          appendPermission(id, permission, patterns);
        } catch {
          /* ignore malformed */
        }
      },
      [appendPermission]
    ),
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
        } catch {
          /* ignore */
        }
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
    if (!latestRunId) {
      return;
    }
    try {
      await api.cancelRun(latestRunId);
      updateRunStatus(latestRunId, 'cancelled', null, new Date().toISOString());
      setOrbExiting(true);
      setTimeout(() => {
        setStreaming(false);
        setOrbExiting(false);
      }, 300);
    } catch (e) {
      await window.electronAPI?.alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
    }
  };

  const currentRun = thread[thread.length - 1];

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latestRunId || !replyText.trim() || !currentRun) {
      return;
    }
    const prompt = (composerRef.current?.getPlainText() ?? replyText).trim();
    if (!prompt) {
      return;
    }
    const displayPrompt = composerRef.current?.getDisplayText().trim() ?? prompt;
    setReplying(true);
    setReplyText('');
    composerRef.current?.clear();
    try {
      const { run_id } = await api.replyToRun(latestRunId, prompt, displayPrompt);
      scrollAfterReply.current = true;
      addReplyRun(run_id, prompt, displayPrompt, currentRun.routine_name, currentRun.routine_id);
    } catch (err) {
      await window.electronAPI?.alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setReplying(false);
    }
  };

  const handleQuestionReply = useCallback(
    async (text: string) => {
      const run = thread[thread.length - 1];
      if (!run?.id || !pendingQuestionId) {
        return;
      }
      setReplying(true);
      try {
        await api.answerQuestion(run.id, pendingQuestionId, text);
        setPendingQuestionId(null);
      } catch (err) {
        await window.electronAPI?.alert(
          'Error: ' + (err instanceof Error ? err.message : 'Unknown')
        );
      } finally {
        setReplying(false);
      }
    },
    [thread, pendingQuestionId]
  );

  const handlePermissionRespond = useCallback(
    async (permissionId: string, response: 'once' | 'always' | 'reject') => {
      const run = thread[thread.length - 1];
      if (!run?.id) {
        return;
      }
      try {
        await api.answerPermission(run.id, permissionId, response);
        updatePermissionResponse(permissionId, response);
      } catch (err) {
        await window.electronAPI?.alert(
          'Error: ' + (err instanceof Error ? err.message : 'Unknown')
        );
      }
    },
    [thread, updatePermissionResponse]
  );

  const handleToggleTool = useCallback(
    (runId: string, idx: number, isLive: boolean) => {
      if (isLive) {
        toggleLiveTool(idx);
      } else {
        toggleTool(runId, idx);
      }
    },
    [toggleTool, toggleLiveTool]
  );

  const handleComposerChange = (text: string) => {
    setReplyText(text);
  };

  const handleAddToPrompt = useCallback(
    async (text: string) => {
      const run = thread[0];
      if (!run?.routine_id) {
        return;
      }
      const routine = await api.getRoutine(run.routine_id);
      const existing = routine.prompt?.trimEnd() ?? '';
      const updated = existing ? `${existing}\n\n${text.trim()}` : text.trim();
      await api.updateRoutine(run.routine_id, { prompt: updated });
    },
    [thread]
  );

  const mention = useMentionPopover(composerRef);

  const todos = useMemo(() => {
    const allSegments = thread.flatMap((run) => parseSegments(run.stdout || []));
    allSegments.push(...liveSegments);
    return extractTodos(allSegments);
  }, [thread, liveSegments]);

  if (loading) {
    return null;
  }
  if (error) {
    return <p className="text-destructive text-body-sm">Error: {error}</p>;
  }
  if (!thread.length) {
    return <p className="text-destructive text-body-sm">Run not found</p>;
  }

  const isFinished = ['success', 'failed', 'cancelled', 'lost'].includes(currentRun.status);
  const canReply = isFinished && currentRun.status !== 'lost';
  const inputDisabled = replying || isStreaming || currentRun.status === 'lost';
  const showThinking = isStreaming || orbExiting;

  return (
    <div className="route-fade">
      <BackLink to="/runs">Runs</BackLink>

      <div className="flex items-center gap-2 mb-1 font-mono text-xs text-fg-dim">
        <span>{currentRun.id.slice(0, 8)}</span>
        <span>·</span>
        <StatusBadge status={currentRun.status} />
        <span>·</span>
        <span>{currentRun.trigger_type}</span>
        <span>·</span>
        <span>{duration(currentRun.started_at, currentRun.finished_at)}</span>
        {thread.length > 1 && (
          <>
            <span>·</span>
            <span>{thread.length} turns</span>
          </>
        )}
      </div>

      <PageHeader
        title={currentRun.routine_name}
        actions={
          <Link to={`/routines/${currentRun.routine_id}`} className="btn">
            View routine
          </Link>
        }
      />

      {currentRun.status === 'lost' && (
        <div className="delete-confirm mb-4 bg-secondary border-border-strong">
          <span className="font-semibold">Connection lost.</span> This run was interrupted — no
          further interaction is possible.
        </div>
      )}

      <TodoBox items={todos} />

      <div className="grid gap-[18px] pb-10">
        {thread.map((run, ti) => {
          const isLast = ti === thread.length - 1;
          const runToggled = toggledTools[run.id] ?? EMPTY_TOGGLED;
          return (
            <ThreadItem
              key={run.id}
              run={run}
              isFirst={ti === 0}
              isLast={isLast}
              isStreaming={isStreaming}
              liveSegments={isLast ? liveSegments : EMPTY_SEGMENTS}
              toggledTools={runToggled}
              onToggleTool={handleToggleTool}
              onReply={handleQuestionReply}
              onPermissionRespond={handlePermissionRespond}
              onAddToPrompt={handleAddToPrompt}
            />
          );
        })}

        {currentRun.stderr && isFinished && (
          <details className="mb-2">
            <summary className="cursor-pointer text-xs text-muted-foreground font-mono list-none flex items-center gap-1">
              <span className="text-micro-xs">›</span>
              Stderr output
            </summary>
            <pre className="mt-1.5 bg-surface-hi border border-border rounded-lg py-3 px-[14px] font-mono text-micro text-muted-foreground whitespace-pre-wrap overflow-auto max-h-[200px]">
              {currentRun.stderr}
            </pre>
          </details>
        )}
      </div>

      {/* Chat composer */}
      <div className="flex justify-center mt-3">
        <div className="relative w-full max-w-[700px]">
          {!showThinking && (
            <p className="hint text-center mb-2">
              Type <kbd className="code-chip">@</kbd> to see available actions
            </p>
          )}
          {mention.open && (
            <MentionPopover
              groups={mention.filteredGroups}
              activeIndex={mention.activeIndex}
              caretPos={mention.caretPos}
              onSelect={mention.handleSelect}
              onDismiss={mention.dismiss}
            />
          )}
          <ChatComposer
            isThinking={isStreaming}
            orbExiting={orbExiting}
            onCancel={handleCancel}
            composerRef={composerRef}
            placeholder={
              currentRun.status === 'lost'
                ? 'Cannot reply — run was lost'
                : 'Follow up, add context, or ask a question…'
            }
            disabled={inputDisabled}
            replyText={replyText}
            onChange={handleComposerChange}
            onInput={mention.onInput}
            onKeyDown={(e) => {
              mention.onKeyDown(e);
              if (!e.defaultPrevented && e.key === 'Enter' && !e.shiftKey && canReply) {
                e.preventDefault();
                handleReply(e);
              }
            }}
            onSubmit={handleReply}
          />
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
