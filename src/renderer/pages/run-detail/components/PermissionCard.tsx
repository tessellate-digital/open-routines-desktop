import { useState } from 'react';

interface PermissionCardProps {
  id: string;
  permission: string;
  patterns: string[];
  responded: 'once' | 'always' | 'reject' | null;
  onRespond?: (permissionId: string, response: 'once' | 'always' | 'reject') => void;
}

const PERM_LABELS: Record<string, string> = {
  read: 'Read file',
  edit: 'Edit file',
  bash: 'Run command',
  webfetch: 'Web fetch',
  websearch: 'Web search',
  external_directory: 'External directory',
};

const RESPONSE_LABELS: Record<string, string> = {
  once: 'Allowed once',
  always: 'Always allowed',
  reject: 'Denied',
};

export function PermissionCard({
  id,
  permission,
  patterns,
  responded,
  onRespond,
}: PermissionCardProps) {
  const [submitting, setSubmitting] = useState(false);
  const label = PERM_LABELS[permission] ?? permission;

  const handleClick = async (response: 'once' | 'always' | 'reject') => {
    if (!onRespond || submitting) {
      return;
    }
    setSubmitting(true);
    onRespond(id, response);
  };

  return (
    <div className="my-2 rounded-xl border border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 px-3.5 py-2.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="font-mono text-micro-sm uppercase tracking-caps text-fg-dim">
          Permission required
        </span>
      </div>

      <p className="text-body-sm font-medium mb-1">{label}</p>

      {patterns.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {patterns.map((p, i) => (
            <code
              key={i}
              className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
            >
              {p}
            </code>
          ))}
        </div>
      )}

      {responded ? (
        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${
            responded === 'reject'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}
        >
          {RESPONSE_LABELS[responded]}
        </span>
      ) : (
        <div className="flex gap-1.5">
          <button
            onClick={() => handleClick('once')}
            disabled={submitting}
            className="cursor-pointer text-xs font-medium px-2.5 py-1.5 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
          >
            Allow once
          </button>
          <button
            onClick={() => handleClick('always')}
            disabled={submitting}
            className="cursor-pointer text-xs font-medium px-2.5 py-1.5 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
          >
            Always allow
          </button>
          <button
            onClick={() => handleClick('reject')}
            disabled={submitting}
            className="cursor-pointer text-xs font-medium px-2.5 py-1.5 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}
