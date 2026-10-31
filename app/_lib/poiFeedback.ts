/**
 * Place feedback (app repo migration 0342): the lists the website shows, for /places/suggest and
 * /admin/poi/feedback.
 *
 * The source of truth is the APP repo's supabase/functions/_shared/poiFeedback.ts, which its tests
 * pin to the SQL CHECK lists. These keys must match it exactly: submit_poi_feedback refuses any
 * other value as `invalid`, so a drift here shows up as a refused form, never as bad data.
 *
 * A plain module (no 'use client'): safe to import from a server page too.
 */

export type FeedbackKind = 'wrong_name' | 'not_here' | 'new_place';

export const KIND_LABEL: Record<FeedbackKind, string> = {
  wrong_name: 'The name is wrong',
  not_here: "This place isn't here",
  new_place: 'A place is missing',
};

export const SUGGESTED_TYPES = [
  ['train_station', 'Train station'],
  ['metro_station', 'Metro station'],
  ['bus_terminus', 'Bus terminus'],
  ['hospital', 'Hospital'],
  ['mall', 'Mall'],
  ['stadium', 'Stadium'],
  ['museum', 'Museum'],
  ['park', 'Park'],
  ['police_station', 'Police station'],
  ['place_of_worship', 'Place of worship'],
  ['landmark', 'Landmark'],
  ['residential_complex', 'Housing complex'],
  ['locality', 'Neighbourhood'],
] as const;
export type SuggestedType = (typeof SUGGESTED_TYPES)[number][0];
export const TYPE_LABEL = Object.fromEntries(SUGGESTED_TYPES) as Record<SuggestedType, string>;

export const NOT_HERE_REASONS = [
  ['closed', 'It closed or moved away'],
  ['elsewhere', "It's somewhere else"],
  ['offensive', 'The name is offensive'],
  ['other', 'Something else'],
] as const;
export type NotHereReason = (typeof NOT_HERE_REASONS)[number][0];
export const REASON_LABEL = Object.fromEntries(NOT_HERE_REASONS) as Record<NotHereReason, string>;

/** Why an admin rejected a report. The first four are "harmful": the AI must never accept them. */
export const REJECT_REASONS = [
  ['wrong', 'Wrong'],
  ['not_a_place', 'Not a place'],
  ['offensive', 'Offensive'],
  ['private', "Someone's home / private"],
  ['sensitive', 'Sensitive place'],
  ['advertising', 'Advertising'],
  ['duplicate', 'Duplicate'],
  ['other', 'Other'],
] as const;
export type RejectReason = (typeof REJECT_REASONS)[number][0];

export const LIMITS = { shownNameMax: 120, suggestedNameMax: 80, noteMax: 500 } as const;

/** submit_poi_feedback's refusals, as a person should read them. */
export const SUBMIT_ERROR: Record<string, string> = {
  rate_limited: "You've sent a lot of suggestions today. Please try again tomorrow.",
  not_allowed: "Place suggestions aren't available for this account.",
  disabled: 'Place suggestions are paused right now. Please try again later.',
  busy: 'Place suggestions are paused right now. Please try again later.',
  not_authenticated: 'Please sign in again.',
  invalid: 'Please check the details and try again.',
};

/** Why the daily batch sent a report to a person — the console's one-line explanations. */
export const PARK_REASON: Record<string, string> = {
  global_area: 'Outside the curated areas or a global POI — the batch cannot change it',
  unresolved: 'A website report that matched no place by name — find the POI',
  ai_off: 'The AI is switched off',
  ai_unsure: "The AI's answer could not be read, or it was unsure",
  ai_unavailable: 'The AI was unavailable for 3 days',
  ai_reject: 'The AI rejected it',
  ai_accept: 'The AI accepted it',
  low_confidence: 'The AI was not confident enough',
  needs_person: 'Possibly sensitive, private or an advert',
  no_name: 'No usable name',
  hide_is_manual: 'Hiding a place always needs an admin',
  new_reporter: 'New account, or one with rejected reports',
  no_evidence: 'No OpenStreetMap / Wikidata entry within 150 m carries the name',
  evidence_has_shown_name: 'A map within 150 m still uses the name shown today',
  tier: 'Localities and pincodes (tier 3–4) are changed by an admin only',
  type_manual: 'This kind of place is added by an admin only',
  type_disagrees: 'The AI read it as a different kind of place',
  evidence_type: 'No map entry of that kind carries the name',
  crowded: 'Another place of the same tier within 50 m — maybe the same place',
  not_shown_here: 'Another place would still be shown at this point',
  drifted: 'An applied change was undone by a curation batch or a console edit',
};

/** The reason with its prefix (gate:, apply:, rule:) explained. */
export function explainPark(reason: string | null): string | null {
  if (!reason) return null;
  if (reason.startsWith('gate:')) {
    const g = reason.slice(5);
    const gates: Record<string, string> = {
      auto_apply_off: 'Would have been applied — automatic apply is off',
      not_auto: 'Not proposed for automatic apply',
      action_not_auto: 'Only renames and additions can be automatic',
      type_not_auto: 'This kind of place is added by an admin only',
      breaker: 'Automatic apply paused: 3+ AI changes reverted in 14 days',
      daily_cap: 'Daily cap of automatic changes reached',
      cell_cap: 'Two automatic changes in this area today already',
      recently_edited: 'This place was changed in the last 30 days',
      invalid: 'The proposed change was incomplete',
    };
    return gates[g] ?? g;
  }
  if (reason.startsWith('apply:')) return `Could not apply: ${reason.slice(6)}`;
  if (reason.startsWith('rule:')) return `Refused by rule: ${reason.slice(5).replace(/_/g, ' ')}`;
  return PARK_REASON[reason] ?? reason;
}

/** Global POIs live above 2^52; poi_directory ids below. */
export const GLOBAL_ID_BASE = 2 ** 52;
