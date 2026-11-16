import { APP_STORE_URL, PLAY_URL } from '../_lib/appLinks';

/**
 * The two store badges — the OFFICIAL artwork, served from loxymity.com (no request to Apple or
 * Google from a visitor's browser):
 *   public/badge-app-store.svg   Apple, "Download on the App Store", black, US-UK (developer.apple.com)
 *   public/badge-google-play.png Google, "Get it on Google Play", generic English (play.google.com)
 * Both stores' marketing guidelines require their badge artwork, unmodified, rather than a home-made
 * button with their logo — the old buttons drew the Apple and Play logos themselves.
 *
 * Google's PNG carries its own clear space (≈ 40 of 250 px on each side), so it is drawn larger and
 * pulled in with a negative margin until its visible badge is the same height as Apple's.
 *
 * A store whose URL is switched off (`_lib/appLinks.ts`) shows a quiet "Coming soon" chip instead of
 * a dead link.
 */
export function StoreButtons({ className = '', align = 'center', playHref }: {
  className?: string;
  align?: 'center' | 'start';
  /** A Play URL carrying `referrer=` (invite / referral pages); defaults to the plain listing. */
  playHref?: string | null;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 ${align === 'start' ? 'justify-center lg:justify-start' : 'justify-center'} ${className}`}
    >
      <AppStoreBadge />
      <GooglePlayBadge href={playHref ?? PLAY_URL} />
    </div>
  );
}

function AppStoreBadge() {
  if (!APP_STORE_URL) return <Soon label="App Store" />;
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-[10px] transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/badge-app-store.svg" alt="Download on the App Store" width={144} height={48} className="h-12 w-auto" />
    </a>
  );
}

function GooglePlayBadge({ href }: { href: string | null }) {
  if (!href) return <Soon label="Google Play" />;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-[10px] transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/badge-google-play.png"
        alt="Get it on Google Play"
        width={183}
        height={71}
        className="h-[71px] w-auto -my-[11.5px] -mx-[11.5px] max-w-none"
      />
    </a>
  );
}

function Soon({ label }: { label: string }) {
  return (
    <span
      className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-dark-border bg-dark-surface px-5 text-sm font-semibold text-dark-muted"
      aria-label={`${label} — coming soon`}
    >
      {label}
      <span className="tag-soon">Soon</span>
    </span>
  );
}
