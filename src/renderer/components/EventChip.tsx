interface EventChipProps {
  children: string;
}

export function EventChip({ children }: EventChipProps) {
  return (
    <span className="inline-flex items-center gap-[5px] font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted">
      {children}
    </span>
  );
}
