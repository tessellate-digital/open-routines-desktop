import { memo } from 'react';
import type { Segment } from '../../../stores/runStore';
import { SegmentList } from './SegmentList';
import './AssistantCard.css';

interface AssistantCardProps {
  segments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  isStreaming?: boolean;
  onReply?: (text: string) => void;
  onPermissionRespond?: (permissionId: string, response: 'once' | 'always' | 'reject') => void;
}

export const AssistantCard = memo(function AssistantCard({
  segments,
  toggledTools,
  onToggleTool,
  isStreaming,
  onReply,
  onPermissionRespond,
}: AssistantCardProps) {
  const hasContent = segments.length > 0;
  if (!hasContent && !isStreaming) {
    return null;
  }
  return (
    <div className="flex justify-start mb-[14px]">
      <div
        className={`border border-border py-3 px-4 rounded-2xl shadow-sm max-w-[640px] w-full${isStreaming ? ' streaming-border' : ''}`}
        style={{
          background:
            'radial-gradient(60% 60% at 0% 100%, rgba(79, 70, 229, 0.05) 0%, transparent 100%), radial-gradient(60% 60% at 100% 0%, rgba(236, 72, 153, 0.04) 0%, transparent 100%), var(--surface-hi)',
        }}
      >
        {segments.length === 0 && isStreaming ? (
          <span className="font-mono text-body-sm text-fg-dim animate-pulse">Thinking…</span>
        ) : (
          <SegmentList
            segments={segments}
            toggledTools={toggledTools}
            onToggleTool={onToggleTool}
            onReply={onReply}
            onPermissionRespond={onPermissionRespond}
          />
        )}
      </div>
    </div>
  );
});
