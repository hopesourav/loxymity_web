// Update this when the backend extends retention (migration driven).
export const HISTORY_RETENTION_DAYS = 7;

// Flip to true once Stripe India registration is approved and env vars are set.
// No rebuild of other dashboard features needed — only the upgrade page reads this.
export const STRIPE_LIVE = false;

// Update to match the Razorpay plan price set in the Razorpay dashboard.
export const PRO_PRICE_DISPLAY = '₹399 / month';

// Seconds after which a member's location is considered stale (amber dot).
export const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 min

// Seconds after which a member is considered offline (grey ring).
export const OFFLINE_THRESHOLD_MS = 30 * 60 * 1000; // 30 min

// Razorpay checkout script URL.
export const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

// Carto Dark Matter tile URL (free, attribution required, no API key).
export const CARTO_DARK_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// OpenStreetMap tile URL (used for light map toggle — Day 2).
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
