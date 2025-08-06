module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      startServerCommand: "npm run build && npm start",
      numberOfRuns: 3,
      // Optional: Configure server startup detection
      startServerReadyPattern: "ready started server on",
      startServerReadyTimeout: 20000, // 20 seconds
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:recommended", // or 'lighthouse:no-pwa' or 'lighthouse:all'
      assertions: {
        // Refer https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js
        // for more details on available assertions and their configurations

        // Performance Category
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],

        // Core Web Vitals
        "first-contentful-paint": ["warn", { maxScore: 1_800 }],
        "largest-contentful-paint": ["warn", { maxScore: 2_100 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "cumulative-layout-shift": ["warn", { maxScore: 100 }],
        "speed-index": ["warn", { maxScore: 1_000 }],

        // Performance Timing
        "first-meaningful-paint": ["warn", { maxNumericValue: 2_000 }],
        interactive: ["warn", { maxNumericValue: 3_500 }],

        // Resource Assertions
        "resource-summary:script:size": ["error", { maxNumericValue: 500_000 }], // 500 KB
        "resource-summary:stylesheet:size": [
          "error",
          { maxNumericValue: 200_000 },
        ], // 200 KB
        "resource-summary:image:size": ["error", { maxNumericValue: 300_000 }], // 300 KB
        "resource-summary:total:size": [
          "error",
          { maxNumericValue: 2_000_000 },
        ], // 2 MB
      },
    },
  },
};
