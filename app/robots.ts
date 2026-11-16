import type { MetadataRoute } from 'next';

// Static export: written to out/robots.txt at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      // Private or per-person pages: the dashboard and admin console, invite and share links.
      disallow: ['/admin/', '/dashboard/', '/join/', '/share/'],
    }],
    sitemap: 'https://loxymity.com/sitemap.xml',
  };
}
