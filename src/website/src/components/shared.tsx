import { statusColorMap } from './mockData';

export function StatusBadge({ status }: { status: string }) {
  const color = statusColorMap[status] ?? 'text-pending';
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${color}`}>
      <span
        className={`w-[7px] h-[7px] rounded-full bg-current shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_22%,transparent)] ${
          status === 'running' ? 'animate-pulse' : ''
        }`}
      />
      <span>{status}</span>
    </span>
  );
}

export function TriggerChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-[5px] font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted">
      {label}
    </span>
  );
}

export function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}
