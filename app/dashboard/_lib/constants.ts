// HISTORY_RETENTION_DAYS was removed: it was a flat 7 for every user, which
// hard-blocked Gold/Platinum/Infinite subscribers from history they had paid
// for. Retention is tier-driven now — see historyRetentionDays() in
// app/_lib/tiers.ts, which mirrors the server window in migration 0088.

// Flip to true once Stripe India registration is approved and env vars are set.
// No rebuild of other dashboard features needed — only the upgrade page reads this.
export const STRIPE_LIVE = false;

// No web payment rail is deployed (razorpay-checkout / stripe-checkout are not live), so the
// dashboard plan page points people to the app instead of a checkout that can only fail.
export const WEB_CHECKOUT_LIVE = false;

// PRO_PRICE_DISPLAY was removed. It hardcoded '₹399 / month' for the single
// legacy "Pro Dashboard" SKU that the upgrade page no longer sells. Prices now
// come from app/_lib/pricing.ts, shared with the marketing pricing grid.

// Seconds after which a member's location is considered stale (amber dot).
export const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 min

// Seconds after which a member is considered offline (grey ring).
export const OFFLINE_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

// Razorpay checkout script URL.
export const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

// Map tile URL + attribution live in app/_lib/mapTiles.ts (shared with the admin console
// and the share page). CARTO's keyless basemaps stopped serving real tiles on 2026-10-17.
