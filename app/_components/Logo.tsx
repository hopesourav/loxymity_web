import Image from 'next/image';

/*
 * The brand (2026-10-25): the wordmark "Loxymity." and the app icon "Loxy.", in the
 * same lettering as the app's icon, splash screen and store listing — Instrument
 * Serif (next/font, --font-instrument), ivory, with the logo's indigo dot.
 *
 * Weight is pinned to 400 because the face has no bold, and callers still pass
 * `font-bold` from the old Times New Roman `Lo{xy}mity` logo. The inner span is
 * scaled up a little because this serif is narrower than Times at the same size,
 * so existing `text-2xl` / `text-4xl` call sites keep their visual weight.
 */
const IVORY = '#F4EFE6';
const DOT = '#7C88FF'; // = tailwind `primary`
const FONT: React.CSSProperties = {
  fontFamily: 'var(--font-instrument), Georgia, "Times New Roman", serif',
  fontWeight: 400,
  letterSpacing: '-0.01em',
};

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <span className={`select-none whitespace-nowrap ${className}`} aria-label="Loxymity">
      <span aria-hidden="true" style={{ ...FONT, color: IVORY, fontSize: '1.4em', lineHeight: 1 }}>
        Loxymity<span style={{ color: DOT }}>.</span>
      </span>
    </span>
  );
}

/** The app icon itself, so the dashboard shows the same mark as the phone. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/icon-192.png"
      alt=""
      width={44}
      height={44}
      className={`w-11 h-11 rounded-xl shrink-0 ${className}`}
    />
  );
}
