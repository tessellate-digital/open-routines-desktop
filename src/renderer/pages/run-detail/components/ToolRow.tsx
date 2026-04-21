import classNames from 'classnames';
import type { Segment } from '../../../stores/runStore';
import { QuestionsCard } from './QuestionsCard';

interface ToolRowProps {
  seg: Segment & { kind: 'tool' };
  onToggle: () => void;
  onReply?: (text: string) => void;
}

export function ToolRow({ seg, onToggle, onReply }: ToolRowProps) {
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
