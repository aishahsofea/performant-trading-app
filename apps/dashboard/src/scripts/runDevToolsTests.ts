#!/usr/bin/env node

/**
 * DevTools Test Runner - Phase 4 Implementation (Home Page Focus)
 *
 * Simple CLI script that tests home page performance only.
 *
 * Usage:
 *   npm run devtools:capture                    # Run home page test
 *   npm run devtools:baseline                   # Save new baseline
 *   npm run devtools:capture -- --export=csv   # Export to CSV
 */

import { promises as fs } from "fs";
import { join } from "path";
import {
  DevToolsAutomation,
  DevToolsMetrics,
} from "../automation/DevToolsAutomation";
import {
  CI_DEVTOOLS_CONFIG,
  DEV_DEVTOOLS_CONFIG,
} from "../automation/EnvironmentConfig";

export type TestScenario = {
  name: string;
  description: string;
  url: string;
  actions: TestAction[];
  expectedMetrics?: PerformanceThresholds;
};

export type TestAction = {
  type: "navigation" | "wait" | "screenshot";
  timeout?: number;
  description: string;
};

export type PerformanceThresholds = {
  maxScriptDuration?: number;
  maxLayoutDuration?: number;
  maxMemoryUsage?: number;
  maxLCPTime?: number;
};

export type TestResult = {
  scenario: string;
  success: boolean;
  metrics: DevToolsMetrics;
  error?: string;
  duration: number;
  timestamp: string;
};

export type TestSuiteResult = {
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
    timestamp: string;
  };
  results: TestResult[];
  environment: {
    nodeVersion: string;
    platform: string;
    baseUrl: string;
    config: string;
  };
};

export type DevToolsTestRunnerOptions = {
  baseUrl?: string;
  saveBaseline?: boolean;
  exportFormat?: "json" | "csv";
  outputDir?: string;
};

// Single home page test scenario
const DASHBOARD_SCENARIOS: TestScenario[] = [
  {
    name: "home-page-load",
    description: "Home page cold load performance",
    url: "/",
    actions: [
      {
        type: "navigation",
        description: "Navigate to home page",
      },
      {
        type: "wait",
        timeout: 3000,
        description: "Wait for page to fully load",
      },
      {
        type: "screenshot",
        description: "Capture loaded state",
      },
    ],
    expectedMetrics: {
      maxScriptDuration: 200,
      maxLayoutDuration: 100,
      maxLCPTime: 2500,
    },
  },
];

class DevToolsTestRunner {
  private automation: DevToolsAutomation;
  private baseUrl: string;
  private saveBaseline: boolean;
  private exportFormat: "json" | "csv";
  private outputDir: string;

  constructor(options: DevToolsTestRunnerOptions = {}) {
    this.baseUrl = options.baseUrl || "http://localhost:3000";
    this.saveBaseline = options.saveBaseline || false;
    this.exportFormat = options.exportFormat || "json";
    this.outputDir = options.outputDir || "./devtools-results";

    const isCI = process.env.CI === "true";
    const config = isCI ? CI_DEVTOOLS_CONFIG : DEV_DEVTOOLS_CONFIG;

    this.automation = new DevToolsAutomation({
      ...config,
      browser: {
        ...config.browser,
        headless: isCI || process.env.HEADLESS === "true",
      },
    });
  }

  async runAllScenarios(): Promise<TestSuiteResult> {
    console.log("🚀 Starting Home Page Performance Test");
    console.log(`📊 Base URL: ${this.baseUrl}`);

    const startTime = Date.now();
    const results: TestResult[] = [];

    await this.ensureOutputDirectory();

    try {
      await this.automation.initialize();
      console.log("✅ DevTools automation initialized");

      for (const scenario of DASHBOARD_SCENARIOS) {
        console.log(`\n📋 Running: ${scenario.name}`);
        const result = await this.runScenario(scenario);
        results.push(result);

        if (result.success) {
          console.log(`✅ ${scenario.name} completed`);
        } else {
          console.log(`❌ ${scenario.name} failed: ${result.error}`);
        }
      }
    } finally {
      await this.automation.cleanup();
      console.log("🧹 Cleanup complete");
    }

    const totalDuration = Date.now() - startTime;
    const passed = results.filter((r) => r.success).length;
    const failed = results.length - passed;

    const suiteResult: TestSuiteResult = {
      summary: {
        total: results.length,
        passed,
        failed,
        duration: totalDuration,
        timestamp: new Date().toISOString(),
      },
      results,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        baseUrl: this.baseUrl,
        config: process.env.CI === "true" ? "CI" : "DEV",
      },
    };

    await this.exportResults(suiteResult);

    if (this.saveBaseline && passed > 0) {
      await this.saveBaselineResults(suiteResult);
    }

    this.printSummary(suiteResult);
    return suiteResult;
  }

  private async runScenario(scenario: TestScenario): Promise<TestResult> {
    const startTime = Date.now();

    try {
      await this.automation.startRecording({
        timeline: true,
        network: true,
        memory: true,
        screenshots: true,
      });

      for (const action of scenario.actions) {
        await this.executeAction(action, scenario);
      }

      const metrics = await this.automation.stopRecording();
      const duration = Date.now() - startTime;

      if (scenario.expectedMetrics) {
        this.validateMetrics(metrics, scenario.expectedMetrics);
      }

      return {
        scenario: scenario.name,
        success: true,
        metrics,
        duration,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      try {
        await this.automation.stopRecording();
      } catch {}

      return {
        scenario: scenario.name,
        success: false,
        metrics: {} as DevToolsMetrics,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async executeAction(
    action: TestAction,
    scenario: TestScenario
  ): Promise<void> {
    console.log(`    ${action.description}`);

    switch (action.type) {
      case "navigation":
        const fullUrl = this.baseUrl + scenario.url;
        await this.automation.page.goto(fullUrl, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        break;

      case "wait":
        await this.automation.page.waitForTimeout(action.timeout || 1000);
        break;

      case "screenshot":
        await this.automation.takeScreenshot();
        break;
    }

    await this.automation.page.waitForTimeout(100);
  }

  private validateMetrics(
    metrics: DevToolsMetrics,
    thresholds: PerformanceThresholds
  ): void {
    const violations: string[] = [];

    if (
      thresholds.maxScriptDuration &&
      metrics.timeline?.javascript?.totalExecutionTime
    ) {
      if (
        metrics.timeline.javascript.totalExecutionTime >
        thresholds.maxScriptDuration
      ) {
        violations.push(
          `Script: ${metrics.timeline.javascript.totalExecutionTime}ms > ${thresholds.maxScriptDuration}ms`
        );
      }
    }

    if (
      thresholds.maxLayoutDuration &&
      metrics.timeline?.layoutPaint?.totalLayoutTime
    ) {
      if (
        metrics.timeline.layoutPaint.totalLayoutTime >
        thresholds.maxLayoutDuration
      ) {
        violations.push(
          `Layout: ${metrics.timeline.layoutPaint.totalLayoutTime}ms > ${thresholds.maxLayoutDuration}ms`
        );
      }
    }

    if (violations.length > 0) {
      console.log(`  ⚠️  Threshold violations: ${violations.join(", ")}`);
    }
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch {}
  }

  private async exportResults(results: TestSuiteResult): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Generate dynamic filename based on scenarios tested
    const scenarioSummary =
      results.results.length === 1
        ? results.results[0]?.scenario
        : `${results.results.length}-scenarios`;

    try {
      const filename = join(
        this.outputDir,
        `devtools-${scenarioSummary}-${timestamp}.${this.exportFormat}`
      );

      if (this.exportFormat === "json") {
        await fs.writeFile(filename, JSON.stringify(results, null, 2));
      } else {
        await fs.writeFile(filename, this.convertToCSV(results));
      }

      console.log(`📄 Results exported: ${filename}`);
    } catch (error) {
      console.warn(`Export failed: ${error}`);
    }
  }

  private convertToCSV(results: TestSuiteResult): string {
    const headers = [
      "Scenario",
      "Success",
      "Duration(ms)",
      "Script(ms)",
      "Layout(ms)",
      "Memory(MB)",
    ].join(",");
    const rows = results.results
      .map((r) => {
        const maxMemory = r.metrics.memory?.heapUsage?.length
          ? Math.max(
              ...r.metrics.memory.heapUsage.map((h) => h.usedJSHeapSize)
            ) /
            (1024 * 1024)
          : 0;

        return [
          r.scenario,
          r.success,
          r.duration,
          r.metrics.timeline?.javascript?.totalExecutionTime || "",
          r.metrics.timeline?.layoutPaint?.totalLayoutTime || "",
          maxMemory ? maxMemory.toFixed(1) : "",
        ].join(",");
      })
      .join("\n");

    return [headers, rows].join("\n");
  }

  private async saveBaselineResults(results: TestSuiteResult): Promise<void> {
    try {
      const baseline = {
        timestamp: results.summary.timestamp,
        scenarios: results.results
          .filter((r) => r.success)
          .map((r) => {
            const maxMemory = r.metrics.memory?.heapUsage?.length
              ? Math.max(
                  ...r.metrics.memory.heapUsage.map((h) => h.usedJSHeapSize)
                )
              : 0;

            return {
              scenario: r.scenario,
              scriptTime: r.metrics.timeline?.javascript?.totalExecutionTime,
              layoutTime: r.metrics.timeline?.layoutPaint?.totalLayoutTime,
              memoryPeak: maxMemory,
            };
          }),
      };

      await fs.writeFile(
        join(this.outputDir, "baseline.json"),
        JSON.stringify(baseline, null, 2)
      );
      console.log("📊 Baseline saved");
    } catch {}
  }

  private logSuccessfulMetrics(metrics: DevToolsMetrics) {
    if (metrics.timeline?.javascript?.totalExecutionTime) {
      console.log(
        `    Script: ${metrics.timeline.javascript.totalExecutionTime}ms`
      );
    }
    if (metrics.timeline?.layoutPaint?.totalLayoutTime) {
      console.log(
        `    Layout: ${metrics.timeline.layoutPaint.totalLayoutTime}ms`
      );
    }
    if (metrics.memory?.heapUsage?.length) {
      const maxMemory = Math.max(
        ...metrics.memory.heapUsage.map((h) => h.usedJSHeapSize)
      );
      console.log(`    Memory: ${(maxMemory / (1024 * 1024)).toFixed(1)}MB`);
    }
  }

  private printSummary(results: TestSuiteResult): void {
    console.log("\n📊 Home Page Test Summary");
    console.log("=========================");
    console.log(
      `Result: ${results.summary.passed}/${results.summary.total} ✅`
    );
    console.log(`Duration: ${(results.summary.duration / 1000).toFixed(1)}s`);

    if (results.summary.passed > 0) {
      console.log("\n🎯 Performance Metrics:");
      results.results
        .filter((r) => r.success)
        .forEach((r) => {
          console.log(`\n  ${r.scenario}:`);
          this.logSuccessfulMetrics(r.metrics);
        });
    }

    console.log("\n✨ Testing Complete!");
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const options: any = {};

  for (const arg of args) {
    if (arg === "--save-baseline") {
      options.saveBaseline = true;
    } else if (arg.startsWith("--export=")) {
      options.exportFormat = arg.split("=")[1];
    } else if (arg.startsWith("--base-url=")) {
      options.baseUrl = arg.split("=")[1];
    }
  }

  try {
    const runner = new DevToolsTestRunner(options);
    const results = await runner.runAllScenarios();

    if (results.summary.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Test runner failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { DevToolsTestRunner, DASHBOARD_SCENARIOS };
