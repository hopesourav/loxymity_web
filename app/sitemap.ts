import type { MetadataRoute } from 'next';

// Static export: written to out/sitemap.xml at build time. Public pages only.
export const dynamic = 'force-static';

const BASE = 'https://loxymity.com';

/**
 * `lastModified` = the day the page's CONTENT last changed (Bing and Google use it to decide what
 * to re-crawl). Set it by hand when you change a page — never to the build time, which would tell
 * every crawler that every page changed on every deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, lastModified: '2026-11-23', changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/pricing/`, lastModified: '2026-11-23', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/help/`, lastModified: '2026-11-23', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about/`, lastModified: '2026-11-23', changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/business/`, lastModified: '2026-11-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy/`, lastModified: '2026-11-19', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms/`, lastModified: '2026-11-16', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/delete-account/`, lastModified: '2026-11-16', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/places/suggest/`, lastModified: '2026-11-16', changeFrequency: 'yearly', priority: 0.3 },
  ];
}
