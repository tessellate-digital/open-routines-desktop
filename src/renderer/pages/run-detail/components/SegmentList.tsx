import { memo } from 'react';
import type { Segment } from '../../../stores/runStore';
import { AgentText } from './AgentText';
import { ErrorBubble } from './ErrorBubble';
import { StepDivider } from './StepDivider';
import { ToolRow } from './ToolRow';
import { PermissionCard } from './PermissionCard';

interface SegmentListProps {
  segments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  onReply?: (text: string) => void;
  onPermissionRespond?: (permissionId: string, response: 'once' | 'always' | 'reject') => void;
}

export const SegmentList = memo(function SegmentList({
  segments,
  toggledTools,
  onToggleTool,
  onReply,
  onPermissionRespond,
}: SegmentListProps) {
  return (
    <>
      {segments
        .filter((seg) => {
          // Hide token-fetch bash calls — they contain auth tokens and add no user value
          if (seg.kind === 'tool' && seg.name === 'bash' && seg.args.includes('/api/gmail/token')) {
            return false;
          }
          return true;
        })
        .map((seg, idx) => {
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
            return (
              <ToolRow
                key={idx}
                seg={seg}
                open={seg.open || toggledTools.has(idx)}
                idx={idx}
                onToggle={onToggleTool}
                onReply={onReply}
              />
            );
          }
          if (seg.kind === 'permission') {
            return (
              <PermissionCard
                key={idx}
                id={seg.id}
                permission={seg.permission}
                patterns={seg.patterns}
                responded={seg.responded}
                onRespond={onPermissionRespond}
              />
            );
          }
          return null;
        })}
    </>
  );
});
