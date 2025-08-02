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
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],

        "first-contentful-paint": ["warn", { maxScore: 1.8 }],
        "speed-index": ["warn", { minScore: 1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "largest-contentful-paint": ["warn", { maxScore: 2 }],
        "cumulative-layout-shift": ["warn", { maxScore: 0.1 }],
      },
    },
  },
};
