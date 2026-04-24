import { useState, useRef } from 'react';
import classNames from 'classnames';

export interface FileFilterValue {
  mode: 'include' | 'exclude' | 'none';
  patterns: string[];
}

interface FileTypeFilterProps {
  value: FileFilterValue;
  onChange: (v: FileFilterValue) => void;
}

const CATEGORIES: { name: string; extensions: string[] }[] = [
  { name: 'Code', extensions: ['.ts', '.js', '.py', '.go', '.rs', '.java', '.cpp', '.c'] },
  { name: 'Docs', extensions: ['.md', '.txt', '.pdf', '.docx', '.doc'] },
  { name: 'Images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] },
  { name: 'Video', extensions: ['.mp4', '.mkv', '.avi', '.mov', '.webm'] },
  { name: 'Audio', extensions: ['.mp3', '.flac', '.wav', '.aac', '.ogg'] },
];

const MODES = [
  { value: 'none' as const, label: 'All files', prefix: '●', activeClass: '' },
  {
    value: 'include' as const,
    label: 'Only these types',
    prefix: '✓',
    activeClass: 'bg-success/15 text-success border-success/30',
  },
  {
    value: 'exclude' as const,
    label: 'Exclude these types',
    prefix: '×',
    activeClass: 'bg-destructive/15 text-destructive border-destructive/30',
  },
];

export function FileTypeFilter({ value, onChange }: FileTypeFilterProps) {
  const [customInput, setCustomInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = new Set(value.patterns);

  const toggle = (ext: string) => {
    const next = new Set(selected);
    if (next.has(ext)) {
      next.delete(ext);
    } else {
      next.add(ext);
    }
    onChange({ ...value, patterns: [...next] });
  };

  const toggleCategory = (extensions: string[]) => {
    const next = new Set(value.patterns);
    const allPresent = extensions.every((ext) => next.has(ext));
    if (allPresent) {
      extensions.forEach((ext) => next.delete(ext));
    } else {
      extensions.forEach((ext) => next.add(ext));
    }
    onChange({ ...value, patterns: [...next] });
  };

  const addCustom = () => {
    let ext = customInput.trim().toLowerCase();
    if (!ext) {
      return;
    }
    if (!ext.startsWith('.')) {
      ext = '.' + ext;
    }
    if (!selected.has(ext)) {
      onChange({ ...value, patterns: [...value.patterns, ext] });
    }
    setCustomInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  const active = value.mode !== 'none';

  return (
    <div className="flex flex-col gap-2.5">
      <div className="chip-row">
        {MODES.map((m) => (
          <button
            type="button"
            key={m.value}
            className={classNames('chip', value.mode === m.value ? m.activeClass || 'active' : '')}
            onClick={() => onChange({ ...value, mode: m.value })}
          >
            <span
              className={classNames('mr-1', value.mode === m.value ? 'opacity-100' : 'opacity-40')}
            >
              {m.prefix}
            </span>
            {m.label}
          </button>
        ))}
      </div>

      {active && (
        <div className="flex flex-col gap-2.5 ml-1 pl-[14px] border-l-2 border-accent">
          <div className="text-micro text-fg-dim">
            {value.mode === 'include'
              ? 'Only fire when a file has one of these extensions:'
              : 'Fire for all files except those with these extensions:'}
          </div>

          <div className="chip-row">
            {CATEGORIES.map((cat) => {
              const allPresent = cat.extensions.every((ext) => selected.has(ext));
              return (
                <button
                  type="button"
                  key={cat.name}
                  className={classNames('chip', { active: allPresent })}
                  onClick={() => toggleCategory(cat.extensions)}
                >
                  {cat.name}
                  <span className={classNames('ml-1 text-micro opacity-60')}>
                    {cat.extensions.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-1.5 items-center">
            <input
              ref={inputRef}
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="custom extension — csv, dmg, ..."
              className="input flex-1 max-w-[280px] !py-1.5 !px-2 !text-body-sm"
            />
            <button
              type="button"
              className="btn sm"
              onClick={addCustom}
              disabled={!customInput.trim()}
            >
              Add
            </button>
          </div>

          {value.patterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {value.patterns.map((ext) => (
                <span
                  key={ext}
                  className={classNames(
                    'inline-flex items-center gap-1 py-1 px-2 rounded-sm text-xs font-mono',
                    {
                      'text-success': value.mode === 'include',
                      'text-destructive': value.mode === 'exclude',
                    }
                  )}
                  style={{
                    background:
                      value.mode === 'include'
                        ? 'color-mix(in srgb, var(--status-success) 15%, transparent)'
                        : 'color-mix(in srgb, var(--status-failed) 15%, transparent)',
                  }}
                >
                  {ext}
                  <button
                    type="button"
                    onClick={() => toggle(ext)}
                    className="bg-transparent border-0 p-0 ml-0.5 cursor-pointer opacity-70 hover:opacity-100 text-inherit text-sm leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
