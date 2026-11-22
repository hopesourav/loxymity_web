/**
 * What an emailed or OAuth link brought in the URL: `#access_token=…&type=recovery`, or
 * `#error=…&error_code=…&error_description=…` (an expired or used link, a cancelled sign-in).
 *
 * Call it at a page MODULE's top level, so it reads the URL the page was opened with: the Supabase
 * client clears a used token hash, and fires PASSWORD_RECOVERY / SIGNED_IN only once — a listener
 * that subscribes after that never hears it. An error hash is never cleared and fires nothing, so
 * without reading it the page just waited (the callback spun forever). A function, not a module
 * constant: a constant would keep the URL of whichever page imported it first.
 */
export type AuthLink = {
  recovery: boolean;
  /**
   * The account the recovery token is for (its JWT `sub`). A session is taken as this link's only
   * when it is that account's: a token the client could not use leaves an earlier session in
   * place, and that must never get the new-password form.
   */
  recoveryUserId: string | null;
  errorCode: string | null;
  errorDescription: string | null;
};

export const NO_AUTH_LINK: AuthLink = { recovery: false, recoveryUserId: null, errorCode: null, errorDescription: null };
const NONE = NO_AUTH_LINK;

/** The `sub` of a JWT, read without verifying it (only compared with the session's own user). */
function jwtSub(token: string | null): string | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1] ?? '';
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((part.length + 3) % 4);
    const sub = (JSON.parse(atob(b64)) as { sub?: unknown }).sub;
    return typeof sub === 'string' ? sub : null;
  } catch {
    return null;
  }
}

export function readAuthLink(): AuthLink {
  if (typeof window === 'undefined') return NONE; // the static export's build
  try {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const query = new URLSearchParams(window.location.search);
    const get = (k: string) => hash.get(k) ?? query.get(k);
    const error = get('error');
    const code = get('error_code');
    const description = get('error_description');
    const failed = !!(error || code || description);
    const recovery = hash.get('type') === 'recovery';
    return {
      recovery,
      recoveryUserId: recovery ? jwtSub(hash.get('access_token')) : null,
      errorCode: failed ? (code || error || 'unknown') : null,
      errorDescription: description,
    };
  } catch {
    return NONE;
  }
}

/** The link's error in words; React text only (the description comes from the URL). */
export function authLinkErrorMessage(link: AuthLink, context: 'reset' | 'signin'): string {
  if (link.errorCode === 'otp_expired') return 'This link has expired. Request a new one.';
  const detail = link.errorDescription ? ` (${link.errorDescription.slice(0, 200)})` : '';
  return context === 'reset'
    ? `This link could not be used${detail}. Request a new one.`
    : `Sign-in did not complete${detail}. Please try again.`;
}
