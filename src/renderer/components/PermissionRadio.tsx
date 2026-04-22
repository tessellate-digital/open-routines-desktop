import classNames from 'classnames';
import type { PermissionLevel } from '../lib/types';

const OPTIONS: { value: PermissionLevel; label: string; dot: string; activeBg: string }[] = [
  {
    value: 'allow',
    label: 'Allow',
    dot: 'bg-success',
    activeBg: 'bg-success/20 text-success shadow-sm',
  },
  {
    value: 'ask',
    label: 'Ask',
    dot: 'bg-accent',
    activeBg: 'bg-accent/20 text-accent shadow-sm',
  },
  {
    value: 'deny',
    label: 'Deny',
    dot: 'bg-destructive',
    activeBg: 'bg-destructive/20 text-destructive shadow-sm',
  },
];

interface PermissionRadioProps {
  value: PermissionLevel;
  onChange?: (v: PermissionLevel) => void;
  readOnly?: boolean;
}

export function PermissionRadio({ value, onChange, readOnly = false }: PermissionRadioProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface border border-muted p-1">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={readOnly}
            className={classNames(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-caption font-medium font-sans transition-all duration-default ease-default border-none',
              readOnly ? 'cursor-default' : 'cursor-pointer',
              isActive
                ? opt.activeBg
                : readOnly
                  ? 'bg-transparent text-muted-foreground/40'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => !readOnly && onChange?.(opt.value)}
          >
            <span
              className={classNames(
                'w-1.5 h-1.5 rounded-full transition-colors',
                isActive ? opt.dot : readOnly ? 'bg-muted-foreground/20' : 'bg-muted-foreground/60'
              )}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
