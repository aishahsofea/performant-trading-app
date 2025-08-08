import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import budgetData from "./performance-budget.json";

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
};

type RegressionThresholds = {
  jsSize: number;
  cssSize: number;
  totalSize: number;
  fileCount: number;
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
  const buildManifestPath = path.join(
    __dirname,
    "../../.next",
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
  for (const [pagePath, files] of Object.entries(buildManifest.pages || {})) {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (!uniqueFiles.has(file)) {
          const filePath = path.join(__dirname, "../../.next", file);

          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const fileType = file.endsWith(".js")
              ? "js"
              : file.endsWith(".css")
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
        const currentFormatted = metric.includes("Size")
          ? formatSize(current)
          : current.toString();
        const baselineFormatted = metric.includes("Size")
          ? formatSize(baselineValue)
          : baselineValue.toString();
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
    console.log("\n➕ Performance improvements:");
    result.improvements.forEach(
      ({ metric, current, baseline: baselineValue, percentageDecrease }) => {
        const currentFormatted = metric.includes("Size")
          ? formatSize(current)
          : current.toString();
        const baselineFormatted = metric.includes("Size")
          ? formatSize(baselineValue)
          : baselineValue.toString();
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

    const currentMetrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      buildId: process.env.BUILD_ID || undefined,
      ...gitInfo,
      ...buildMetrics,
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
