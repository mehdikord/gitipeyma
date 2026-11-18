import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // An article is saved with its body in three languages; the 1 MB default is too tight for a long one.
    // Pictures are uploaded separately (app/admins/upload), so they never count towards this.
    serverActions: { bodySizeLimit: '4mb' },
  },
};

export default nextConfig;
