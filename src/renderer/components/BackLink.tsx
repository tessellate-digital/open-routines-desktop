import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children: string;
}

function ChevronLeftIcon() {
  return (
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
      <path d="m10 3-5 5 5 5" />
    </svg>
  );
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-caption text-muted-foreground font-mono cursor-pointer py-1 px-2 rounded-[6px] mb-3 -ml-2 no-underline hover:bg-muted hover:text-foreground [&_svg]:w-3.5 [&_svg]:h-3.5"
    >
      <ChevronLeftIcon />
      {children}
    </Link>
  );
}
