import { useState, useCallback, type RefObject } from 'react';
import {
  mentionActions,
  filterActions,
  groupActions,
  type MentionAction,
} from '../../lib/mentions';
import type { ComposerInputHandle } from '../../components/composer';

function detectMention(): string | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return null;
  }

  const range = sel.getRangeAt(0);
  if (!range.collapsed) {
    return null;
  }

  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const offset = range.startOffset;
  const textBefore = (node.textContent ?? '').slice(0, offset);

  const match = textBefore.match(/@([^@\s]*)$/);
  if (!match) {
    return null;
  }

  return match[1];
}

export function useMentionPopover(inputRef: RefObject<ComposerInputHandle | null>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredActions = filterActions(mentionActions, query);
  const filteredGroups = groupActions(filteredActions);

  const onInput = useCallback(() => {
    const q = detectMention();
    if (q !== null) {
      setQuery(q);
      setActiveIndex(0);
      setOpen(true);
    } else {
      setOpen(false);
      setQuery('');
    }
  }, []);

  const handleSelect = useCallback(
    async (action: MentionAction) => {
      setOpen(false);
      setQuery('');
      const value = await action.onSelect();
      if (value == null) {
        return;
      }
      const displayText = action.renderer(value);
      inputRef.current?.insertChip(displayText, String(value), action.id);
    },
    [inputRef]
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredActions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        const action = filteredActions[activeIndex];
        if (action) {
          e.preventDefault();
          handleSelect(action);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
      }
    },
    [open, filteredActions, activeIndex, handleSelect, dismiss]
  );

  return {
    open,
    filteredGroups,
    filteredActions,
    activeIndex,
    onKeyDown,
    handleSelect,
    dismiss,
    onInput,
  };
}
