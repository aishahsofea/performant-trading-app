import data from "./performance-budget.json";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

type ResourceSize = {
  resourceType: string;
  budget: number; // in KB
};

type ChunkInfo = {
  file: string;
  size: number;
  type: "js" | "css" | "other";
  pages: string[];
  isShared?: boolean;
  category?: string;
};

type PageStats = {
  files: number;
  totalSize: number;
  jsSize: number;
  cssSize: number;
};

type BuildAnalysis = {
  chunks: ChunkInfo[];
  pages: Record<string, PageStats>;
  sharedChunks: ChunkInfo[];
  totalSize: number;
  jsSize: number;
  cssSize: number;
  isDevelopment: boolean;
};

type BuildManifest = {
  pages: Record<string, string[]>;
};

type AnalyzerOutput = {
  hasVisualizations: boolean;
  hasStats: boolean;
  files: string[];
  statsFiles?: string[];
};

console.log("Performance Budget Data:", data[0]?.resourceSizes);

const BUDGET_THRESHOLDS: ResourceSize[] = data[0]?.resourceSizes ?? [];

const generateBundleAnalysis = () => {
  console.log("Generating detailed bundle analysis...");

  try {
    execSync("cross-env ANALYZE=true next build", { stdio: "inherit" });
    console.log("✅ Bundle analysis generated successfully.");

    // Check what files were generated
    const analyzeDir = path.join(__dirname, "../../.next", "analyze");
    if (fs.existsSync(analyzeDir)) {
      const files = fs.readdirSync(analyzeDir);
      console.log(`📂 Generated files: ${files.join(", ")}`);

      if (files.includes("client.html")) {
        console.log(
          "Open .next/analyze/client.html to view the bundle analysis."
        );
      }
    }
  } catch (error) {
    console.error("Error generating bundle analysis:", error);
    process.exit(1);
  }
};

const parseBuildManifest = () => {
  const appBuildManifestPath = path.join(
    __dirname,
    "../../.next",
    "app-build-manifest.json"
  );

  if (!fs.existsSync(appBuildManifestPath)) {
    console.error("Build manifest not found. Ensure the build was successful.");
    process.exit(1);
  }

  const buildManifest: BuildManifest = JSON.parse(
    fs.readFileSync(appBuildManifestPath, "utf8")
  );

  const analysis: BuildAnalysis = {
    chunks: [],
    pages: {},
    sharedChunks: [],
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    isDevelopment: false,
  };

  // Check is this is a development build
  const allFiles = Object.values(buildManifest.pages || {}).flat();
  const isDevBuild = allFiles.some(
    (file) =>
      typeof file === "string" &&
      (file.includes("development") ||
        file.includes("hmr-client") ||
        file.includes("devtools"))
  );

  if (isDevBuild) {
    analysis.isDevelopment = true;
    console.warn(
      "⚠️ This appears to be a development build. Performance analysis may not be accurate. Run a production build with `next build` for accurate results."
    );
  }

  const uniqueFiles = new Map<string, ChunkInfo>();
  const fileToPages = new Map<string, string[]>();

  for (const [pagePath, files] of Object.entries(buildManifest.pages || {})) {
    analysis.pages[pagePath] = {
      files: files.length,
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
    };

    files.forEach((file) => {
      // Track which pages use each file
      if (!fileToPages.has(file)) {
        fileToPages.set(file, []);
      }
      fileToPages.get(file)?.push(pagePath);

      // Only calculate size once per unique file
      if (!uniqueFiles.has(file)) {
        const filePath = path.join(__dirname, "../../.next", file);

        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const chunkInfo: ChunkInfo = {
            file,
            size: stats.size,
            type: file.endsWith(".js")
              ? "js"
              : file.endsWith(".css")
              ? "css"
              : "other",
            pages: [pagePath],
          };

          uniqueFiles.set(file, chunkInfo);
          analysis.totalSize += stats.size;

          if (chunkInfo.type === "js") {
            analysis.jsSize += stats.size;
          } else if (chunkInfo.type === "css") {
            analysis.cssSize += stats.size;
          }
        } else {
          console.warn("⚠️ File not found: ", file);
        }
      }

      // Update page stat
      const chunkInfo = uniqueFiles.get(file);
      if (chunkInfo && analysis.pages[pagePath]) {
        analysis.pages[pagePath].totalSize += chunkInfo.size;
        if (chunkInfo.type === "js") {
          analysis.pages[pagePath].jsSize += chunkInfo.size;
        } else if (chunkInfo.type === "css") {
          analysis.pages[pagePath].cssSize += chunkInfo.size;
        }
      }
    });
  }

  // Update chunk info with all pages that use each file
  uniqueFiles.forEach((chunkInfo, file) => {
    chunkInfo.pages = fileToPages.get(file) || [];
    chunkInfo.isShared = chunkInfo.pages.length > 1;
    analysis.chunks.push(chunkInfo);
  });

  // Separate shared chunks
  analysis.sharedChunks = analysis.chunks.filter((chunk) => chunk.isShared);

  return analysis;
};

const checkBundleAnalyzerOutput = () => {
  const analyzeDir = path.join(__dirname, "../../.next", "analyze");

  if (!fs.existsSync(analyzeDir)) {
    return null;
  }

  const files = fs.readdirSync(analyzeDir);
  const analysis: AnalyzerOutput = {
    hasVisualizations: false,
    hasStats: false,
    files,
  };

  // Check for HTML visualizations
  if (files.some((file) => file.endsWith(".html"))) {
    analysis.hasVisualizations = true;
  }

  // Check for JSON stats
  const statsFiles = files.filter((file) => file.endsWith(".json"));
  if (statsFiles.length > 0) {
    analysis.hasStats = true;
    analysis.statsFiles = statsFiles;
  }

  return analysis;
};

const generateViolationMessage = (
  resourceType: string,
  size: number,
  maxSize: number
) => {
  return `${resourceType} bundle size (${Math.round(
    size / 1024
  )}KB) exceeds budget of ${Math.round(maxSize / 1024)}KB`;
};

const checkBundleSize = (generateAnalysis = false) => {
  const buildPath = path.join(__dirname, "../../.next");

  if (!fs.existsSync(buildPath)) {
    console.error("Build directory not found. Run build first.");
    process.exit(1);
  }

  if (generateAnalysis) {
    generateBundleAnalysis();
  }

  console.log("Analyzing bundle sizes...\n");
  ``;

  // Parse build manifest for analysis
  const basicAnalysis = parseBuildManifest();

  // Check what bundle analyzer files are available
  const analyzerOutput = checkBundleAnalyzerOutput();

  const showBreakdownByCategory = () => {
    const categoryBreakdown: Record<string, number> =
      basicAnalysis.chunks.reduce((acc: Record<string, number>, chunk) => {
        if (!chunk.category) {
          console.warn(
            `⚠️ Chunk ${chunk.file} does not have a category defined.`
          );
          acc["Uncategorized"] = (acc["Uncategorized"] || 0) + chunk.size;
        } else {
          acc[chunk.category] = (acc[chunk.category] || 0) + chunk.size;
        }

        return acc;
      }, {});

    console.log("\n📐 Size breakdown by category:");
    Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .forEach(([category, size]) => {
        console.log(`- ${category}: ${Math.round(size / 1024)}KB`);
      });
  };

  const showLargestFiles = () => {
    const largestFiles = basicAnalysis.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    console.log("\n📂 largest files:");
    largestFiles.forEach((chunk) => {
      const filename = path.basename(chunk.file);
      const shared = chunk.isShared ? " (shared)" : "";
      console.log(
        ` - ${filename}: ${Math.round(chunk.size / 1024)}KB${shared}`
      );
    });
  };

  // Check budgets (relax for development builds)
  const budgetViolations = [];
  const budgetMultiplier = basicAnalysis.isDevelopment ? 3 : 1;

  const maxBundleSize =
    (BUDGET_THRESHOLDS.find((resource) => resource?.resourceType === "script")
      ?.budget ?? 0) * 1000; // Convert to bytes
  const maxCssSize =
    (BUDGET_THRESHOLDS.find(
      (resource) => resource?.resourceType === "stylesheet"
    )?.budget ?? 0) * 1000; // Convert to bytes
  const maxTotalSize =
    (BUDGET_THRESHOLDS.find((resource) => resource?.resourceType === "total")
      ?.budget ?? 0) * 1000; // Convert to bytes

  if (basicAnalysis.jsSize > maxBundleSize * budgetMultiplier) {
    budgetViolations.push(
      generateViolationMessage(
        "JavaScript",
        basicAnalysis.jsSize,
        maxBundleSize * budgetMultiplier
      )
    );
  }

  if (basicAnalysis.cssSize > maxCssSize * budgetMultiplier) {
    budgetViolations.push(
      generateViolationMessage(
        "CSS",
        basicAnalysis.cssSize,
        maxCssSize * budgetMultiplier
      )
    );
  }

  if (basicAnalysis.totalSize > maxTotalSize * budgetMultiplier) {
    budgetViolations.push(
      generateViolationMessage(
        "Total",
        basicAnalysis.totalSize,
        maxTotalSize * budgetMultiplier
      )
    );
  }

  // Log the analysis results
  if (budgetViolations.length > 0) {
    console.error("🚨 Performance Budget Violations Detected:");
    budgetViolations.forEach((violation) => console.error(`- ${violation}`));

    if (basicAnalysis.isDevelopment) {
      console.warn(
        "⚠️ This is a development build. Performance analysis may not be accurate. Run a production build with `next build` for accurate results."
      );
    }

    // Show per-page breakdown
    if (Object.keys(basicAnalysis.pages).length > 0) {
      console.log("\nPer-Page Breakdown:");
      Object.entries(basicAnalysis.pages)
        .sort(([, a], [, b]) => b.totalSize - a.totalSize)
        .forEach(([page, stats]) => {
          const pageDisplayName = page === "/page" ? "/" : page;
          console.log(
            `${pageDisplayName}: ${Math.round(stats.totalSize / 1024)}KB`
          );
        });
    }

    showBreakdownByCategory();
    showLargestFiles();

    process.exit(1);
  }

  console.log("🎉 Performance budgets met!\n");
  console.log("Bundle Analysis Summary:");
  console.log(
    ` - JavaScript: ${Math.round(
      basicAnalysis.jsSize / 1024
    )}KB (limit: ${Math.round((maxBundleSize * budgetMultiplier) / 1024)}KB)`
  );
  console.log(
    ` - CSS: ${Math.round(basicAnalysis.cssSize / 1024)}KB (limit: ${Math.round(
      (maxCssSize * budgetMultiplier) / 1024
    )}KB)`
  );
  console.log(
    ` - Total: ${Math.round(
      basicAnalysis.totalSize / 1024
    )}KB (limit: ${Math.round((maxTotalSize * budgetMultiplier) / 1024)}KB)`
  );
  console.log(` - Unique files: ${basicAnalysis.chunks.length}`);
  console.log(` - Shared chunks: ${basicAnalysis.sharedChunks.length}`);

  // Show per-page analysis
  if (Object.keys(basicAnalysis.pages).length > 0) {
    console.log("\n📊 Per-page analysis:");
    Object.entries(basicAnalysis.pages)
      .sort(([, a], [, b]) => b.totalSize - a.totalSize)
      .forEach(([page, stats]) => {
        const pageDisplayName = page === "/page" ? "/" : page;
        console.log(
          `    ${pageDisplayName}: ${Math.round(stats.totalSize / 1024)}KB (${
            stats.files
          } files)`
        );
        console.log(
          `      - JavaScript: ${Math.round(
            stats.jsSize / 1024
          )}KB, CSS: ${Math.round(stats.cssSize / 1024)}KB`
        );
      });
  }

  showBreakdownByCategory();
  showLargestFiles();
};

checkBundleSize();
