import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment
  output: 'standalone',
  
  // Enable static optimization
  trailingSlash: false,
  
  // Webpack configuration for Cardano libraries
  webpack: (config, { isServer }) => {
    // Handle node modules that may have issues in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'preprod',
  },
  
  // Production optimizations
  swcMinify: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
