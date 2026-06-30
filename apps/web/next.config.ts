import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import path from "node:path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// pnpm symlinks resolve to node_modules/.pnpm/ at workspace root.
// Turbopack rejects files outside its root boundary — set root to workspace
// root so the virtual store stays in scope.
const workspaceRoot = path.resolve(import.meta.dirname, "../..");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  allowedDevOrigins: ["192.168.0.110"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mydoctor.com.bd" }],
        destination: "https://mydoctor.com.bd/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // {
      //   source: '/_next/static/:path*',
      //   headers: [
      //     { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      //   ],
      // },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(favicon.ico|robots.txt|sitemap.xml)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:6089/uploads/:path*",
      },
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:6089/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "*.sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "**.sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "developer.android.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "doctime.com.bd",
      },
      {
        protocol: "https",
        hostname: "admin.mydoctor.com.bd",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "6089",
      },
      {
        protocol: "http",
        hostname: "192.168.0.110",
        port: "6089",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
