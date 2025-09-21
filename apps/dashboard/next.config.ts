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
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        assert: false,
        constants: false,
        timers: false,
        console: false,
        vm: false,
        zlib: false,
        tty: false,
        domain: false,
        events: false,
        punycode: false,
        child_process: false,
      };

      // Additional webpack configurations for heavy bundle demos
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

    // AC 5: Configure bundling to prevent optimization (deliberate performance degradation)
    if (process.env.NODE_ENV === 'production' || process.env.HEAVY_BUNDLE === 'true') {
      // Disable tree shaking to include all imported code
      config.optimization = {
        ...config.optimization,
        usedExports: false,
        providedExports: false,
        sideEffects: false, // Mark all modules as having side effects to prevent tree shaking
        // Disable minification for larger bundle sizes
        minimize: false,
        // Disable module concatenation to prevent optimization
        concatenateModules: false,
      };

      // Force inclusion of all dependencies
      config.resolve.alias = {
        ...config.resolve.alias,
        // Prevent webpack from optimizing these heavy libraries
        'lodash$': 'lodash/lodash.js',
        'moment$': 'moment/moment.js',
        'd3$': 'd3/dist/d3.js',
        'ramda$': 'ramda/dist/ramda.js',
      };

      // Disable code splitting for maximum bundle bloat
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Force everything into main bundle
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: false,
            enforce: true,
            name: 'main-bloated-bundle'
          },
          // Include all vendor libraries in main bundle
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors-bloated-bundle',
            priority: -10,
            reuseExistingChunk: false,
            enforce: true,
          },
        },
      };

      // Add plugin to prevent optimization
      config.plugins.push(
        new (require('webpack').DefinePlugin)({
          'process.env.DISABLE_TREE_SHAKING': JSON.stringify('true'),
          'process.env.HEAVY_BUNDLE_MODE': JSON.stringify('true'),
        })
      );
    }

    return config;
  },
  transpilePackages: ["@repo/ui", "@repo/performance-lib"],
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
