import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-[22px]">
      <div>
        <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">{title}</h1>
        {subtitle && <div className="text-muted-foreground text-body-sm font-mono">{subtitle}</div>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
