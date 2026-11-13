// HISTORY_RETENTION_DAYS was removed: it was a flat 7 for every user, which
// hard-blocked Gold/Platinum/Infinite subscribers from history they had paid
// for. Retention is tier-driven now — see historyRetentionDays() in
// app/_lib/tiers.ts, which mirrors the server window in migration 0088.

// STRIPE_LIVE / WEB_CHECKOUT_LIVE were removed: the web checkout is Razorpay invoices behind the
// server's system_flags.web_checkout_enabled (see _lib/webBilling.ts), not a build-time switch.

// PRO_PRICE_DISPLAY was removed. It hardcoded '₹399 / month' for the single
// legacy "Pro Dashboard" SKU that the upgrade page no longer sells. Prices now
// come from app/_lib/pricing.ts, shared with the marketing pricing grid.

// Seconds after which a member's location is considered stale (amber dot).
export const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 min

// Seconds after which a member is considered offline (grey ring).
export const OFFLINE_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

// Map tile URL + attribution live in app/_lib/mapTiles.ts (shared with the admin console
// and the share page). CARTO's keyless basemaps stopped serving real tiles on 2026-10-17.
