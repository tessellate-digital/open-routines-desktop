import type { ReactNode } from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actions, icon }: EmptyStateProps) {
  return (
    <Card>
      <div className="py-20 px-10 text-center grid gap-2.5 justify-items-center">
        {icon && <div className="mb-3">{icon}</div>}
        <h2 className="text-title m-0 font-semibold">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm max-w-[420px] m-0 leading-relaxed">
            {description}
          </p>
        )}
        {actions && <div className="flex gap-2 mt-4">{actions}</div>}
      </div>
    </Card>
  );
}
