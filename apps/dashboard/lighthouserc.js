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
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
  },
};
