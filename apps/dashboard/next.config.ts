import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  // Enable development performance monitoring
  onDemandEntries: {
    // Development performance: Keep entries loaded longer
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Development performance monitoring
    if (dev) {
      // Enable detailed webpack stats for performance analysis
      config.stats = {
        ...config.stats,
        timings: true,
        chunks: true,
        modules: false,
        assets: true,
      };

      // Add performance monitoring in development
      config.optimization = {
        ...config.optimization,
        providedExports: true,
        usedExports: true,
      };
    }

    return config;
  },
  transpilePackages: ["@repo/design-system", "@repo/ui"],
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
