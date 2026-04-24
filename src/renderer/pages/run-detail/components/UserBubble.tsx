import { useState } from 'react';
import { parseDisplayPrompt } from '../utils';

export function UserBubble({
  text,
  onAddToPrompt,
}: {
  text: string;
  onAddToPrompt?: () => Promise<void>;
}) {
  const segments = parseDisplayPrompt(text);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!onAddToPrompt || adding || added) {
      return;
    }
    setAdding(true);
    try {
      await onAddToPrompt();
      setAdded(true);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col items-end mb-[14px] gap-1.5">
      <div className="bg-accent text-accent-foreground py-2.5 px-4 rounded-[20px] text-sm leading-relaxed max-w-[480px] whitespace-pre-wrap">
        {segments.map((seg, i) =>
          seg.type === 'text' ? (
            seg.content
          ) : (
            <span
              key={i}
              className="inline-flex items-center rounded px-2 py-0.5 text-[12px] font-medium font-mono leading-relaxed bg-white/20 mx-0.5"
              title={seg.rawValue}
            >
              {seg.displayText}
            </span>
          )
        )}
      </div>
      {onAddToPrompt && (
        <button
          onClick={handleAdd}
          disabled={adding || added}
          className="inline-flex items-center gap-1.5 text-[11.5px] font-medium border border-border rounded-full px-3 py-1 bg-surface hover:bg-surface-hi text-fg-dim hover:text-foreground cursor-pointer transition-all duration-default disabled:opacity-60 disabled:cursor-default"
        >
          {added ? (
            <>
              <svg
                viewBox="0 0 12 12"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
              Prompt updated
            </>
          ) : adding ? (
            'Updating…'
          ) : (
            <>
              <svg
                viewBox="0 0 12 12"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 1.5 10.5 3.5 4 10H2V8L8.5 1.5Z" />
              </svg>
              Refine original prompt with this context?
            </>
          )}
        </button>
      )}
    </div>
  );
}
