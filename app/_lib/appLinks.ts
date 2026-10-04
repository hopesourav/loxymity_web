/**
 * Where people get the app. ONE place, read from env at build time, so a page can never again
 * ship a stale package id (the /refer page linked com.sawsibinfotech.loxymity after the bundle
 * rename) or a placeholder App Store id.
 *
 *   NEXT_PUBLIC_PLAY_URL       e.g. https://play.google.com/store/apps/details?id=com.amsekresearch.loxymity
 *   NEXT_PUBLIC_APP_STORE_URL  e.g. https://apps.apple.com/app/loxymity/id<real id>
 *   NEXT_PUBLIC_DOWNLOAD_URL   any other channel while unlisted (APK page, TestFlight invite)
 *
 * Unset = that button is hidden. Until a store listing exists, the pages say "ask the person who
 * invited you for the app" instead of linking to a store page that does not exist.
 */
export const PLAY_URL: string | null = process.env.NEXT_PUBLIC_PLAY_URL || null;
export const APP_STORE_URL: string | null = process.env.NEXT_PUBLIC_APP_STORE_URL || null;
export const DOWNLOAD_URL: string | null = process.env.NEXT_PUBLIC_DOWNLOAD_URL || null;

/** Play hands `referrer` back to the app on first launch (Android deferred deep link). */
export function playUrlWithReferrer(kind: 'invite' | 'referral', code: string): string | null {
  if (!PLAY_URL) return null;
  const sep = PLAY_URL.includes('?') ? '&' : '?';
  return `${PLAY_URL}${sep}referrer=${encodeURIComponent(`${kind}=${code}`)}`;
}
