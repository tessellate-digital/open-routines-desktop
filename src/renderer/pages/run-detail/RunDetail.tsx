import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { BackLink } from '../../components/BackLink';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../lib/api';
import { useRunStream } from '../../hooks/useSSE';
import { StatusBadge } from '../../components/RunsTable';
import { duration } from '../../lib/utils';
import { useRunStore } from '../../stores/runStore';
import { TodoBox } from '../../components/TodoBox';
import { usePageContext } from '../../contexts/PageContext';
import { ComposerInput, MentionPopover, type ComposerInputHandle } from '../../components/composer';
import { useMentionPopover } from '../../hooks/composer';
import { ThreadItem } from './components';
import { parseSegments, extractTodos } from './utils';
import './RunDetail.style.css';

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
    appendPermission,
    updatePermissionResponse,
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

  const composerRef = useRef<ComposerInputHandle>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAfterReply = useRef(false);

  const isNearBottom = useCallback(() => {
    const scroller = document.querySelector('.scroller');
    if (!scroller) {
      return true;
    }
    const { scrollTop, scrollHeight, clientHeight } = scroller;
    return scrollHeight - scrollTop - clientHeight < 300;
  }, []);

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
      scrollToBottom();
    }
  }, [thread.length, scrollToBottom]);

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
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown'));
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
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
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
        alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
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
        alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
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
              onPermissionRespond={handlePermissionRespond}
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
              onSelect={mention.handleSelect}
              onDismiss={mention.dismiss}
            />
          )}
          <div
            className={classNames('chat-composer', { thinking: showThinking })}
            onClick={showThinking ? handleCancel : undefined}
          >
            {showThinking ? (
              <>
                <div
                  className={classNames(
                    'flex items-center justify-center w-[42px] h-[42px] rounded-full bg-[rgba(200,59,59,0.12)] shrink-0',
                    { 'orb-exit': orbExiting }
                  )}
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="var(--status-failed)">
                    <rect x="3" y="3" width="10" height="10" rx="2" />
                  </svg>
                </div>
              </>
            ) : (
              <div className={classNames('composer-input', { 'fade-in': !showThinking })}>
                <ComposerInput
                  ref={composerRef}
                  placeholder={
                    currentRun.status === 'lost'
                      ? 'Cannot reply — run was lost'
                      : 'Follow up, add context, or ask a question…'
                  }
                  disabled={inputDisabled}
                  onChange={handleComposerChange}
                  onInput={mention.onInput}
                  onKeyDown={(e) => {
                    mention.onKeyDown(e);
                    if (!e.defaultPrevented && e.key === 'Enter' && !e.shiftKey && canReply) {
                      e.preventDefault();
                      handleReply(e);
                    }
                  }}
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
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
