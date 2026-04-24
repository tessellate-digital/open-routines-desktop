import classNames from 'classnames';
import type { Segment } from '../../../stores/runStore';
import { QuestionsCard } from './QuestionsCard';

interface ToolRowProps {
  seg: Segment & { kind: 'tool' };
  onToggle: () => void;
  onReply?: (text: string) => void;
}

export function ToolRow({ seg, onToggle, onReply }: ToolRowProps) {
  if (seg.name === 'skill') {
    let skillName = seg.args;
    try {
      const parsed = JSON.parse(seg.args) as { name?: string };
      if (parsed?.name) {
        skillName = parsed.name;
      }
    } catch {
      /* use raw args */
    }
    return (
      <div className="mb-3">
        <span className="inline-flex items-center gap-[5px] font-mono text-caption text-muted-foreground">
          <span className="text-micro-xs opacity-70">›</span>
          <span className="font-medium">{skillName} skill loaded</span>
        </span>
      </div>
    );
  }

  if (seg.name === 'bash') {
    let command = seg.args;
    try {
      const parsed = JSON.parse(seg.args) as { command?: string };
      if (parsed?.command) {
        command = parsed.command;
      }
    } catch {
      /* use raw args */
    }
    const firstLine = command.split('\n')[0].trim();
    const summary = firstLine.length > 72 ? firstLine.slice(0, 72) + '…' : firstLine;

    return (
      <div className="mb-3">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-[5px] bg-transparent border-none py-0.5 px-0 font-mono text-caption text-muted-foreground cursor-pointer max-w-full"
        >
          <span className="text-micro-xs opacity-70 shrink-0">{seg.open ? '▼' : '›'}</span>
          <span className="font-medium shrink-0">bash</span>
          {!seg.open && summary && (
            <span className="opacity-50 font-normal truncate">{summary}</span>
          )}
        </button>
        {seg.open && (
          <div className="mt-1 bg-surface-hi border border-border rounded-lg py-3 px-[14px] font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {seg.args && <div className={classNames({ 'mb-2': seg.result })}>{seg.args}</div>}
            {seg.result && <div className="text-fg-dim">{seg.result}</div>}
          </div>
        )}
      </div>
    );
  }

  if (seg.name === 'question') {
    try {
      const parsed = JSON.parse(seg.args);
      if (Array.isArray(parsed?.questions)) {
        return <QuestionsCard questions={parsed.questions} onReply={onReply} />;
      }
    } catch {
      /* fall through to default */
    }
  }

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-[5px] bg-transparent border-none py-0.5 px-0 font-mono text-caption text-muted-foreground cursor-pointer"
      >
        <span className="text-micro-xs opacity-70">{seg.open ? '▼' : '›'}</span>
        <span className="font-medium">{seg.name}</span>
      </button>
      {seg.open && (
        <div className="mt-1 bg-surface-hi border border-border rounded-lg py-3 px-[14px] font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {seg.args && <div className={classNames({ 'mb-2': seg.result })}>{seg.args}</div>}
          {seg.result && <div className="text-fg-dim">{seg.result}</div>}
        </div>
      )}
    </div>
  );
}
