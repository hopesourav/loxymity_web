/**
 * Which SOS alerts the dashboard's red banner shows — the app's rule (src/lib/sosForeground.ts
 * `sosBarAlerts`, SOS_ACTIVE_WINDOW_MS in src/backend/sos.ts): someone ELSE's alert, not resolved,
 * not dismissed as a false alarm, raised within the last 24 h (a clock up to 60 s ahead is
 * tolerated), newest first. An alert nobody resolved stops being "active" after 24 h.
 */
import type { SosAlert } from './types';

export const SOS_ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000;
const FUTURE_SKEW_MS = 60_000;

export function isActiveSos(a: SosAlert, myUid: string, now: number = Date.now()): boolean {
  if (!a.id || a.sender_id === myUid || a.resolved || a.dismissed_at) return false;
  const at = Date.parse(a.created_at);
  return Number.isFinite(at) && now - at >= -FUTURE_SKEW_MS && now - at < SOS_ACTIVE_WINDOW_MS;
}

export function activeSos(alerts: readonly SosAlert[], myUid: string, now: number = Date.now()): SosAlert[] {
  return alerts
    .filter((a) => isActiveSos(a, myUid, now))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}
