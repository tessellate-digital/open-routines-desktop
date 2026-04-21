import { memo } from 'react';
import type { Segment } from '../../../stores/runStore';
import { AgentText } from './AgentText';
import { ErrorBubble } from './ErrorBubble';
import { StepDivider } from './StepDivider';
import { ToolRow } from './ToolRow';

interface SegmentListProps {
  segments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  onReply?: (text: string) => void;
}

export const SegmentList = memo(function SegmentList({
  segments,
  toggledTools,
  onToggleTool,
  onReply,
}: SegmentListProps) {
  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.kind === 'text') {
          return <AgentText key={idx} content={seg.content} onReply={onReply} />;
        }
        if (seg.kind === 'error') {
          return <ErrorBubble key={idx} content={seg.content} />;
        }
        if (seg.kind === 'step') {
          return <StepDivider key={idx} />;
        }
        if (seg.kind === 'tool') {
          const open = seg.open || toggledTools.has(idx);
          return (
            <ToolRow
              key={idx}
              seg={{ ...seg, open }}
              onToggle={() => onToggleTool(idx)}
              onReply={onReply}
            />
          );
        }
        return null;
      })}
    </>
  );
});
