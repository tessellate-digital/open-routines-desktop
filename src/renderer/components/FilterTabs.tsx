import classNames from 'classnames';

export type FilterValue = 'all' | 'running' | 'success' | 'failed';

interface FilterTabsProps {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

const tabs: { id: FilterValue; label: string; dot?: string; activeBg: string }[] = [
  { id: 'all', label: 'All', activeBg: 'bg-pink-500/15 text-pink-500 shadow-sm' },
  {
    id: 'running',
    label: 'Running',
    dot: 'bg-running',
    activeBg: 'bg-running/20 text-running shadow-sm',
  },
  {
    id: 'success',
    label: 'Success',
    dot: 'bg-success',
    activeBg: 'bg-success/20 text-success shadow-sm',
  },
  {
    id: 'failed',
    label: 'Failed',
    dot: 'bg-destructive',
    activeBg: 'bg-destructive/20 text-destructive shadow-sm',
  },
];

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface border border-muted p-1">
      {tabs.map((t) => {
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            className={classNames(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-caption font-medium cursor-pointer font-sans transition-all duration-default ease-default border-none',
              isActive ? t.activeBg : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onChange(t.id)}
          >
            {t.dot && (
              <span
                className={classNames(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  isActive ? t.dot : 'bg-muted-foreground/60'
                )}
              />
            )}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
