import type { Metadata } from 'next';
import { APP_STORE_URL, PLAY_URL } from './appLinks';
import { BUSINESS_EMAIL } from './business';

/**
 * Search and AI-answer metadata, in ONE place (SEO/AEO pass, 2026-11-23).
 *
 * Why it matters: search engines and AI assistants (ChatGPT search, Gemini / Google AI Mode,
 * Perplexity, Claude, Copilot) describe Loxymity from what they can read here. So every page states
 * the same facts about the same entity:
 *  - `ORG_NODE`  — who makes Loxymity. `name` is the BRAND (what people search for); the LLP is the
 *    `legalName`. Its `sameAs` lists our own profiles, so an engine can tie them to this site.
 *  - `APP_NODE`  — the app itself; `sameAs` are the two store listings.
 *  - `pageMeta()` — canonical URL + a social preview with THIS page's title. Next.js replaces the
 *    root layout's `openGraph` object instead of merging it, so a page that set only a title used to
 *    share as the home page.
 *
 * Claims rules are the landing page's (app/page.tsx header): only what a shipped build does today,
 * nothing about other apps, "Never sold. No ads." — never "never used to train AI".
 */

export const SITE_URL = 'https://loxymity.com';

/** Our own public profiles. Shown in the footer and listed as the organisation's `sameAs`. */
export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@Loxymity',
  instagram: 'https://www.instagram.com/loxymity/',
  facebook: 'https://www.facebook.com/loxymity',
} as const;

export const SUPPORT_EMAIL = 'support@loxymity.com';

/** One sentence that says what Loxymity is. Reused wherever a page needs the short description. */
export const ONE_LINE =
  'Loxymity is a private, real-time location-sharing app for families and close friends, on iPhone and Android.';

export const ORG_ID = `${SITE_URL}/#org`;
export const APP_ID = `${SITE_URL}/#app`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NODE = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Loxymity',
  legalName: 'AMSEK RESEARCH LABS LLP',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
  description: `${ONE_LINE} Free to start. Your location is never sold, and there are no ads.`,
  email: SUPPORT_EMAIL,
  address: { '@type': 'PostalAddress', addressRegion: 'West Bengal', addressCountry: 'IN' },
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer support', email: SUPPORT_EMAIL, availableLanguage: ['English'] },
    { '@type': 'ContactPoint', contactType: 'sales', email: BUSINESS_EMAIL, availableLanguage: ['English'] },
  ],
  sameAs: [SOCIAL_LINKS.youtube, SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
};

export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: 'Loxymity',
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
};

/** What a shipped build does today (same list as the landing page's feature tiles). */
const FEATURES = [
  'Live, private family map',
  'Arrival and leave alerts for saved places',
  'SOS alert to the whole circle',
  'Crash check with an "Are you OK?" countdown',
  'Location and SOS relayed by nearby phones when there is no signal',
  'Driving reports with time in traffic kept apart',
  'Circle chat, messages and calls',
  'Ask where someone is in WhatsApp',
  'Trip sharing and share links for people without the app',
  'Day timeline and replay',
];

export const APP_NODE = {
  '@type': 'MobileApplication',
  '@id': APP_ID,
  name: 'Loxymity',
  alternateName: 'Loxymity: Family & Friends Map',
  url: SITE_URL,
  operatingSystem: 'iOS 17 or later, Android 7.0 or later',
  applicationCategory: 'LifestyleApplication',
  description: 'Private, real-time location sharing for families and close friends.',
  featureList: FEATURES,
  inLanguage: 'en',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free to download and free to start' },
  publisher: { '@id': ORG_ID },
  sameAs: [APP_STORE_URL, PLAY_URL].filter(Boolean),
};

/** schema.org BreadcrumbList for a page one level below the home page. */
export function breadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

/** schema.org FAQPage from question/answer pairs (answers as plain text). */
export function faqPage(items: { q: string; text: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, text }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

/**
 * Metadata for a page other than the home page: title, description, canonical URL and a social
 * preview of its own. `path` starts and ends with a slash (the site uses trailing slashes).
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: 'Loxymity',
      type: 'website',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Loxymity. Your people, close — wherever they are.' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}
