import { useState } from 'react';
import type { Question } from '../types';

interface QuestionsCardProps {
  questions: Question[];
  onReply?: (text: string) => void;
}

export function QuestionsCard({ questions, onReply }: QuestionsCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const interactive = !!onReply && !selected;

  const handleClick = (label: string) => {
    if (!interactive) {
      return;
    }
    setSelected(label);
    onReply!(label);
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qi) => (
        <div key={qi}>
          {q.header && (
            <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim mb-[6px]">
              {q.header}
            </div>
          )}
          <p className="text-body font-medium mb-3">{q.question}</p>
          <div className="flex flex-col gap-[6px]">
            {q.options.map((opt, oi) => {
              const isSelected = selected === opt.label;
              const isOther = selected !== null && !isSelected;
              return (
                <button
                  key={oi}
                  onClick={() => handleClick(opt.label)}
                  disabled={!interactive}
                  className={`cursor-pointer text-left px-3 py-2.5 rounded-[10px] border transition-all duration-[160ms] group
                    ${
                      isSelected
                        ? 'border-accent bg-accent-soft'
                        : isOther
                          ? 'border-border bg-surface opacity-40'
                          : interactive
                            ? 'border-border bg-surface hover:border-accent hover:bg-accent-soft'
                            : 'border-border bg-surface opacity-60 cursor-default'
                    }`}
                >
                  <span
                    className={`font-mono text-caption-sm font-semibold ${isSelected ? 'text-accent' : 'text-accent'}`}
                  >
                    {opt.label}
                    {isSelected && <span className="ml-1.5 opacity-70">✓</span>}
                  </span>
                  {opt.description && (
                    <span className="text-caption text-muted-foreground ml-2">
                      — {opt.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
