import { parseDisplayPrompt } from '../utils';

export function UserBubble({ text }: { text: string }) {
  const segments = parseDisplayPrompt(text);
  return (
    <div className="flex justify-end mb-[14px]">
      <div className="bg-accent text-accent-foreground py-2.5 px-4 rounded-[20px] text-sm leading-relaxed max-w-[480px] whitespace-pre-wrap">
        {segments.map((seg, i) =>
          seg.type === 'text' ? (
            seg.content
          ) : (
            <span
              key={i}
              className="inline-flex items-center rounded px-1.5 text-[13px] font-medium leading-relaxed bg-white/20 mx-0.5"
              title={seg.rawValue}
            >
              {seg.displayText}
            </span>
          )
        )}
      </div>
    </div>
  );
}
