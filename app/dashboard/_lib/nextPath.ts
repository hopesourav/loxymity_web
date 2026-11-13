/**
 * Where to go after signing in. Only a path inside the dashboard is ever accepted — never another
 * origin, a protocol-relative '//host' or a backslash trick — so a crafted link cannot turn the
 * login page into an open redirect.
 *
 * Kept in sessionStorage across the Google round trip: the OAuth redirect URL itself must stay
 * exactly the allow-listed one, so it cannot carry a ?next=.
 */
const KEY = 'loxymity.next';
const SAFE = /^\/dashboard\/[a-z0-9/_-]*$/;

export function safeNext(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const path = raw.split('?')[0].split('#')[0];
  return SAFE.test(path) && !path.includes('//') ? path : null;
}

/** Read ?next= from the current URL and remember it for after an OAuth round trip. */
export function captureNext(): string | null {
  const next = safeNext(new URLSearchParams(window.location.search).get('next'));
  try {
    if (next) sessionStorage.setItem(KEY, next);
  } catch { /* storage blocked: the default target still works */ }
  return next;
}

/** The remembered target (once), or the dashboard. */
export function takeNext(fallback = '/dashboard/'): string {
  try {
    const stored = safeNext(sessionStorage.getItem(KEY));
    sessionStorage.removeItem(KEY);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}
