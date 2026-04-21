import type { ReactNode } from 'react';
import { Card } from './Card';

interface DataTableProps {
  columns: string[];
  children: ReactNode;
}

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <Card>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((h) => (
              <th
                key={h || '__empty'}
                className="text-left font-mono text-micro-sm font-medium uppercase tracking-caps text-fg-dim py-3 px-[18px] border-b border-muted bg-surface"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </Card>
  );
}

export function TableRow({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer transition-colors duration-default ease-default border-b border-muted last:border-b-0 hover:bg-muted"
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`py-3.5 px-[18px] text-body-sm align-middle ${className}`}>{children}</td>;
}
