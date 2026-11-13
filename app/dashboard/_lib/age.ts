/**
 * The neutral age question, as the app asks it (app repo src/lib/minorPolicy.ts + ageLatch.ts —
 * copied, this site cannot import across repos; keep them identical).
 *
 * Month and year only, nothing preset, and the date itself is never stored: only adult/minor
 * leaves this file. The birthday is taken as the END of the birth month, so a child stays in the
 * more protected band for up to a month longer, never shorter. An under-18 answer is remembered
 * on this browser for 24 hours so the form cannot simply be re-answered.
 */
export type ConsentBand = 'adult' | 'minor';

const LATCH_KEY = 'loxymity.ageLatch';
export const AGE_LATCH_MS = 24 * 60 * 60 * 1000;

/** Whole years from a birth month (birthday = end of that month); null for an impossible date. */
export function ageFromBirth(year: number, month: number, now: Date = new Date()): number | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return null;
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  if (year < nowYear - 120 || year > nowYear || (year === nowYear && month > nowMonth)) return null;
  return nowYear - year - (nowMonth <= month ? 1 : 0);
}

export function consentBandFromBirth(year: number, month: number, now: Date = new Date()): ConsentBand | null {
  const age = ageFromBirth(year, month, now);
  if (age === null) return null;
  return age < 18 ? 'minor' : 'adult';
}

export function latchMinor(now = Date.now()): void {
  try { localStorage.setItem(LATCH_KEY, JSON.stringify({ at: now })); } catch { /* blocked storage */ }
}

export function minorLatched(now = Date.now()): boolean {
  try {
    const v = JSON.parse(localStorage.getItem(LATCH_KEY) ?? 'null');
    return typeof v?.at === 'number' && v.at <= now && now - v.at < AGE_LATCH_MS;
  } catch {
    return false;
  }
}
