type IconProps = { size?: number; className?: string };

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
});

export function IconDashboard({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="8" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="11" width="8" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="15" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconList({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="3.5" cy="6" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconChart({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 20h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 13.5a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.56V19.9a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.33-1.87 1.7 1.7 0 00-1.55-1H4.1a2 2 0 110-4h.1a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.33-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.33h.09a1.7 1.7 0 001-1.55V4.1a2 2 0 114 0v.1a1.7 1.7 0 001 1.56 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v.09a1.7 1.7 0 001.56 1h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.56 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPlus({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrash({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-.7 12.1a2 2 0 01-2 1.9H8.7a2 2 0 01-2-1.9L6 7h12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEdit({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconShare({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconDownload({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M12 3v13m0 0l-4.5-4.5M12 16l4.5-4.5M4 20h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClose({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconWallet({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M16 12h3v3h-3a1.5 1.5 0 010-3z" fill="currentColor" />
    </svg>
  );
}

export function IconTrendingUp({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCalendar({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconEmpty({ size, className }: IconProps) {
  return (
    <svg {...base(size ?? 40)} className={className}>
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Add this export to your existing src/components/Icons.tsx, matching the
 * same { size, className } signature as IconDashboard/IconList/etc.
 */
export function IconPeople({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 5.5a3 3 0 0 1 0 5.8M17.5 19c0-2.4-1.6-4.3-3.8-4.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}