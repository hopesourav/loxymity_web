// Tier vocabulary shared by the Pro dashboard and the admin console.
//
// The pricing redesign (migrations 0078-0082) replaced the old free/pro split
// with free/gold/platinum/infinite. `profiles.subscription_tier` now stores the
// new names, while `profiles.web_tier` is still written as 'pro' by the web
// checkout — so both vocabularies are live at once and any gate has to accept
// either. Mirrors `isPaidTier` in the app repo (src/lib/entitlements.ts).

export type Tier = 'free' | 'pro' | 'gold' | 'platinum' | 'infinite';

/** True for any paid tier. Use this instead of `tier === 'pro'`: the DB returns
 *  gold/platinum/infinite for app subscribers and 'pro' only for legacy rows. */
export function isPaidTier(tier: string | null | undefined): boolean {
  return !!tier && tier !== 'free';
}

/** Dashboard access = a paid subscription on either the app or the web plan. */
export function hasProAccess(
  profile: { subscription_tier?: string | null; web_tier?: string | null } | null | undefined,
): boolean {
  if (!profile) return false;
  return isPaidTier(profile.subscription_tier) || isPaidTier(profile.web_tier);
}

/** Display label for a tier badge — capitalised, legacy 'pro' kept verbatim. */
export function tierLabel(tier: string | null | undefined): string {
  if (!isPaidTier(tier)) return 'Free';
  if (tier === 'pro') return 'Pro';
  return tier!.charAt(0).toUpperCase() + tier!.slice(1);
}

/** The higher of a profile's two tiers, for badge display. */
export function effectiveTier(
  profile: { subscription_tier?: string | null; web_tier?: string | null } | null | undefined,
): string {
  if (!profile) return 'free';
  if (isPaidTier(profile.subscription_tier)) return profile.subscription_tier!;
  if (isPaidTier(profile.web_tier)) return profile.web_tier!;
  return 'free';
}
