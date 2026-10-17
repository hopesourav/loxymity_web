import type { NextConfig } from 'next';

// The site is a static export served by Cloudflare Pages. Response headers and the /join/<code>
// rewrite live in public/_headers and public/_redirects (the headers() and rewrites() APIs do
// not work with output: 'export').

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
