import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@radix-ui/react-*",
      "recharts"
    ]
  },
  turbopack: {
    root: join(__dirname)
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
  
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ];
  },
};

export default nextConfig;