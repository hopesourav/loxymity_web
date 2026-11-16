import type { MetadataRoute } from 'next';

// Static export: written to out/sitemap.xml at build time. Public pages only.
export const dynamic = 'force-static';

const BASE = 'https://loxymity.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/business/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/delete-account/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/places/suggest/`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
