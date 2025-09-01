#!/usr/bin/env node

/**
 * DevTools Profile Analyzer - Phase 4 Implementation
 *
 * Analyzes exported DevTools performance data to identify bottlenecks and trends.
 * Provides actionable insights for performance optimization.
 *
 * Usage:
 *   npm run devtools:analyze                           # Analyze latest results
 *   npm run devtools:analyze -- --file=results.json   # Analyze specific file
 *   npm run devtools:analyze -- --compare-baseline    # Compare with baseline
 */

import { promises as fs } from "fs";
import { join } from "path";
import { TestSuiteResult } from "./runDevToolsTests";

type AnalysisOptions = {
  inputFile?: string;
  compareBaseline?: boolean;
  outputDir?: string;
};

type PerformanceInsight = {
  type: "warning" | "error" | "info" | "success";
  category: "script" | "layout" | "memory" | "general";
  message: string;
  value?: number;
  threshold?: number;
  suggestion?: string;
};

type ScenarioAnalysis = {
  name: string;
  success: boolean;
  performance: {
    scriptTime: number;
    layoutTime: number;
    memoryUsage: number;
    totalTime: number;
  };
  grade: "A" | "B" | "C" | "D" | "F";
  recommendations: string[];
};

type AnalysisReport = {
  summary: {
    totalScenarios: number;
    passedScenarios: number;
    overallHealth: "excellent" | "good" | "concerning" | "poor";
    averageLoadTime: number;
    timestamp: string;
  };
  insights: PerformanceInsight[];
  scenarios: ScenarioAnalysis[];
  baseline?: {
    available: boolean;
    improvements: string[];
    regressions: string[];
    summary: string;
  };
};

class DevToolsAnalyzer {
  private options: AnalysisOptions;
  private outputDir: string;

  constructor(options: AnalysisOptions = {}) {
    this.options = options;
    this.outputDir = options.outputDir || "./devtools-results";
  }

  async analyze(): Promise<AnalysisReport> {
    console.log("🔍 Starting DevTools Performance Analysis");

    const results = await this.loadTestResults();
    console.log(`📊 Loaded results for ${results.summary.total} scenarios`);

    let baseline: any = null;
    if (this.options.compareBaseline) {
      baseline = await this.loadBaseline();
    }

    const report = this.generateAnalysisReport(results, baseline);
    await this.outputReport(report);

    return report;
  }

  private async loadTestResults(): Promise<TestSuiteResult> {
    let resultsFile: string;

    if (this.options.inputFile) {
      resultsFile = this.options.inputFile;
    } else {
      resultsFile = await this.findLatestResultsFile();
    }

    console.log(`📄 Loading results from: ${resultsFile}`);

    try {
      const content = await fs.readFile(resultsFile, "utf8");
      return JSON.parse(content) as TestSuiteResult;
    } catch (error) {
      throw new Error(`Failed to load results file: ${error}`);
    }
  }

  private async findLatestResultsFile(): Promise<string> {
    try {
      const files = await fs.readdir(this.outputDir);
      // Updated to handle dynamic filename pattern
      const resultFiles = files
        .filter(
          (f) =>
            f.startsWith("devtools-") &&
            f.endsWith(".json") &&
            !f.includes("analysis-report")
        )
        .sort()
        .reverse();

      if (resultFiles.length === 0) {
        throw new Error(
          "No DevTools results files found. Run devtools:capture first."
        );
      }

      return join(this.outputDir, resultFiles[0]!);
    } catch (error) {
      throw new Error(
        `Could not find results files in ${this.outputDir}: ${error}`
      );
    }
  }

  private async loadBaseline(): Promise<any> {
    const baselineFile = join(this.outputDir, "baseline.json");

    try {
      const content = await fs.readFile(baselineFile, "utf8");
      console.log("📊 Loaded baseline for comparison");
      return JSON.parse(content);
    } catch (error) {
      console.warn("⚠️  No baseline found for comparison", error);
      return null;
    }
  }

  private generateAnalysisReport(
    results: TestSuiteResult,
    baseline: any
  ): AnalysisReport {
    const insights: PerformanceInsight[] = [];
    const scenarioAnalyses: ScenarioAnalysis[] = [];

    let totalLoadTime = 0;
    const successfulResults = results.results.filter((r) => r.success);

    // Analyze each scenario
    for (const result of successfulResults) {
      const analysis = this.analyzeScenario(result);
      scenarioAnalyses.push(analysis);
      totalLoadTime += analysis.performance.totalTime;

      insights.push(...this.generateScenarioInsights(result, analysis));
    }

    insights.push(...this.generateOverallInsights(results));

    let baselineComparison;
    if (baseline) {
      baselineComparison = this.compareWithBaseline(results, baseline);
    }

    const averageLoadTime =
      successfulResults.length > 0
        ? totalLoadTime / successfulResults.length
        : 0;
    const overallHealth = this.calculateOverallHealth(scenarioAnalyses);

    return {
      summary: {
        totalScenarios: results.summary.total,
        passedScenarios: results.summary.passed,
        overallHealth,
        averageLoadTime,
        timestamp: new Date().toISOString(),
      },
      insights,
      scenarios: scenarioAnalyses,
      baseline: baselineComparison,
    };
  }

  private analyzeScenario(result: any): ScenarioAnalysis {
    const scriptTime =
      result.metrics.timeline?.javascript?.totalExecutionTime || 0;
    const layoutTime =
      result.metrics.timeline?.layoutPaint?.totalLayoutTime || 0;
    const memoryUsage = result.metrics.memory?.heapUsage?.length
      ? Math.max(
          ...result.metrics.memory.heapUsage.map((h: any) => h.usedJSHeapSize)
        ) /
        (1024 * 1024)
      : 0;
    const totalTime = result.duration;

    const grade = this.calculatePerformanceGrade(
      scriptTime,
      layoutTime,
      memoryUsage,
      totalTime
    );
    const recommendations = this.generateRecommendations(
      scriptTime,
      layoutTime,
      memoryUsage
    );

    return {
      name: result.scenario,
      success: result.success,
      performance: {
        scriptTime,
        layoutTime,
        memoryUsage,
        totalTime,
      },
      grade,
      recommendations,
    };
  }

  private calculatePerformanceGrade(
    scriptTime: number,
    layoutTime: number,
    memoryUsage: number,
    totalTime: number
  ): "A" | "B" | "C" | "D" | "F" {
    let score = 100;

    if (scriptTime > 200) score -= 20;
    else if (scriptTime > 100) score -= 10;

    if (layoutTime > 100) score -= 15;
    else if (layoutTime > 50) score -= 5;

    if (memoryUsage > 100) score -= 15;
    else if (memoryUsage > 50) score -= 5;

    if (totalTime > 5000) score -= 20;
    else if (totalTime > 3000) score -= 10;

    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  private generateRecommendations(
    scriptTime: number,
    layoutTime: number,
    memoryUsage: number
  ): string[] {
    const recommendations: string[] = [];

    if (scriptTime > 200) {
      recommendations.push(
        "Consider code splitting and lazy loading to reduce JavaScript execution time"
      );
    } else if (scriptTime > 100) {
      recommendations.push(
        "Optimize JavaScript bundle size and execution efficiency"
      );
    }

    if (layoutTime > 100) {
      recommendations.push("Reduce DOM complexity and CSS selector complexity");
    } else if (layoutTime > 50) {
      recommendations.push(
        "Consider optimizing CSS for better layout performance"
      );
    }

    if (memoryUsage > 100) {
      recommendations.push(
        "Investigate potential memory leaks and optimize object lifecycle"
      );
    } else if (memoryUsage > 50) {
      recommendations.push(
        "Monitor memory usage patterns for optimization opportunities"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Performance looks good! Continue monitoring for regressions"
      );
    }

    return recommendations;
  }

  private generateScenarioInsights(
    result: any,
    analysis: ScenarioAnalysis
  ): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    const { scriptTime, layoutTime, memoryUsage } = analysis.performance;

    if (scriptTime > 200) {
      insights.push({
        type: "error",
        category: "script",
        message: `${result.scenario}: High JavaScript execution time`,
        value: scriptTime,
        threshold: 200,
        suggestion: "Consider code splitting or optimization",
      });
    } else if (scriptTime > 100) {
      insights.push({
        type: "warning",
        category: "script",
        message: `${result.scenario}: Elevated JavaScript execution time`,
        value: scriptTime,
        threshold: 100,
      });
    }

    if (layoutTime > 100) {
      insights.push({
        type: "warning",
        category: "layout",
        message: `${result.scenario}: High layout computation time`,
        value: layoutTime,
        threshold: 100,
        suggestion: "Simplify CSS selectors and DOM structure",
      });
    }

    if (memoryUsage > 100) {
      insights.push({
        type: "warning",
        category: "memory",
        message: `${result.scenario}: High memory usage detected`,
        value: memoryUsage,
        threshold: 100,
        suggestion: "Check for memory leaks and optimize object usage",
      });
    }

    if (analysis.grade === "A") {
      insights.push({
        type: "success",
        category: "general",
        message: `${result.scenario}: Excellent performance achieved`,
        suggestion: "Maintain current optimization practices",
      });
    }

    return insights;
  }

  private generateOverallInsights(
    results: TestSuiteResult
  ): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];

    if (results.summary.failed > 0) {
      insights.push({
        type: "error",
        category: "general",
        message: `${results.summary.failed} scenarios failed to complete`,
        suggestion: "Review error logs and fix underlying issues",
      });
    }

    if (results.summary.passed === results.summary.total) {
      insights.push({
        type: "success",
        category: "general",
        message: "All performance scenarios completed successfully",
        suggestion: "Continue regular performance monitoring",
      });
    }

    return insights;
  }

  private compareWithBaseline(current: TestSuiteResult, baseline: any): any {
    const improvements: string[] = [];
    const regressions: string[] = [];

    for (const currentResult of current.results.filter((r) => r.success)) {
      const baselineScenario = baseline.scenarios?.find(
        (s: any) => s.scenario === currentResult.scenario
      );

      if (baselineScenario) {
        const currentScript =
          currentResult.metrics.timeline?.javascript?.totalExecutionTime || 0;
        const baselineScript = baselineScenario.scriptTime || 0;

        const scriptDiff = currentScript - baselineScript;
        const scriptPercent =
          baselineScript > 0 ? (scriptDiff / baselineScript) * 100 : 0;

        if (scriptPercent < -10) {
          improvements.push(
            `${currentResult.scenario}: Script time improved by ${Math.abs(
              scriptPercent
            ).toFixed(1)}%`
          );
        } else if (scriptPercent > 20) {
          regressions.push(
            `${
              currentResult.scenario
            }: Script time regressed by ${scriptPercent.toFixed(1)}%`
          );
        }

        const currentMemory = currentResult.metrics.memory?.heapUsage?.length
          ? Math.max(
              ...currentResult.metrics.memory.heapUsage.map(
                (h: any) => h.usedJSHeapSize
              )
            )
          : 0;
        const baselineMemory = baselineScenario.memoryPeak || 0;

        const memoryDiff = currentMemory - baselineMemory;
        const memoryPercent =
          baselineMemory > 0 ? (memoryDiff / baselineMemory) * 100 : 0;

        if (memoryPercent < -10) {
          improvements.push(
            `${currentResult.scenario}: Memory usage improved by ${Math.abs(
              memoryPercent
            ).toFixed(1)}%`
          );
        } else if (memoryPercent > 25) {
          regressions.push(
            `${
              currentResult.scenario
            }: Memory usage regressed by ${memoryPercent.toFixed(1)}%`
          );
        }
      }
    }

    let summary = "Performance maintained";
    if (improvements.length > regressions.length) {
      summary = "Overall performance improved";
    } else if (regressions.length > improvements.length) {
      summary = "Performance regressions detected";
    }

    return {
      available: true,
      improvements,
      regressions,
      summary,
    };
  }

  private calculateOverallHealth(
    analyses: ScenarioAnalysis[]
  ): "excellent" | "good" | "concerning" | "poor" {
    if (analyses.length === 0) return "poor";

    const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const totalPoints = analyses.reduce(
      (sum, a) => sum + gradePoints[a.grade],
      0
    );
    const averageGrade = totalPoints / analyses.length;

    if (averageGrade >= 3.5) return "excellent";
    if (averageGrade >= 2.5) return "good";
    if (averageGrade >= 1.5) return "concerning";
    return "poor";
  }

  private async outputReport(report: AnalysisReport): Promise<void> {
    this.printConsoleReport(report);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportFile = join(
      this.outputDir,
      `analysis-report-${timestamp}.json`
    );

    try {
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved: ${reportFile}`);
    } catch (error) {
      console.warn(`Could not save report: ${error}`);
    }
  }

  private printConsoleReport(report: AnalysisReport): void {
    console.log("\n📊 DevTools Performance Analysis Report");
    console.log("=======================================");

    console.log(`\n🎯 Summary:`);
    console.log(
      `  Health: ${this.getHealthEmoji(
        report.summary.overallHealth
      )} ${report.summary.overallHealth.toUpperCase()}`
    );
    console.log(
      `  Scenarios: ${report.summary.passedScenarios}/${report.summary.totalScenarios} passed`
    );
    console.log(
      `  Avg Load Time: ${report.summary.averageLoadTime.toFixed(0)}ms`
    );

    console.log(`\n📈 Scenario Performance:`);
    report.scenarios.forEach((s) => {
      const gradeEmoji = this.getGradeEmoji(s.grade);
      console.log(`  ${gradeEmoji} ${s.name}: Grade ${s.grade}`);
      console.log(
        `     Script: ${s.performance.scriptTime}ms | Layout: ${
          s.performance.layoutTime
        }ms | Memory: ${s.performance.memoryUsage.toFixed(1)}MB`
      );
    });

    const criticalInsights = report.insights.filter(
      (i) => i.type === "error" || i.type === "warning"
    );
    if (criticalInsights.length > 0) {
      console.log(`\n⚠️  Key Insights:`);
      criticalInsights.slice(0, 5).forEach((insight) => {
        const icon = insight.type === "error" ? "🔴" : "🟡";
        console.log(`  ${icon} ${insight.message}`);
        if (insight.suggestion) {
          console.log(`      💡 ${insight.suggestion}`);
        }
      });
    }

    if (report.baseline?.available) {
      console.log(`\n📊 Baseline Comparison:`);
      console.log(`  Status: ${report.baseline.summary}`);

      if (report.baseline.improvements.length > 0) {
        console.log(`  ✅ Improvements:`);
        report.baseline.improvements.forEach((i) => console.log(`     - ${i}`));
      }

      if (report.baseline.regressions.length > 0) {
        console.log(`  ❌ Regressions:`);
        report.baseline.regressions.forEach((r) => console.log(`     - ${r}`));
      }
    }

    console.log("\n✨ Analysis Complete!");
  }

  private getHealthEmoji(health: string): string {
    switch (health) {
      case "excellent":
        return "🟢";
      case "good":
        return "🔵";
      case "concerning":
        return "🟡";
      case "poor":
        return "🔴";
      default:
        return "⚪";
    }
  }

  private getGradeEmoji(grade: string): string {
    switch (grade) {
      case "A":
        return "🟢";
      case "B":
        return "🔵";
      case "C":
        return "🟡";
      case "D":
        return "🟠";
      case "F":
        return "🔴";
      default:
        return "⚪";
    }
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const options: AnalysisOptions = {};

  for (const arg of args) {
    if (arg.startsWith("--file=")) {
      options.inputFile = arg.split("=")[1];
    } else if (arg === "--compare-baseline") {
      options.compareBaseline = true;
    } else if (arg.startsWith("--output-dir=")) {
      options.outputDir = arg.split("=")[1];
    }
  }

  try {
    const analyzer = new DevToolsAnalyzer(options);
    await analyzer.analyze();
  } catch (error) {
    console.error("💥 Analysis failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { DevToolsAnalyzer };
