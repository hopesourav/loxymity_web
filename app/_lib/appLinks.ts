/**
 * Where people get the app. ONE place, so a page can never again ship a stale package id (the
 * /refer page linked com.sawsibinfotech.loxymity after the bundle rename) or a placeholder App
 * Store id.
 *
 * The defaults are the real store listings, both public since 2026-11-19 ("Loxymity: Family &
 * Friends Map"):
 *   Google Play  com.amsekresearch.loxymity (the app's PLAY_STORE_URL, src/lib/updateChecker.ts)
 *   App Store    Apple ID 6818562041 (App Store Connect; the app's APP_STORE_URL). No country in
 *                the path, so Apple sends each visitor to their own storefront; the name part is
 *                cosmetic (Apple resolves by id).
 *
 * Build-time overrides (Cloudflare Pages env):
 *   NEXT_PUBLIC_PLAY_URL       another Play URL — or `off` to hide every Google Play button
 *   NEXT_PUBLIC_APP_STORE_URL  another App Store URL — or `off` to hide every App Store button
 *   NEXT_PUBLIC_DOWNLOAD_URL   any other channel while unlisted (APK page, TestFlight invite)
 *
 * A hidden store button shows "Coming soon" on the landing page instead of a dead link.
 */
const DEFAULT_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.amsekresearch.loxymity';
/** Apple ID of the App Store listing — also Safari's Smart App Banner (`itunes` metadata). */
export const APP_STORE_ID = '6818562041';
const DEFAULT_APP_STORE_URL = `https://apps.apple.com/app/loxymity-family-friends-map/id${APP_STORE_ID}`;

function pick(env: string | undefined, fallback: string): string | null {
  const v = (env ?? '').trim();
  if (v.toLowerCase() === 'off') return null;
  return v || fallback;
}

export const PLAY_URL: string | null = pick(process.env.NEXT_PUBLIC_PLAY_URL, DEFAULT_PLAY_URL);
export const APP_STORE_URL: string | null = pick(process.env.NEXT_PUBLIC_APP_STORE_URL, DEFAULT_APP_STORE_URL);
export const DOWNLOAD_URL: string | null = process.env.NEXT_PUBLIC_DOWNLOAD_URL || null;

/** Play hands `referrer` back to the app on first launch (Android deferred deep link). */
export function playUrlWithReferrer(kind: 'invite' | 'referral', code: string): string | null {
  if (!PLAY_URL) return null;
  const sep = PLAY_URL.includes('?') ? '&' : '?';
  return `${PLAY_URL}${sep}referrer=${encodeURIComponent(`${kind}=${code}`)}`;
}
