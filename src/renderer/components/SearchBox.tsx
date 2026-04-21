interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: SearchBoxProps) {
  return (
    <div
      className={`ml-auto flex items-center gap-2 py-1.5 px-3 bg-surface-hi border border-border-strong rounded-full min-w-[260px] [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:text-fg-dim [&_svg]:shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="m13 13-2.8-2.8" />
      </svg>
      <input
        className="flex-1 border-0 outline-0 bg-transparent font-sans text-body-sm text-foreground placeholder:text-fg-dim"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
