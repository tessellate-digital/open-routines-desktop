export function PromptContext({ context }: { context: string }) {
  return (
    <details>
      <summary className="cursor-pointer text-xs text-muted-foreground font-mono list-none flex items-center gap-1">
        <span className="text-micro-xs">›</span>
        Prompt context
      </summary>
      <pre className="mt-1.5 bg-surface-hi border border-border rounded-lg py-3 px-[14px] font-mono text-micro text-muted-foreground whitespace-pre-wrap overflow-auto max-h-[200px]">
        {context.trim()}
      </pre>
    </details>
  );
}
