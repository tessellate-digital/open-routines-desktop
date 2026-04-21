export function ErrorBubble({ content }: { content: string }) {
  return (
    <div
      className="py-2.5 px-[14px] rounded-[10px] text-destructive text-body-sm font-mono whitespace-pre-wrap"
      style={{
        background: 'color-mix(in srgb, var(--status-failed) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--status-failed) 25%, transparent)',
      }}
    >
      {content}
    </div>
  );
}
