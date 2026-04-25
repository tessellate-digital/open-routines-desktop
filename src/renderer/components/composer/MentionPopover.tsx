import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { MentionAction } from '../../lib/mentions/mentionRegistry';
import './MentionPopover.css';

const GmailIcon = () => (
  <svg viewBox="0 0 256 193" width="16" height="16" fill="none">
    <path
      fill="#4285F4"
      d="M58.182 192.05V93.14L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"
    />
    <path
      fill="#34A853"
      d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-58.182 43.635z"
    />
    <path fill="#EA4335" d="M58.182 93.14V17.504L128 69.868l69.818-52.364V93.14L128 145.504z" />
    <path
      fill="#FBBC04"
      d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"
    />
    <path
      fill="#C5221F"
      d="M0 49.504l58.182 43.636V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"
    />
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 256 268" width="16" height="16" fill="none">
    <path
      fill="#FFF"
      d="M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188"
    />
    <path
      fill="#000"
      d="M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921M212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404z"
    />
  </svg>
);

const groupIconComponents: Record<string, ReactNode> = {
  Gmail: <GmailIcon />,
  Notion: <NotionIcon />,
};

interface MentionPopoverProps {
  groups: { group: string; items: MentionAction[] }[];
  activeIndex: number;
  caretPos?: { top: number; left: number } | null;
  onSelect: (action: MentionAction) => void;
  onDismiss: () => void;
}

export function MentionPopover({
  groups,
  activeIndex,
  caretPos,
  onSelect,
  onDismiss,
}: MentionPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openBelow, setOpenBelow] = useState(false);

  const measurePosition = useCallback(() => {
    if (!caretPos || !containerRef.current) {
      return;
    }
    const popoverHeight = containerRef.current.offsetHeight;
    setOpenBelow(caretPos.top - popoverHeight - 8 < 0);
  }, [caretPos]);

  useEffect(() => {
    measurePosition();
  }, [measurePosition, groups]);

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

  const style: CSSProperties | undefined = caretPos
    ? {
        position: 'fixed',
        top: caretPos.top,
        left: caretPos.left,
        transform: openBelow ? 'translateY(24px)' : 'translateY(calc(-100% - 8px))',
        bottom: 'auto',
      }
    : undefined;

  return (
    <div ref={containerRef} className="mention-popover" style={style}>
      {isEmpty ? (
        <div className="mention-popover-empty">No matching actions</div>
      ) : (
        groups.map(({ group, items }, groupIdx) => (
          <div key={group}>
            {groupIdx > 0 && <div className="mention-popover-group-divider" />}
            <div className="mention-popover-group">
              <span className="mention-popover-group-icon">
                {groupIconComponents[group] ?? null}
              </span>
              {group}
            </div>
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
                  {item.icon && <span className="mention-popover-item-icon">{item.icon}</span>}
                  <span className="mention-popover-item-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
