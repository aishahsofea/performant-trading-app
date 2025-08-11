/**
 * Environment Configuration for Chrome DevTools Automation
 *
 * This file defines all the consistent settings needed for reliable performance testing.
 * These settings ensure that every test run has the same conditions, making results comparable.
 *
 * Chrome command line flags reference: https://peter.sh/experiments/chromium-command-line-switches/
 */

import type { LaunchOptions as BrowserLaunchOptions } from "playwright";

export type ViewportSize = {
  width: number;
  height: number;
};

export type DevToolsConfig = {
  browser: BrowserLaunchOptions;
  viewport: ViewportSize;
  throttling: ThrottlingConfig;
  timeout: TimeoutConfig;
  debug: boolean;
  logLevel: "silent" | "error" | "warn" | "info" | "verbose";
};

export type ThrottlingConfig = {
  network: NetworkThrottling;
  cpu: number; // CPU throttling multiplier (4 = 4x slower)
  cache: boolean; // Whether to enable browser cache
};

export type TimeoutConfig = {
  navigation: number; // Max time to wait for page navigation
  interaction: number; // Max time to wait for user interactions
  profiling: number; // Max time for profiling sessions
};

// Network throttling presets based on real-world conditions
export type NetworkThrottling = "Fast3G" | "Slow3G" | "Fast4G" | "NoThrottling";

const NETWORK_PRESETS = {
  Fast3G: {
    downloadThroughput: 1600 * 1024, // 1.6 Mbps
    uploadThroughput: 750 * 1024, // 750 Kbps
    latency: 150, // 150ms RTT
  },
  Slow3G: {
    downloadThroughput: 500 * 1024, // 500 Kbps
    uploadThroughput: 500 * 1024, // 500 Kbps
    latency: 400, // 400ms RTT
  },
  Fast4G: {
    downloadThroughput: 4000 * 1024, // 4 Mbps
    uploadThroughput: 3000 * 1024, // 3 Mbps
    latency: 20, // 20ms RTT
  },
  NoThrottling: {
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
};

/**
 * Default configuration for DevTools automation
 *
 * These settings are optimized for:
 * - Consistent performance measurement
 * - Realistic device simulation
 * - Reliable automation execution
 * - CI/CD environment compatibility
 */
export const DEFAULT_DEVTOOLS_CONFIG: DevToolsConfig = {
  browser: {
    headless: true, // Run without GUI for CI/CD
    args: [
      // Security and stability
      "--no-sandbox", // Disables the sandbox for all process types
      "--disable-dev-shm-usage", // Disables usage of /dev/shm temporary file system

      // Performance consistency
      "--disable-background-timer-throttling", // Disable throttling of background pages
      "--disable-backgrounding-occluded-windows", // Disable backgrounding of occluded windows
      "--disable-renderer-backgrounding", // Prevent renderer process backgrounding
      "--disable-features=TranslateUI", // Disable translate UI popup
      "--disable-blink-features=AutomationControlled", // Hide webdriver automation detection

      // Memory and resource management
      "--max_old_space_size=4096", // Set V8 memory limit (Node.js flag) TODO: double check if supported
      "--disable-extensions", // Disable installed browser extensions TODO: double check if supported
      "--disable-plugins", // Disable browser plugins TODO: double check if supported

      // Network and caching
      "--aggressive-cache-discard", // Enable aggressive discarding for memory management
      "--no-first-run", // Skip first run tasks and profile import
      "--no-default-browser-check", // Skip default browser check
    ],
  },

  viewport: {
    width: 1920, // Desktop viewport width
    height: 1080, // Desktop viewport height
  },

  throttling: {
    network: "Fast3G", // Simulate realistic mobile network
    cpu: 4, // 4x CPU throttling (simulate slower device)
    cache: false, // Disable cache for consistent results
  },

  timeout: {
    navigation: 30000, // 30 seconds for page loads
    interaction: 10000, // 10 seconds for user interactions
    profiling: 60000, // 1 minute max for profiling sessions
  },

  debug: false, // Disable debug logging by default
  logLevel: "error", // Only show errors by default
};

/**
 * Get network throttling settings for Playwright CDPSession
 *
 * @param preset - Network throttling preset name
 * @returns Network throttling configuration for CDP
 */
export const getNetworkThrottling = (preset: NetworkThrottling) => {
  const config = NETWORK_PRESETS[preset];

  if (!config) {
    throw new Error(`Unknown network throttling preset: ${preset}`);
  }

  return config;
};

/**
 * Create a custom DevTools configuration by merging with defaults
 *
 * @param customConfig - Partial configuration to override defaults
 * @returns Complete DevTools configuration
 */
export const createDevToolsConfig = (
  customConfig: Partial<DevToolsConfig> = {}
): DevToolsConfig => {
  return {
    ...DEFAULT_DEVTOOLS_CONFIG,
    ...customConfig,
    browser: {
      ...DEFAULT_DEVTOOLS_CONFIG.browser,
      ...customConfig.browser,
    },
    viewport: {
      ...DEFAULT_DEVTOOLS_CONFIG.viewport,
      ...customConfig.viewport,
    },
    throttling: {
      ...DEFAULT_DEVTOOLS_CONFIG.throttling,
      ...customConfig.throttling,
    },
    timeout: {
      ...DEFAULT_DEVTOOLS_CONFIG.timeout,
      ...customConfig.timeout,
    },
  };
};

/**
 * Configuration for CI/CD environments
 * Optimized for headless execution and resource constraints
 */
export const CI_DEVTOOLS_CONFIG: DevToolsConfig = createDevToolsConfig({
  browser: {
    headless: true,
    args: [
      ...DEFAULT_DEVTOOLS_CONFIG.browser.args!,
      "--disable-gpu", // Disable GPU hardware acceleration
      "--disable-software-rasterizer", // Disable software-based rasterization
      "--memory-pressure-off", // Disable memory pressure simulation
    ],
  },
  timeout: {
    navigation: 45000, // Longer timeouts for slower CI machines
    interaction: 15000,
    profiling: 90000,
  },
  logLevel: "warn", // More verbose logging in CI
});

/**
 * Configuration for local development
 * Includes visual feedback and debugging features
 */
export const DEV_DEVTOOLS_CONFIG: DevToolsConfig = createDevToolsConfig({
  browser: {
    headless: false, // Show browser GUI for debugging
    slowMo: 100, // Slow down actions for observation
  },
  debug: true, // Enable debug logging
  logLevel: "verbose", // Detailed logging for development
  throttling: {
    network: "Fast4G", // Less aggressive throttling for dev
    cpu: 2, // Less CPU throttling for dev
    cache: true, // Enable cache in development
  },
});
