import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`font-mono text-micro uppercase tracking-caps text-muted-foreground mb-2.5 font-semibold ${className}`}
    >
      {children}
    </div>
  );
}
