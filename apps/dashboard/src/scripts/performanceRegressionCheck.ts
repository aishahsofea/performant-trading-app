import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import budgetData from "./performance-budget.json";
import { DevToolsTestRunner } from "./runDevToolsTests";

type LargestFile = {
  name: string;
  size: number;
  type: string;
};

type RegressionItem = {
  metric: string;
  current: number;
  baseline: number;
  threshold: number;
  percentageIncrease: number;
};

type ImprovementItem = {
  metric: string;
  current: number;
  baseline: number;
  percentageDecrease: number;
};

type RuntimeMetrics = {
  scriptExecutionTime?: number;
  layoutTime?: number;
  maxMemoryUsage?: number;
  testDuration?: number;
  pageLoadTime?: number;
};

type PerformanceMetrics = {
  timestamp: string;
  commitHash?: string;
  branch?: string;
  buildId?: string;
  jsSize: number;
  cssSize: number;
  totalSize: number;
  fileCount: number;
  sharedChunks: number;
  largestFiles: LargestFile[];
  timings?: {
    [key: string]: number;
  };
  runtime?: RuntimeMetrics;
};

type RegressionThresholds = {
  jsSize: number;
  cssSize: number;
  totalSize: number;
  fileCount: number;

  // DevTools runtime performance thresholds
  scriptExecutionTime: number;
  layoutTime: number;
  maxMemoryUsage: number;
  testDuration: number;
};

type RegressionResult = {
  hasRegression: boolean;
  regressions: RegressionItem[];
  improvements: ImprovementItem[];
};

const HISTORY_PATH = path.join(__dirname, "../../.performance-history");

// Set regression thresholds as percentage increases over budget
const budgets = budgetData[0]?.resourceSizes || [];
const scriptBudget =
  budgets.find((b) => b.resourceType === "script")?.budget || 500;
const styleBudget =
  budgets.find((b) => b.resourceType === "stylesheet")?.budget || 200;
const totalBudget =
  budgets.find((b) => b.resourceType === "total")?.budget || 2000;

const REGRESSION_THRESHOLDS: RegressionThresholds = {
  jsSize: scriptBudget * 1000 * 0.1, // 10% increase from budget (in bytes)
  cssSize: styleBudget * 1000 * 0.1, // 10% increase from budget (in bytes)
  totalSize: totalBudget * 1000 * 0.05, // 5% increase from budget (in bytes)
  fileCount: 3, // Allow up to 3 additional files

  // DevTools runtime performance thresholds
  scriptExecutionTime: 50, // 50ms increase in script execution time
  layoutTime: 25, // 25ms increase in layout time
  maxMemoryUsage: 10 * 1024 * 1024, // 10MB increase in memory usage
  testDuration: 2000, // 2s increase in total test duration
};

const ensureHistoryDirectory = () => {
  if (!fs.existsSync(HISTORY_PATH)) {
    fs.mkdirSync(HISTORY_PATH, { recursive: true });
  }
};

const getGitInfo = (): { commitHash?: string; branch?: string } => {
  try {
    const commitHash = execSync("git rev-parse HEAD", {
      encoding: "utf8",
    }).trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();
    return { commitHash, branch };
  } catch {
    return {};
  }
};

const getBuildMetrics = (): Omit<
  PerformanceMetrics,
  "timestamp" | "commitHash" | "branch" | "buildId"
> => {
  const NEXT_BUILD_PATH = "../../.next";
  const buildManifestPath = path.join(
    __dirname,
    NEXT_BUILD_PATH,
    "app-build-manifest.json"
  );

  if (!fs.existsSync(buildManifestPath)) {
    throw new Error("Build manifest not found. Run build first.");
  }

  const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"));
  const uniqueFiles = new Map<string, { size: number; type: string }>();

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let sharedChunks = 0;

  const fileUsageCount = new Map<string, number>();

  // Count file usage across pages
  for (const files of Object.values(buildManifest.pages || {})) {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        const count = fileUsageCount.get(file) || 0;
        fileUsageCount.set(file, count + 1);
      });
    }
  }

  // Calculate sizes and identify shared chunks
  for (const [_pagePath, files] of Object.entries(buildManifest.pages || {})) {
    console.log({ _pagePath });
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (!uniqueFiles.has(file)) {
          const filePath = path.join(__dirname, NEXT_BUILD_PATH, file);
          const fileExtension = path.extname(file);

          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const fileType =
              fileExtension === ".js"
                ? "js"
                : fileExtension === ".css"
                ? "css"
                : "other";

            uniqueFiles.set(file, { size: stats.size, type: fileType });
            totalSize += stats.size;

            if (fileType === "js") {
              jsSize += stats.size;
            } else if (fileType === "css") {
              cssSize += stats.size;
            }

            // Check if file is shared (used by multiple pages)
            if ((fileUsageCount.get(file) || 0) > 1) {
              sharedChunks++;
            }
          }
        }
      });
    }
  }

  // Get largest files
  const largestFiles = Array.from(uniqueFiles.entries())
    .map(([name, { size, type }]) => ({
      name: path.basename(name),
      size,
      type,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  return {
    jsSize,
    cssSize,
    totalSize,
    fileCount: uniqueFiles.size,
    sharedChunks,
    largestFiles,
  };
};

const getDevToolsMetrics = async (
  baseUrl: string = process.env.BASE_URL || "http://localhost:3000"
): Promise<RuntimeMetrics> => {
  console.log("🔬 Running DevTools performance tests...");

  try {
    const runner = new DevToolsTestRunner({ baseUrl, saveBaseline: false });
    const results = await runner.runAllScenarios();

    if (results.summary.passed === 0) {
      console.warn("⚠️  No DevTools tests passed, skipping runtime metrics");
      return {};
    }

    // Get metrics from the first successful test result
    const successfulResult = results.results.find((r) => r.success);
    if (!successfulResult) {
      return {};
    }

    const metrics = successfulResult.metrics;
    const scriptTime = metrics.timeline?.javascript?.totalExecutionTime || 0;
    const layoutTime = metrics.timeline?.layoutPaint?.totalLayoutTime || 0;

    // Calculate max memory from heap usage samples
    let maxMemory = 0;
    if (metrics.memory?.heapUsage?.length) {
      maxMemory = Math.max(
        ...metrics.memory.heapUsage.map((h) => h.usedJSHeapSize)
      );
    }

    console.log(
      `✅ DevTools metrics collected: Script ${scriptTime}ms, Layout ${layoutTime}ms, Memory ${(
        maxMemory /
        (1024 * 1024)
      ).toFixed(1)}MB`
    );

    return {
      scriptExecutionTime: scriptTime,
      layoutTime: layoutTime,
      maxMemoryUsage: maxMemory,
      testDuration: successfulResult.duration,
      pageLoadTime: successfulResult.duration, // Using test duration as proxy for page load time
    };
  } catch (error) {
    console.warn(
      "⚠️  DevTools metrics collection failed:",
      error instanceof Error ? error.message : String(error)
    );
    return {};
  }
};

const saveMetrics = (metrics: PerformanceMetrics) => {
  const filename = `${metrics.timestamp}-${
    metrics.commitHash?.slice(0, 8) || "unknown"
  }.json`;
  const filepath = path.join(HISTORY_PATH, filename);

  fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
  console.log(`📐 Performance metrics saved: ${filename}`);
};

const getBaseline = (): PerformanceMetrics | null => {
  if (!fs.existsSync(HISTORY_PATH)) {
    return null;
  }

  const files = fs
    .readdirSync(HISTORY_PATH)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse(); // Most recent first

  if (files.length === 0) {
    return null;
  }

  // Use the most recent successful build as baseline
  for (const file of files) {
    try {
      const filepath = path.join(HISTORY_PATH, file);
      const data = JSON.parse(fs.readFileSync(filepath, "utf8"));
      if (data.jsSize && data.cssSize && data.totalSize) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
};

const detectRegressions = (
  current: PerformanceMetrics,
  baseline: PerformanceMetrics
): RegressionResult => {
  const result: RegressionResult = {
    hasRegression: false,
    regressions: [],
    improvements: [],
  };

  const checks = [
    // Build-time metrics
    {
      metric: "JavaScript Size",
      current: current.jsSize,
      baseline: baseline.jsSize,
      threshold: REGRESSION_THRESHOLDS.jsSize,
    },
    {
      metric: "CSS Size",
      current: current.cssSize,
      baseline: baseline.cssSize,
      threshold: REGRESSION_THRESHOLDS.cssSize,
    },
    {
      metric: "Total Size",
      current: current.totalSize,
      baseline: baseline.totalSize,
      threshold: REGRESSION_THRESHOLDS.totalSize,
    },
    {
      metric: "File Count",
      current: current.fileCount,
      baseline: baseline.fileCount,
      threshold: REGRESSION_THRESHOLDS.fileCount,
    },
  ];

  // Add runtime metrics checks if available
  if (current.runtime && baseline.runtime) {
    if (
      current.runtime.scriptExecutionTime !== undefined &&
      baseline.runtime.scriptExecutionTime !== undefined
    ) {
      checks.push({
        metric: "Script Execution Time",
        current: current.runtime.scriptExecutionTime,
        baseline: baseline.runtime.scriptExecutionTime,
        threshold: REGRESSION_THRESHOLDS.scriptExecutionTime,
      });
    }

    if (
      current.runtime.layoutTime !== undefined &&
      baseline.runtime.layoutTime !== undefined
    ) {
      checks.push({
        metric: "Layout Time",
        current: current.runtime.layoutTime,
        baseline: baseline.runtime.layoutTime,
        threshold: REGRESSION_THRESHOLDS.layoutTime,
      });
    }

    if (
      current.runtime.maxMemoryUsage !== undefined &&
      baseline.runtime.maxMemoryUsage !== undefined
    ) {
      checks.push({
        metric: "Max Memory Usage",
        current: current.runtime.maxMemoryUsage,
        baseline: baseline.runtime.maxMemoryUsage,
        threshold: REGRESSION_THRESHOLDS.maxMemoryUsage,
      });
    }

    if (
      current.runtime.testDuration !== undefined &&
      baseline.runtime.testDuration !== undefined
    ) {
      checks.push({
        metric: "Test Duration",
        current: current.runtime.testDuration,
        baseline: baseline.runtime.testDuration,
        threshold: REGRESSION_THRESHOLDS.testDuration,
      });
    }
  }

  checks.forEach(
    ({ metric, current: currentValue, baseline: baselineValue, threshold }) => {
      const difference = currentValue - baselineValue;
      const percentageChange = (difference / baselineValue) * 100;

      if (difference > threshold) {
        result.hasRegression = true;
        result.regressions.push({
          metric,
          current: currentValue,
          baseline: baselineValue,
          threshold,
          percentageIncrease: Math.abs(percentageChange),
        });
      } else if (difference < 0) {
        result.improvements.push({
          metric,
          current: currentValue,
          baseline: baselineValue,
          percentageDecrease: Math.abs(percentageChange),
        });
      }
    }
  );

  return result;
};

const formatSize = (bytes: number): string => {
  return Math.round(bytes / 1024) + "KB";
};

const formatMemory = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(1) + "MB";
};

const formatTime = (ms: number): string => {
  return ms.toFixed(1) + "ms";
};

const formatValue = (metric: string, value: number): string => {
  if (metric.includes("Size") && !metric.includes("Memory")) {
    return formatSize(value);
  } else if (metric.includes("Memory")) {
    return formatMemory(value);
  } else if (metric.includes("Time") || metric.includes("Duration")) {
    return formatTime(value);
  } else {
    return value.toString();
  }
};

const generateReport = (
  current: PerformanceMetrics,
  baseline: PerformanceMetrics | null,
  result: RegressionResult
) => {
  console.log("\nPerformance Regression Analysis");
  console.log("=" + "=".repeat(40));

  if (!baseline) {
    console.log("No baseline found. This will be your new baseline.");
    console.log(
      `Current metrics: JS: ${formatSize(current.jsSize)}, CSS: ${formatSize(
        current.cssSize
      )}, Total: ${formatSize(current.totalSize)}`
    );
    return;
  }

  console.log(`Comparing against baseline: ${baseline.timestamp}`);
  if (baseline.commitHash) {
    console.log(`   Baseline commit: ${baseline.commitHash.slice(0, 8)}`);
  }

  if (result.hasRegression) {
    console.log("\n🚨 Performance regressions detected:");
    result.regressions.forEach(
      ({ metric, current, baseline: baselineValue, percentageIncrease }) => {
        const currentFormatted = formatValue(metric, current);
        const baselineFormatted = formatValue(metric, baselineValue);
        console.log(
          `   - ${metric}: ${currentFormatted} (was ${baselineFormatted}) - ${percentageIncrease.toFixed(
            1
          )}% increase`
        );
      }
    );
  } else {
    console.log("\n🤗 No performance regressions detected");
  }

  if (result.improvements.length > 0) {
    console.log("\nPerformance improvements:");
    result.improvements.forEach(
      ({ metric, current, baseline: baselineValue, percentageDecrease }) => {
        const currentFormatted = formatValue(metric, current);
        const baselineFormatted = formatValue(metric, baselineValue);
        console.log(
          `   - ${metric}: ${currentFormatted} (was ${baselineFormatted}) - ${percentageDecrease.toFixed(
            1
          )}% improvement`
        );
      }
    );
  }

  // Show largest files comparison
  console.log("\n📂 Largest files:");
  current.largestFiles.slice(0, 5).forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.name}: ${formatSize(file.size)}`);
  });
};

const runRegressionCheck = async (
  saveAsBaseline: boolean = false
): Promise<boolean> => {
  try {
    console.log("Running performance regression detection...");

    // Ensure history directory exists
    ensureHistoryDirectory();

    // Get current build metrics
    const gitInfo = getGitInfo();
    const buildMetrics = getBuildMetrics();

    // Get DevTools runtime metrics
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const runtimeMetrics = await getDevToolsMetrics(baseUrl);

    const currentMetrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      buildId: process.env.BUILD_ID || undefined,
      ...gitInfo,
      ...buildMetrics,
      runtime:
        Object.keys(runtimeMetrics).length > 0 ? runtimeMetrics : undefined,
    };

    // Get baseline for comparison
    const baseline = getBaseline();

    // Detect regressions
    const result = baseline
      ? detectRegressions(currentMetrics, baseline)
      : {
          hasRegression: false,
          regressions: [],
          improvements: [],
        };

    // Generate report
    generateReport(currentMetrics, baseline, result);

    // Save current metrics as new data point
    if (saveAsBaseline || !baseline) {
      saveMetrics(currentMetrics);
    }

    // Exit with error code if regressions found
    if (result.hasRegression) {
      console.log("\n🚨 Performance regression check failed!");
      return false;
    } else {
      console.log("\n🎉 Performance regression check passed!");
      return true;
    }
  } catch (error) {
    console.error("❗️ Error running performance regression check:", error);
    return false;
  }
};

const cleanupOldHistory = (keepDays: number = 30) => {
  if (!fs.existsSync(HISTORY_PATH)) {
    return;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - keepDays);

  const files = fs.readdirSync(HISTORY_PATH);
  let removedCount = 0;

  files.forEach((file) => {
    const filepath = path.join(HISTORY_PATH, file);
    const stats = fs.statSync(filepath);

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filepath);
      removedCount++;
    }
  });

  if (removedCount > 0) {
    console.log(`🧹 Cleaned up ${removedCount} old performance history files`);
  }
};

// CLI interface
const args = process.argv.slice(2);
const saveBaseline = args.includes("--save-baseline");
const cleanup = args.includes("--cleanup");

if (cleanup) {
  cleanupOldHistory();
}

runRegressionCheck(saveBaseline).then((success) => {
  process.exit(success ? 0 : 1);
});
