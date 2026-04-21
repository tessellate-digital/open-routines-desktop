export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end mb-[14px]">
      <div className="bg-accent text-accent-foreground py-2.5 px-4 rounded-[20px] text-sm leading-relaxed max-w-[480px] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
