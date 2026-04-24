import type { ReactNode } from 'react';

type Level = 'allow' | 'ask' | 'deny';

const ACTIVE_STYLE: Record<Level, string> = {
  allow: 'bg-success/15 text-success',
  ask: 'bg-orange-500/15 text-orange-500',
  deny: 'bg-destructive/15 text-destructive',
};
const DOT_STYLE: Record<Level, string> = {
  allow: 'bg-success',
  ask: 'bg-orange-500',
  deny: 'bg-destructive',
};

function RadioPills({ active }: { active: Level }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      {(['allow', 'ask', 'deny'] as Level[]).map((lvl) =>
        lvl === active ? (
          <span
            key={lvl}
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${ACTIVE_STYLE[lvl]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLE[lvl]}`} />
            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </span>
        ) : (
          <span key={lvl} className="text-[11px] text-fg-dim px-1.5 py-0.5">
            · {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </span>
        )
      )}
    </div>
  );
}

function PermRow({
  icon,
  label,
  badge,
  level,
  children,
  open,
}: {
  icon: ReactNode;
  label: string;
  badge?: number;
  level: Level;
  children?: ReactNode;
  open?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface-hi">
      <div className="flex items-center gap-3 px-3.5 py-3">
        <span className="shrink-0">{icon}</span>
        <span className="text-body-sm font-medium flex-1">{label}</span>
        {badge != null && (
          <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center shrink-0">
            {badge}
          </span>
        )}
        <RadioPills active={level} />
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-fg-dim shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>
      {children && <div className="border-t border-border">{children}</div>}
    </div>
  );
}

function ExceptionRule({ path, level }: { path: string; level: Level }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2">
      <input readOnly value={path} className="input flex-1 font-mono text-xs py-1.5" />
      <RadioPills active={level} />
      <button className="text-fg-dim hover:text-destructive transition-colors">
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </div>
  );
}

function AddRuleRow({ placeholder }: { placeholder: string }) {
  return (
    <div className="px-3.5 py-2 space-y-2">
      <div className="flex gap-2">
        <input
          readOnly
          placeholder={placeholder}
          className="input flex-1 font-mono text-xs py-1.5 placeholder:text-fg-dim"
        />
        <button className="btn sm">Browse…</button>
        <button className="btn sm primary">Add rule</button>
      </div>
      <p className="font-mono text-[10px] text-fg-dim leading-relaxed">
        Glob patterns over file paths: <code>**</code> matches any subtree.
      </p>
    </div>
  );
}

// Icons
const FileIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-fg-dim"
  >
    <path d="M10 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L10 2z" />
    <path d="M10 2v4h4" />
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-orange-400"
  >
    <path d="M11 2.5 13.5 5 5.5 13H3v-2.5L11 2.5Z" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M2 8h12M8 2a9 9 0 0 1 0 12M8 2a9 9 0 0 0 0 12" />
  </svg>
);
const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-400"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="m11 11 2.5 2.5" />
  </svg>
);
const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <rect width="24" height="24" rx="4" fill="#EA4335" opacity="0.15" />
    <path d="M4 7l8 5 8-5" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" />
    <rect
      x="4"
      y="7"
      width="16"
      height="11"
      rx="1"
      stroke="#EA4335"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export function PermissionsMockup() {
  return (
    <div className="route-fade space-y-5">
      {/* Section header */}
      <div>
        <h2 className="text-section font-semibold mb-1">Permissions</h2>
        <p className="font-mono text-xs text-fg-muted leading-relaxed">
          The sandbox this routine runs inside. Ask-first is the default; tighten or relax per
          capability.
        </p>
      </div>

      <div className="space-y-2">
        {/* Read files — collapsed with add-rule row visible */}
        <PermRow icon={<FileIcon />} label="Read files" level="deny" open>
          <AddRuleRow placeholder="e.g. ~/.ssh/**,**/secrets/**" />
        </PermRow>

        {/* Edit files — expanded with one exception rule */}
        <PermRow icon={<EditIcon />} label="Edit files" level="deny" badge={1} open>
          <div className="space-y-0">
            <ExceptionRule path="~/Documents/Invoices" level="allow" />
            <div className="border-t border-border" />
            <AddRuleRow placeholder="e.g. ~/.ssh/**,**/secrets/**" />
          </div>
        </PermRow>

        {/* Web fetch — collapsed */}
        <PermRow icon={<GlobeIcon />} label="Web fetch" level="deny" />

        {/* Web & code search — collapsed */}
        <PermRow icon={<SearchIcon />} label="Web & code search" level="deny" />
      </div>

      {/* Connected Apps */}
      <div>
        <h2 className="text-section font-semibold mb-1">Connected Apps</h2>
        <p className="font-mono text-xs text-fg-muted mb-3 leading-relaxed">
          Grant this routine access to external services you&apos;ve connected in Settings.
        </p>
        <div className="border border-border rounded-lg bg-surface-hi overflow-hidden">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <GmailIcon />
            <span className="text-body-sm font-medium flex-1">Gmail</span>
            <span className="text-xs text-fg-dim mr-2">Read only</span>
            <div className="w-[18px] h-[18px] rounded bg-accent grid place-items-center">
              <svg
                viewBox="0 0 12 12"
                width="11"
                height="11"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
