import {
  type RefObject,
  type FormEvent,
  type FormEventHandler,
  type KeyboardEventHandler,
} from 'react';
import classNames from 'classnames';
import { ComposerInput, type ComposerInputHandle } from '../../../components/composer';

interface ChatComposerProps {
  isThinking: boolean;
  orbExiting: boolean;
  onCancel: () => void;
  composerRef: RefObject<ComposerInputHandle | null>;
  placeholder: string;
  disabled: boolean;
  replyText: string;
  onChange: (text: string) => void;
  onInput: FormEventHandler;
  onKeyDown: KeyboardEventHandler;
  onSubmit: (e: FormEvent) => void;
}

export function ChatComposer({
  isThinking,
  orbExiting,
  onCancel,
  composerRef,
  placeholder,
  disabled,
  replyText,
  onChange,
  onInput,
  onKeyDown,
  onSubmit,
}: ChatComposerProps) {
  return (
    <div className="composer-wrapper">
      {/* Input pill — always in DOM, fades + shrinks via compositor-only CSS */}
      <div className={classNames('chat-composer', { 'is-thinking': isThinking })}>
        <ComposerInput
          ref={composerRef}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onInput={onInput}
          onKeyDown={onKeyDown}
        />
        <button
          className={classNames('btn primary rounded-full py-[9px] px-[18px] shrink-0', {
            'opacity-100': replyText.trim() && !disabled,
            'opacity-45': !replyText.trim() || disabled,
          })}
          onClick={onSubmit}
          disabled={disabled || !replyText.trim()}
        >
          Send
        </button>
      </div>

      {/* Stop orb — always in DOM, scales in via compositor-only CSS */}
      <button
        className={classNames('stop-orb', {
          'is-visible': isThinking && !orbExiting,
          'orb-exit': orbExiting,
        })}
        onClick={onCancel}
        tabIndex={isThinking ? 0 : -1}
        aria-label="Stop"
      >
        <div className="stop-orb-icon">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="var(--status-failed)">
            <rect x="3" y="3" width="10" height="10" rx="2" />
          </svg>
        </div>
      </button>
    </div>
  );
}
