// Inline SVG icons — no external icon package required.
// All icons are 24×24 viewBox, stroke-based, consistent 1.5px stroke width.

type IconProps = { className?: string; size?: number };

const base = (d: string, props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? 18}
    height={props.size ?? 18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d={d} />
  </svg>
);

export const IconMap = (p: IconProps) =>
  base('M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0L6.343 16.657a8 8 0 1 1 11.314 0z', p);

export const IconActivity = (p: IconProps) =>
  base('M22 12h-4l-3 9L9 3l-3 9H2', p);

export const IconHistory = (p: IconProps) =>
  base('M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2', p);

export const IconFence = (p: IconProps) =>
  base('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', p);

export const IconCircle = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconShare = (p: IconProps) =>
  base('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13', p);

export const IconAlert = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const IconLogout = (p: IconProps) =>
  base('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', p);

export const IconChevronDown = (p: IconProps) =>
  base('m6 9 6 6 6-6', p);

export const IconCheck = (p: IconProps) =>
  base('M20 6 9 17l-5-5', p);

export const IconX = (p: IconProps) =>
  base('M18 6 6 18M6 6l12 12', p);

export const IconPlus = (p: IconProps) =>
  base('M12 5v14M5 12h14', p);

export const IconCopy = (p: IconProps) =>
  base('M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.912 4.895 3 6 3h8c1.105 0 2 .912 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.088 19.105 22 18 22h-8c-1.105 0-2-.912-2-2.036V9.107c0-1.124.895-2.036 2-2.036z', p);

export const IconRefresh = (p: IconProps) =>
  base('M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15', p);

export const IconSearch = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconEye = (p: IconProps) =>
  base('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', p);

export const IconEyeOff = (p: IconProps) =>
  base('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22', p);

export const IconBattery = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
    <line x1="23" y1="13" x2="23" y2="11" />
  </svg>
);

export const IconTrash = (p: IconProps) =>
  base('M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', p);

export const IconEdit = (p: IconProps) =>
  base('M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', p);

export const IconUser = (p: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconPlay = (p: IconProps) =>
  base('M5 3l14 9-14 9V3z', p);

export const IconPause = (p: IconProps) =>
  base('M6 4h4v16H6zM14 4h4v16h-4z', p);

export const IconSkipForward = (p: IconProps) =>
  base('M5 4l10 8-10 8V4zM19 5v14', p);

export const IconLink = (p: IconProps) =>
  base('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', p);

export const IconMenu = (p: IconProps) =>
  base('M3 12h18M3 6h18M3 18h18', p);
