import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import './ComposerInput.css';

export interface ComposerInputHandle {
  getPlainText(): string;
  getDisplayText(): string;
  insertChip(displayText: string, rawValue: string, actionId: string): void;
  focus(): void;
  clear(): void;
  setText(text: string): void;
}

interface ComposerInputProps {
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
  onChange?: (text: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onInput?: (e: React.FormEvent<HTMLDivElement>) => void;
}

const ComposerInput = forwardRef<ComposerInputHandle, ComposerInputProps>(
  ({ placeholder, disabled, defaultValue, className, onChange, onKeyDown, onInput }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Set initial text content once on mount if defaultValue is provided
    useEffect(() => {
      if (defaultValue && divRef.current && !divRef.current.textContent) {
        divRef.current.textContent = defaultValue;
      }
      // Intentionally only runs on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      getPlainText() {
        const div = divRef.current;
        if (!div) {
          return '';
        }
        let text = '';

        const walk = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            text += (node.textContent ?? '').replace(/\u00a0/g, ' ');
          } else if (node instanceof HTMLElement) {
            if (node.dataset.mentionValue !== undefined) {
              text += node.dataset.mentionValue;
            } else if (node.tagName === 'BR') {
              text += '\n';
            } else {
              for (const child of node.childNodes) {
                walk(child);
              }
              if (node.tagName === 'DIV' || node.tagName === 'P') {
                if (text && !text.endsWith('\n')) {
                  text += '\n';
                }
              }
            }
          }
        };

        for (const child of div.childNodes) {
          walk(child);
        }
        return text.replace(/\n$/, '');
      },

      getDisplayText() {
        const div = divRef.current;
        if (!div) {
          return '';
        }
        let text = '';

        const walk = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            text += (node.textContent ?? '').replace(/\u00a0/g, ' ');
          } else if (node instanceof HTMLElement) {
            if (
              node.dataset.mentionValue !== undefined &&
              node.dataset.mentionAction !== undefined
            ) {
              text += `@customTag:${node.dataset.mentionAction}(${node.dataset.mentionValue})`;
            } else if (node.tagName === 'BR') {
              text += '\n';
            } else {
              for (const child of node.childNodes) {
                walk(child);
              }
              if (node.tagName === 'DIV' || node.tagName === 'P') {
                if (text && !text.endsWith('\n')) {
                  text += '\n';
                }
              }
            }
          }
        };

        for (const child of div.childNodes) {
          walk(child);
        }
        return text.replace(/\n$/, '');
      },

      insertChip(displayText: string, rawValue: string, actionId: string) {
        const div = divRef.current;
        if (!div) {
          return;
        }
        div.focus();

        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
          return;
        }

        const range = sel.getRangeAt(0);
        const container = range.startContainer;
        const offset = range.startOffset;

        if (container.nodeType !== Node.TEXT_NODE) {
          return;
        }

        const textBefore = (container.textContent ?? '').slice(0, offset);
        const atIdx = textBefore.lastIndexOf('@');
        if (atIdx === -1) {
          return;
        }

        const deleteRange = document.createRange();
        deleteRange.setStart(container, atIdx);
        deleteRange.setEnd(container, offset);
        deleteRange.deleteContents();

        const chip = document.createElement('span');
        chip.contentEditable = 'false';
        chip.dataset.mentionValue = rawValue;
        chip.dataset.mentionAction = actionId;
        chip.className = 'mention-chip';
        chip.textContent = displayText;

        deleteRange.insertNode(chip);

        const space = document.createTextNode('\u00a0');
        chip.after(space);

        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        onChangeRef.current?.(div.textContent ?? '');
      },

      focus() {
        divRef.current?.focus();
      },

      clear() {
        if (divRef.current) {
          divRef.current.innerHTML = '';
          onChangeRef.current?.('');
        }
      },

      setText(text: string) {
        if (divRef.current) {
          divRef.current.textContent = text;
          onChangeRef.current?.(text);
        }
      },
    }));

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      onInput?.(e);
      onChangeRef.current?.(divRef.current?.textContent ?? '');
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        return;
      }
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      onChangeRef.current?.(divRef.current?.textContent ?? '');
    };

    return (
      <div
        ref={divRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        aria-disabled={disabled}
        className={['composer-editable', className].filter(Boolean).join(' ')}
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
      />
    );
  }
);

ComposerInput.displayName = 'ComposerInput';

export { ComposerInput };
