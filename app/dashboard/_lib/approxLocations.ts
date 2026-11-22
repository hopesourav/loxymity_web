/**
 * Port of the app's src/lib/approxLocations.ts (Loxymity migrations 0349 / 0350 / 0392).
 *
 * A member with approximate location (the app's Location blur) is NOT in latest_locations for
 * anyone else: the server keeps their exact row to themself and serves latest_locations_approx —
 * the same columns, already on the blur grid, plus `approx_m` — to the circle. The live topic sends
 * that copy as its own event, `latest_locations_approx`. The map needs ONE row per member.
 *
 * Normally a member is in exactly one of the two. Both come back during an SOS (0350: the sender's
 * circle may see the EXACT row while the SOS is active; the rounded copy is still written), and then
 * the exact row wins — the server only ever answers it to someone allowed to see it.
 */
import type { LatestLocation } from './types';

export function mergeLatestWithApprox(
  exact: readonly LatestLocation[],
  approx: readonly LatestLocation[],
): LatestLocation[] {
  const byUser = new Map<string, LatestLocation>();
  for (const row of approx) byUser.set(row.user_id, row);
  for (const row of exact) byUser.set(row.user_id, row);
  return Array.from(byUser.values());
}

/**
 * The live channel delivers ONE upload twice during an SOS (the exact row and its rounded copy, in
 * either order). The copy of an upload already seen exact is dropped, so the pin does not jump
 * between the two; once the SOS ends only copies arrive, newer, and pass. One filter per
 * subscription: a new subscription starts with a clean slate.
 */
export function makeLiveRowFilter(): (row: LatestLocation) => boolean {
  const lastExactAt = new Map<string, number>();
  return (row) => {
    const at = Date.parse(row.reported_at ?? '');
    if (row.approx_m == null) {
      if (Number.isFinite(at)) lastExactAt.set(row.user_id, Math.max(at, lastExactAt.get(row.user_id) ?? 0));
      return true;
    }
    const exactAt = lastExactAt.get(row.user_id);
    return !(exactAt !== undefined && Number.isFinite(at) && at <= exactAt);
  };
}
