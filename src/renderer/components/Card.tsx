import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-secondary border border-muted rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
