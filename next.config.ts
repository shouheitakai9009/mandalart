import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip API route evaluation during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
