import { useRef, useEffect } from 'react';
import type { MentionAction } from '../../lib/mentions/mentionRegistry';
import './MentionPopover.css';

interface MentionPopoverProps {
  groups: { group: string; items: MentionAction[] }[];
  activeIndex: number;
  onSelect: (action: MentionAction) => void;
  onDismiss: () => void;
}

export function MentionPopover({ groups, activeIndex, onSelect, onDismiss }: MentionPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onDismiss]);

  const isEmpty = groups.every((g) => g.items.length === 0);

  let flatIdx = 0;

  return (
    <div ref={containerRef} className="mention-popover">
      {isEmpty ? (
        <div className="mention-popover-empty">No matching actions</div>
      ) : (
        groups.map(({ group, items }) => (
          <div key={group}>
            <div className="mention-popover-group">{group}</div>
            {items.map((item) => {
              const isActive = flatIdx === activeIndex;
              flatIdx++;
              return (
                <button
                  key={item.id}
                  className={`mention-popover-item${isActive ? ' active' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(item);
                  }}
                >
                  <span className="mention-popover-item-label">{item.label}</span>
                  {item.description && (
                    <span className="mention-popover-item-desc">{item.description}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
