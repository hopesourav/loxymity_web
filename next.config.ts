import type { NextConfig } from 'next';

// NOTE: Security headers for the /share page are configured in vercel.json
// (applied at CDN layer). The headers() API is not supported with output:'export'.

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
