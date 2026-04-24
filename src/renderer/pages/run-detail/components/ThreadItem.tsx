import { memo, useMemo } from 'react';
import type { Run } from '../../../lib/types';
import type { Segment } from '../../../stores/runStore';
import { parseSegments } from '../utils';
import { UserBubble } from './UserBubble';
import { AssistantCard } from './AssistantCard';
import { PromptContext } from './PromptContext';

interface ThreadItemProps {
  run: Run;
  isFirst: boolean;
  isLast: boolean;
  isStreaming: boolean;
  liveSegments: Segment[];
  toggledTools: Set<number>;
  onToggleTool: (idx: number) => void;
  onReply?: (text: string) => void;
  onPermissionRespond?: (permissionId: string, response: 'once' | 'always' | 'reject') => void;
  onAddToPrompt?: (text: string) => Promise<void>;
}

export const ThreadItem = memo(function ThreadItem({
  run,
  isFirst,
  isLast,
  isStreaming,
  liveSegments,
  toggledTools,
  onToggleTool,
  onReply,
  onPermissionRespond,
  onAddToPrompt,
}: ThreadItemProps) {
  const segments = useMemo(
    () => (isLast && isStreaming ? liveSegments : parseSegments(run.stdout || [])),
    [isLast, isStreaming, liveSegments, run.stdout]
  );

  return (
    <div>
      {isFirst &&
        typeof run.metadata?.prompt_context === 'string' &&
        run.metadata.prompt_context && <PromptContext context={run.metadata.prompt_context} />}
      {run.display_prompt && (
        <UserBubble
          text={run.display_prompt}
          onAddToPrompt={
            !isFirst && onAddToPrompt
              ? () => onAddToPrompt(run.prompt ?? run.display_prompt ?? '')
              : undefined
          }
        />
      )}
      <AssistantCard
        segments={segments}
        toggledTools={toggledTools}
        onToggleTool={onToggleTool}
        isStreaming={isLast && isStreaming}
        onReply={isLast ? onReply : undefined}
        onPermissionRespond={isLast ? onPermissionRespond : undefined}
      />
      {!isLast && <div className="divider" />}
    </div>
  );
});
