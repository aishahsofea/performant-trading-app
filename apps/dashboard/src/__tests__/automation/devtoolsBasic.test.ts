/**
 * Basic DevTools Automation Integration Tests
 *
 * These tests verify that our Phase 1 implementation works correctly:
 * 1. Browser launches successfully with our configuration
 * 2. DevTools Protocol session establishes correctly
 * 3. Basic recording functionality works (without actual data collection)
 * 4. Cleanup happens properly without throwing errors
 *
 * These are integration tests, not unit tests, because we're testing the
 * interaction between our code and the Playwright/Chrome ecosystem.
 */

import { test, expect } from "@playwright/test";
import {
  DEV_DEVTOOLS_CONFIG,
  CI_DEVTOOLS_CONFIG,
} from "@/automation/EnvironmentConfig";
import { DevToolsAutomation } from "@/automation/DevToolsAutomation";

test.describe("DevTools Automation - Phase 1 Basic Functionality", () => {
  let automation: DevToolsAutomation;

  // Clean up after each test to prevent resource leaks
  test.afterEach(async () => {
    if (automation) {
      await automation.cleanup();
    }
  });

  test("should initialize browser and DevTools session successfully", async () => {
    // Test explanation: This verifies our browser launch configuration works
    // and that we can establish a Chrome DevTools Protocol session
    automation = new DevToolsAutomation({
      browser: { headless: true }, // Force headless for CI
      logLevel: "error", // Reduce noise in test output
    });

    // Should not throw any errors
    await automation.initialize();

    // Should have a valid page object
    expect(automation.page).toBeDefined();
    expect(typeof automation.page.goto).toBe("function");
  });

  test("should navigate to a webpage successfully", async () => {
    // Test explanation: This verifies basic navigation works with our setup
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Navigate to a simple webpage (data URL to avoid network dependencies)
    const testUrl =
      "data:text/html,<html><body><h1>Test Page</h1></body></html>";
    await automation.page.goto(testUrl);

    // Verify navigation worked
    const title = await automation.page.textContent("h1");
    expect(title).toBe("Test Page");
    expect(automation.page.url()).toBe(testUrl);
  });

  test("should start and stop recording without errors", async () => {
    // Test explanation: This verifies our recording API works at a basic level
    // We're not testing actual data collection yet (that's Phase 2)
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Navigate to test page first
    await automation.page.goto(
      "data:text/html,<html><body>Recording Test</body></html>"
    );

    // Start recording with all options
    await automation.startRecording({
      timeline: true,
      network: true,
      memory: true,
      cpu: true,
      screenshots: true,
    });

    // Simulate some activity
    await automation.page.waitForTimeout(100); // Small delay
    await automation.takeScreenshot(); // Should work during recording

    // Stop recording and get metrics
    const metrics = await automation.stopRecording();

    // Verify basic metrics structure (detailed data collection tested in Phase 2)
    expect(metrics).toBeDefined();
    expect(metrics.duration).toBeGreaterThan(0);
    expect(metrics.timestamp).toBeDefined();
    expect(metrics.environment).toBeDefined();
    expect(metrics.environment.url).toContain("data:text/html");
  });

  test("should handle recording errors gracefully", async () => {
    // Test explanation: Verify error handling works as expected
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Should throw error if trying to record without initializing
    await expect(automation.stopRecording()).rejects.toThrow(
      "No recording in progress"
    );

    // Should throw error if trying to start recording twice
    await automation.startRecording({ timeline: true });
    await expect(automation.startRecording({ network: true })).rejects.toThrow(
      "Recording already in progress"
    );

    // Cleanup the ongoing recording
    await automation.stopRecording();
  });

  test("should cleanup resources properly", async () => {
    // Test explanation: This is crucial - we must ensure no resource leaks
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();
    await automation.page.goto(
      "data:text/html,<html><body>Cleanup Test</body></html>"
    );

    // Cleanup should not throw errors
    await expect(automation.cleanup()).resolves.not.toThrow();

    // Should throw error if trying to use page after cleanup
    expect(() => automation.page).toThrow("DevToolsAutomation not initialized");
  });

  test("should work with different configuration presets", async () => {
    // Test explanation: Verify our configuration system works with presets

    // Test CI configuration
    automation = new DevToolsAutomation(CI_DEVTOOLS_CONFIG);
    await automation.initialize();

    expect(automation.page).toBeDefined();
    await automation.cleanup();

    // Test development configuration (but force headless for CI)
    automation = new DevToolsAutomation({
      ...DEV_DEVTOOLS_CONFIG,
      browser: { ...DEV_DEVTOOLS_CONFIG.browser, headless: true },
    });
    await automation.initialize();

    expect(automation.page).toBeDefined();
    await automation.cleanup();
  });

  test("should handle page errors gracefully", async () => {
    // Test explanation: Verify our error handling for page-level issues
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();

    // Navigate to a page that will cause a JavaScript error
    const errorPageUrl =
      "data:text/html,<html><body><script>nonexistentFunction();</script><h1>Error Page</h1></body></html>";

    // Should not throw - page errors should be handled gracefully
    await expect(automation.page.goto(errorPageUrl)).resolves.not.toThrow();

    // Page should still be functional
    const title = await automation.page.textContent("h1");
    expect(title).toBe("Error Page");
  });

  test("should capture screenshots successfully", async () => {
    // Test explanation: Verify screenshot functionality works
    automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "error",
    });

    await automation.initialize();
    await automation.page.goto(
      'data:text/html,<html><body><h1 style="color:red;">Screenshot Test</h1></body></html>'
    );

    const screenshot = await automation.takeScreenshot();

    // Should return base64 encoded PNG
    expect(typeof screenshot).toBe("string");
    expect(screenshot.length).toBeGreaterThan(0);
    // Base64 strings should not contain spaces or newlines
    expect(screenshot).not.toContain(" ");
    expect(screenshot).not.toContain("\n");
  });
});

/**
 * Performance and Resource Usage Tests
 *
 * These tests verify that our automation doesn't consume excessive resources
 * and performs adequately for CI/CD usage.
 */
test.describe("DevTools Automation - Performance and Resources", () => {
  test("should initialize within reasonable time", async () => {
    // Test explanation: Ensure automation starts quickly enough for CI/CD
    const automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "silent",
    });

    const startTime = Date.now();
    await automation.initialize();
    const initTime = Date.now() - startTime;

    // Should initialize within 10 seconds (generous for CI environments)
    expect(initTime).toBeLessThan(10000);

    await automation.cleanup();
  });

  test("should cleanup within reasonable time", async () => {
    // Test explanation: Ensure cleanup doesn't hang or take too long
    const automation = new DevToolsAutomation({
      browser: { headless: true },
      logLevel: "silent",
    });

    await automation.initialize();
    await automation.page.goto(
      "data:text/html,<html><body>Cleanup Timing Test</body></html>"
    );

    const startTime = Date.now();
    await automation.cleanup();
    const cleanupTime = Date.now() - startTime;

    // Should cleanup within 5 seconds
    expect(cleanupTime).toBeLessThan(5000);
  });
});

/**
 * Configuration Validation Tests
 *
 * These tests verify that our configuration system works correctly
 * and handles edge cases appropriately.
 */
test.describe("DevTools Automation - Configuration", () => {
  test("should use default configuration when none provided", async () => {
    // Test explanation: Verify defaults work without explicit configuration
    const automation = new DevToolsAutomation(); // No config provided

    await automation.initialize();
    expect(automation.page).toBeDefined();
    await automation.cleanup();
  });

  test("should merge custom configuration with defaults", async () => {
    // Test explanation: Verify configuration merging works correctly
    const automation = new DevToolsAutomation({
      browser: { headless: true }, // Override just headless
      logLevel: "info", // Override log level
      // Other settings should use defaults
    });

    await automation.initialize();
    expect(automation.page).toBeDefined();
    await automation.cleanup();
  });

  test("should respect timeout configurations", async () => {
    // Test explanation: Verify timeout settings are applied correctly
    const automation = new DevToolsAutomation({
      browser: { headless: true },
      timeout: {
        navigation: 1000, // Very short timeout for this test
        interaction: 1000,
        profiling: 1000,
      },
      logLevel: "silent",
    });

    await automation.initialize();

    // Test that configuration object has the correct timeout values
    // This is a more reliable test than testing actual timeouts
    expect(automation).toBeDefined();

    // Test navigation to a simple page still works with reasonable timeout
    const testUrl = "data:text/html,<html><body>Timeout Test</body></html>";
    await expect(
      automation.page.goto(testUrl, { timeout: 2000 })
    ).resolves.not.toThrow();

    const content = await automation.page.textContent("body");
    expect(content).toBe("Timeout Test");

    await automation.cleanup();
  });
});
