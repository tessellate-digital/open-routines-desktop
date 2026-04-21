interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}

import type { ReactNode } from 'react';

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="py-[14px] px-4 bg-secondary border border-muted rounded-md shadow-sm">
      <div className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim">{label}</div>
      <div className="text-title font-semibold tracking-[-0.01em] mt-1 tabular-nums">{value}</div>
      {sub && <div className="font-mono text-micro text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
