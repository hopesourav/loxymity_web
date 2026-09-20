/**
 * The POI tier model, mirrored from the app so the console can show what a pin
 * actually does rather than what it looks like it does.
 *
 * SOURCE OF TRUTH — two places, and they disagree on purpose:
 *
 *   matchRadius     supabase/migrations/0118_nearest_poi_tier4_repair.sql
 *                   The ST_DWithin radius nearest_poi() uses for that tier.
 *   effectiveRadius src/hooks/useStopNames.ts → labelFor()
 *                   The distance beyond which the app throws the match away.
 *
 * They are equal for tiers 1–3. For tier 4 they are NOT: nearest_poi matches a
 * pincode out to 5 km, but labelFor() returns null past 1 km. A stop 2 km from
 * a pincode centroid therefore gets a match AND no name — and because tier 4 is
 * the last rung, nothing else is consulted. That 1–5 km annulus is a genuine
 * dead zone in the naming pipeline and the map draws it as such.
 *
 * Tiers are a FALL-THROUGH, not a priority blend: tier 1 within 500 m wins
 * outright, and tiers 2–4 are only consulted when every tier above found
 * nothing. So a tier-2 circle drawn inside a tier-1 circle is decorative — the
 * tier-1 pin will always answer first.
 */

export type TierId = 1 | 2 | 3 | 4;

export type TierSpec = {
  id: TierId;
  label: string;
  /** What this tier is for, in one line, for the legend. */
  blurb: string;
  /** nearest_poi ST_DWithin radius, metres. */
  matchRadius: number;
  /** Radius within which the match actually produces a label, metres. */
  effectiveRadius: number;
  /** How labelFor() phrases a hit from this tier. */
  phrasing: string;
  color: string;
};

export const TIERS: Record<TierId, TierSpec> = {
  1: {
    id: 1,
    label: 'Landmark',
    blurb: 'Hospitals, schools, malls, stations. Checked first, always.',
    matchRadius: 500,
    effectiveRadius: 500,
    phrasing: '“At / Near {name}”',
    color: '#C9A227',
  },
  2: {
    id: 2,
    label: 'Local amenity',
    blurb: 'Bus stops, pharmacies, taxi stands. Only where no landmark is within 500 m.',
    matchRadius: 200,
    effectiveRadius: 200,
    phrasing: '“At / Near {name}”',
    color: '#5F82A5',
  },
  3: {
    id: 3,
    label: 'Locality',
    blurb: 'Named neighbourhoods. The first tier that covers area rather than a point.',
    matchRadius: 2000,
    effectiveRadius: 2000,
    phrasing: '“In {name}”',
    color: '#5C8F6B',
  },
  4: {
    id: 4,
    label: 'Pincode',
    blurb: 'India Post centroids. Last resort — matches to 5 km but only names to 1 km.',
    matchRadius: 5000,
    effectiveRadius: 1000,
    phrasing: '“In {name}” (≤ 1 km only)',
    color: '#8B5E34',
  },
};

export const TIER_IDS: TierId[] = [1, 2, 3, 4];

export function tierSpec(tier: number): TierSpec {
  return TIERS[(tier as TierId)] ?? TIERS[1];
}

/**
 * The label the app would render for a nearest_poi hit.
 * Verbatim port of labelFor() in src/hooks/useStopNames.ts — keep in step.
 * A null return means the stop shows no name at all.
 */
export function labelFor(p: { name: string; tier: number; dist_m: number }): string | null {
  if (p.tier <= 2) return `${p.dist_m < 50 ? 'At' : 'Near'} ${p.name}`;
  if (p.tier === 3) return `In ${p.name}`;
  if (p.tier === 4 && p.dist_m <= 1000) return `In ${p.name}`;
  return null;
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;
}
