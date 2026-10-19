/** The "For businesses" inbox — a Cloudflare Email Routing forward (receive-only: replies go from the
 *  team's own mailbox). A plain module on purpose: the server-rendered /business/ page and the
 *  client form both need it, and a server component cannot read a value exported from a
 *  'use client' file (it gets a client-reference proxy, which rendered as a broken mailto link). */
export const BUSINESS_EMAIL = 'business@loxymity.com';
