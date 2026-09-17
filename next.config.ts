import type { NextConfig } from "next";

// API backend: nama service container (via API_PROXY_TARGET) atau fallback localhost untuk dev host.
const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8090/qooz/api';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: `${API_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;
