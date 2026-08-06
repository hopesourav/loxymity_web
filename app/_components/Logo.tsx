const GOLD = '#C9A227';
const WHITE = '#F5F3EE';
const FONT: React.CSSProperties = { fontFamily: '"Times New Roman", Times, serif' };

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <span className={`select-none ${className}`} style={{ ...FONT, color: WHITE }}>
      Lo
      <span style={{ color: GOLD }}>{'{'}</span>
      xy
      <span style={{ color: GOLD }}>{'}'}</span>
      mity
    </span>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-dark-bg border border-dark-border shrink-0 ${className}`}
      style={FONT}
    >
      <span className="text-lg font-bold leading-none" style={{ color: WHITE }}>
        L<span style={{ color: GOLD }}>x</span>
      </span>
    </span>
  );
}
