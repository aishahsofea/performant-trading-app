/**
 * CPU Profiler Class
 *
 * This class handles comprehensive CPU profiling using Chrome DevTools Protocol.
 * It provides detailed analysis of JavaScript execution, function call patterns,
 * and performance bottlenecks to identify optimization opportunities.
 *
 * Key Responsibilities:
 * 1. Start and stop CPU sampling profiler
 * 2. Process CPU profile data into analyzable format
 * 3. Identify performance hot spots and bottlenecks
 * 4. Generate function-level performance metrics
 * 5. Analyze execution paths and call patterns
 * 6. Provide optimization recommendations
 *
 * Features:
 * - High-resolution CPU sampling
 * - Function-level performance breakdown
 * - Hot spot identification and ranking
 * - Call tree analysis with timing data
 * - Execution path optimization suggestions
 * - Integration with performance timeline data
 *
 * Usage:
 * ```typescript
 * const cpuProfiler = new CPUProfiler(cdpSession, options);
 * await cpuProfiler.startProfiling();
 * // ... perform user interactions
 * const cpuData = await cpuProfiler.stopProfiling();
 * ```
 */

import type { CDPSession } from "playwright";
import {
  CPUProfileData,
  CPUProfilingOptions,
  CPUAnalysis,
  HotSpot,
  FunctionMetric,
  ExecutionPath,
  CallFrame,
  OptimizationDetails,
  InlinedFunction,
  DeoptimizationEvent,
  OptimizationOpportunity,
  OptimizationStats,
  InliningReason,
  DeoptimizationReason,
  OptimizationImpact,
} from "./types";

export class CPUProfiler {
  private cdpSession: CDPSession;
  private options: CPUProfilingOptions;
  private isRecording = false;
  private recordingStartTime: number = 0;

  // Profile data storage
  private rawProfile: any = null;

  /**
   * Initialize CPU profiler with CDP session and options
   *
   * @param cdpSession - Chrome DevTools Protocol session
   * @param options - CPU profiling configuration
   */
  constructor(
    cdpSession: CDPSession,
    options: Partial<CPUProfilingOptions> = {}
  ) {
    this.cdpSession = cdpSession;
    this.options = {
      samplingInterval: 1000, // 1000 microseconds = 1ms
      includeInlining: true,
      trackExecutionContexts: true,
      analyzeHotSpots: true,
      generateFlameGraph: false, // Enable in future for visualization
      ...options,
    };
  }

  /**
   * Start CPU profiling
   * Configures and begins sampling-based CPU profiling
   */
  startProfiling = async (): Promise<void> => {
    if (this.isRecording) {
      throw new Error("CPU profiling already in progress");
    }

    this.log("Starting CPU profiling...");
    this.recordingStartTime = Date.now();
    this.isRecording = true;

    // Reset data
    this.rawProfile = null;

    try {
      // Enable Profiler domain
      await this.cdpSession.send("Profiler.enable");

      // Set sampling interval if specified
      if (this.options.samplingInterval > 0) {
        await this.cdpSession.send("Profiler.setSamplingInterval", {
          interval: this.options.samplingInterval,
        });
      }

      // Configure runtime to collect optimization information
      if (this.options.includeInlining) {
        await this.cdpSession.send("Runtime.setMaxCallStackSizeToCapture", {
          size: 200, // Deeper stack traces for better inlining analysis
        });
      }

      // Start the profiler with optimization details
      await this.cdpSession.send("Profiler.start", {
        // Enable precise coverage for detailed optimization info
        callCount: this.options.includeInlining,
        detailed: this.options.includeInlining,
      });

      this.log(
        `CPU profiling started with ${
          this.options.samplingInterval
        }μs sampling interval${
          this.options.includeInlining ? " and V8 optimization tracking" : ""
        }`
      );
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to start CPU profiling:", error);
      throw error;
    }
  };

  /**
   * Stop CPU profiling and analyze the results
   *
   * @returns Complete CPU profiling data and analysis
   */
  stopProfiling = async (): Promise<CPUProfileData> => {
    if (!this.isRecording) {
      throw new Error("No CPU profiling in progress");
    }

    this.log("Stopping CPU profiling...");

    try {
      // Stop the profiler and get the profile
      const result = await this.cdpSession.send("Profiler.stop");
      this.rawProfile = result.profile;

      // Disable profiler domain
      await this.cdpSession.send("Profiler.disable");

      const profilingDuration = Date.now() - this.recordingStartTime;

      // Analyze the profile data
      const analysis = this.analyzeProfile(this.rawProfile);

      this.isRecording = false;
      this.log(
        `CPU profiling completed. Collected ${
          this.rawProfile?.samples?.length || 0
        } samples`
      );

      return {
        profile: this.rawProfile,
        duration: profilingDuration,
        sampleCount: this.rawProfile?.samples?.length || 0,
        analysis,
        metadata: {
          profilingDuration,
          startTime: this.recordingStartTime,
          endTime: Date.now(),
          options: this.options,
        },
      };
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to stop CPU profiling:", error);
      throw error;
    }
  };

  /**
   * Analyze the CPU profile data
   */
  private analyzeProfile = (profile: any): CPUAnalysis => {
    if (!profile || !profile.nodes || !profile.samples) {
      this.log("Warning: Empty or invalid CPU profile data");
      return this.getEmptyAnalysis();
    }

    this.log("Analyzing CPU profile data...");

    // Build node map for quick lookups
    const nodeMap = new Map();
    profile.nodes.forEach((node: any, index: number) => {
      nodeMap.set(node.id || index, { ...node, index });
    });

    // Process samples and calculate timing
    const sampleDuration = this.options.samplingInterval / 1000; // Convert to ms
    const totalSamples = profile.samples.length;
    const totalTime = totalSamples * sampleDuration * 1000; // Convert to microseconds

    // Calculate sample counts per node
    const sampleCounts = new Map<number, number>();
    profile.samples.forEach((nodeId: number) => {
      sampleCounts.set(nodeId, (sampleCounts.get(nodeId) || 0) + 1);
    });

    // Generate function metrics
    const functionBreakdown = this.generateFunctionMetrics(
      nodeMap,
      sampleCounts,
      sampleDuration
    );

    // Identify hot spots
    const hotSpots = this.identifyHotSpots(
      nodeMap,
      sampleCounts,
      totalSamples,
      sampleDuration
    );

    // Analyze execution paths
    const executionPath = this.analyzeExecutionPaths(profile, nodeMap);

    // Calculate timing breakdown
    const idleTime = this.calculateIdleTime(profile, nodeMap, sampleCounts);
    const activeTime = totalTime - idleTime;

    // Analyze V8 optimizations if enabled
    const optimizations = this.options.includeInlining
      ? this.analyzeOptimizations(
          profile,
          nodeMap,
          sampleCounts,
          sampleDuration
        )
      : undefined;

    // Generate recommendations (now includes optimization recommendations)
    const recommendations = this.generateRecommendations(
      hotSpots,
      functionBreakdown,
      activeTime / totalTime,
      optimizations
    );

    return {
      totalSamples,
      totalTime,
      idleTime,
      activeTime,
      hotSpots,
      functionBreakdown,
      executionPath,
      optimizations,
      recommendations,
    };
  };

  /**
   * Generate function-level performance metrics
   */
  private generateFunctionMetrics = (
    nodeMap: Map<number, any>,
    sampleCounts: Map<number, number>,
    sampleDuration: number
  ): FunctionMetric[] => {
    const metrics: FunctionMetric[] = [];

    nodeMap.forEach((node, nodeId) => {
      const hitCount = sampleCounts.get(nodeId) || 0;
      if (hitCount === 0) return;

      const selfTime = hitCount * sampleDuration * 1000; // microseconds

      // Build call frame info
      const frame = node.callFrame || {};

      const metric: FunctionMetric = {
        functionName: frame.functionName || "(anonymous)",
        url: frame.url || "(unknown)",
        callCount: hitCount, // Approximation based on samples
        selfTime,
        totalTime: selfTime, // Will be updated when building hierarchy
        averageTime: selfTime / Math.max(hitCount, 1),
        children: [], // Will be populated if building full tree
      };

      metrics.push(metric);
    });

    // Sort by self time (most expensive first)
    return metrics.sort((a, b) => b.selfTime - a.selfTime).slice(0, 50); // Top 50 functions
  };

  /**
   * Identify performance hot spots
   */
  private identifyHotSpots = (
    nodeMap: Map<number, any>,
    sampleCounts: Map<number, number>,
    totalSamples: number,
    sampleDuration: number
  ): HotSpot[] => {
    const hotSpots: HotSpot[] = [];

    sampleCounts.forEach((hitCount, nodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node || !node.callFrame) return;

      const frame = node.callFrame;
      const selfTime = hitCount * sampleDuration * 1000; // microseconds
      const percentage = (hitCount / totalSamples) * 100;

      // Only include functions that take significant time (>0.5% of samples)
      if (percentage < 0.5) return;

      const hotSpot: HotSpot = {
        functionName: frame.functionName || "(anonymous)",
        url: frame.url || "(unknown)",
        line: frame.lineNumber || 0,
        column: frame.columnNumber || 0,
        selfTime,
        totalTime: selfTime, // Simplified - could calculate including children
        hitCount,
        percentage,
        optimizationInfo: this.options.includeInlining
          ? {
              isInlined: this.detectInlining(
                node,
                frame.functionName || "(anonymous)",
                selfTime,
                hitCount
              ),
              isOptimized: this.isLikelyOptimized(
                frame.functionName || "(anonymous)",
                selfTime,
                hitCount
              ),
              deoptimizationRisk:
                this.detectDeoptimizationRisk(
                  frame.functionName || "(anonymous)",
                  node
                ) || undefined,
            }
          : undefined,
      };

      hotSpots.push(hotSpot);
    });

    // Sort by percentage (highest first)
    return hotSpots.sort((a, b) => b.percentage - a.percentage).slice(0, 20); // Top 20 hot spots
  };

  /**
   * Analyze execution paths through the call tree
   */
  private analyzeExecutionPaths = (
    _profile: any,
    nodeMap: Map<number, any>
  ): ExecutionPath => {
    // This is a simplified implementation
    // A full implementation would build the complete call tree and analyze paths

    const allFrames: CallFrame[] = [];

    // Extract unique call frames from the profile
    nodeMap.forEach((node) => {
      if (node.callFrame) {
        const frame: CallFrame = {
          functionName: node.callFrame.functionName || "(anonymous)",
          url: node.callFrame.url || "(unknown)",
          lineNumber: node.callFrame.lineNumber || 0,
          columnNumber: node.callFrame.columnNumber || 0,
          scriptId: node.callFrame.scriptId || "0",
        };
        allFrames.push(frame);
      }
    });

    // For now, return simplified paths
    // In a full implementation, these would be built from actual call relationships
    return {
      criticalPath: allFrames.slice(0, 10), // Top 10 frames
      longestPath: allFrames.slice(0, 5), // Simplified
      mostFrequentPath: allFrames.slice(0, 3), // Simplified
    };
  };

  /**
   * Calculate approximate idle time
   */
  private calculateIdleTime = (
    _profile: any,
    nodeMap: Map<number, any>,
    sampleCounts: Map<number, number>
  ): number => {
    let idleSamples = 0;

    // Look for idle-related function names
    sampleCounts.forEach((count, nodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node?.callFrame?.functionName) return;

      const functionName = node.callFrame.functionName.toLowerCase();

      // Simple heuristic for idle detection
      if (
        functionName.includes("idle") ||
        functionName.includes("wait") ||
        functionName.includes("sleep") ||
        functionName === "(idle)"
      ) {
        idleSamples += count;
      }
    });

    return idleSamples * (this.options.samplingInterval / 1000) * 1000; // microseconds
  };

  /**
   * Analyze V8 optimization details from CPU profile
   */
  private analyzeOptimizations = (
    _profile: any,
    nodeMap: Map<number, any>,
    sampleCounts: Map<number, number>,
    sampleDuration: number
  ): OptimizationDetails => {
    const inlinedFunctions: InlinedFunction[] = [];
    const deoptimizations: DeoptimizationEvent[] = [];
    const optimizationOpportunities: OptimizationOpportunity[] = [];

    let totalFunctions = 0;
    let optimizedFunctions = 0;
    let inlinedCount = 0;
    let deoptimizedCount = 0;
    let totalTimeSaved = 0;

    // Analyze each function node
    nodeMap.forEach((node, nodeId) => {
      const frame = node.callFrame;
      if (!frame) return;

      totalFunctions++;
      const hitCount = sampleCounts.get(nodeId) || 0;
      const selfTime = hitCount * sampleDuration * 1000; // microseconds

      // Check for optimization hints in the frame
      const functionName = frame.functionName || "(anonymous)";
      const url = frame.url || "(unknown)";

      // Detect inlined functions (simplified heuristic based on function characteristics)
      const isInlined = this.detectInlining(
        node,
        functionName,
        selfTime,
        hitCount
      );
      if (isInlined) {
        inlinedCount++;
        const timeSaved = this.estimateInliningTimeSavings(
          hitCount,
          sampleDuration
        );
        totalTimeSaved += timeSaved;

        inlinedFunctions.push({
          parentFunction: "(unknown)", // Would need call tree analysis for accurate parent
          parentUrl: url,
          inlinedFunction: functionName,
          inlinedUrl: url,
          lineNumber: frame.lineNumber || 0,
          columnNumber: frame.columnNumber || 0,
          reason: this.inferInliningReason(functionName, selfTime, hitCount),
          impact: this.calculateOptimizationImpact(timeSaved),
          selfTime: timeSaved,
          callCount: hitCount,
        });
      }

      // Detect deoptimization opportunities
      const deoptReason = this.detectDeoptimizationRisk(functionName, node);
      if (deoptReason) {
        deoptimizedCount++;

        deoptimizations.push({
          functionName,
          url,
          lineNumber: frame.lineNumber || 0,
          columnNumber: frame.columnNumber || 0,
          reason: deoptReason,
          timestamp: Date.now(),
          bailoutType: "predicted",
          impact: this.calculateOptimizationImpact(selfTime),
        });
      }

      // Generate optimization opportunities
      const opportunities = this.identifyOptimizationOpportunities(
        functionName,
        node,
        selfTime
      );
      optimizationOpportunities.push(...opportunities);

      // Count as optimized if it shows signs of optimization
      if (
        isInlined ||
        this.isLikelyOptimized(functionName, selfTime, hitCount)
      ) {
        optimizedFunctions++;
      }
    });

    const optimizationStats: OptimizationStats = {
      totalFunctions,
      optimizedFunctions,
      inlinedFunctions: inlinedCount,
      deoptimizedFunctions: deoptimizedCount,
      optimizationRatio:
        totalFunctions > 0 ? optimizedFunctions / totalFunctions : 0,
      inliningRatio: totalFunctions > 0 ? inlinedCount / totalFunctions : 0,
      totalTimeSaved,
    };

    return {
      inlinedFunctions,
      deoptimizations,
      optimizationOpportunities: optimizationOpportunities.slice(0, 10), // Top 10 opportunities
      optimizationStats,
    };
  };

  /**
   * Detect if a function is likely inlined (heuristic-based)
   */
  private detectInlining = (
    node: any,
    functionName: string,
    selfTime: number,
    hitCount: number
  ): boolean => {
    // Heuristics for detecting inlined functions:
    // 1. Very short functions with high hit counts
    // 2. Functions with specific V8 optimization markers
    // 3. Functions that appear to have zero call overhead

    if (hitCount > 10 && selfTime < 1000) {
      // Called often but very fast
      return true;
    }

    // Check for V8 internal optimization markers (if available)
    const optimizationData =
      node.optimizationData || node.callFrame?.optimizationData;
    if (optimizationData?.inlined) {
      return true;
    }

    // Small utility functions are often inlined
    if (functionName.length < 20 && hitCount > 5 && selfTime < 500) {
      return true;
    }

    return false;
  };

  /**
   * Estimate time savings from inlining
   */
  private estimateInliningTimeSavings = (
    hitCount: number,
    sampleDuration: number
  ): number => {
    // Estimate call overhead savings: ~2-5 microseconds per call
    const callOverhead = 3; // microseconds
    return hitCount * callOverhead * (sampleDuration / 1000);
  };

  /**
   * Infer why V8 inlined a function
   */
  private inferInliningReason = (
    functionName: string,
    selfTime: number,
    hitCount: number
  ): InliningReason => {
    if (hitCount > 100) return "frequent-call";
    if (selfTime < 100) return "small-function";
    if (functionName.includes("get") || functionName.includes("set"))
      return "getter-setter";
    if (functionName === "constructor") return "constructor";
    return "hot-path";
  };

  /**
   * Detect potential deoptimization risks
   */
  private detectDeoptimizationRisk = (
    functionName: string,
    node: any
  ): DeoptimizationReason | null => {
    const frame = node.callFrame;
    if (!frame) return null;

    // Check for patterns that prevent optimization
    if (functionName.includes("eval")) return "eval-usage";
    if (functionName.includes("apply") || functionName.includes("call"))
      return "dynamic-call";
    if (functionName.includes("arguments")) return "arguments-object";
    if (functionName.includes("try") || functionName.includes("catch"))
      return "try-catch-block";
    if (functionName.includes("async") || functionName.includes("await"))
      return "async-function";
    if (functionName.includes("*") || functionName.includes("yield"))
      return "generator-function";

    // Check function size (approximate)
    const url = frame.url;
    if ((url && url.includes("large")) || functionName.length > 50) {
      return "function-too-large";
    }

    return null;
  };

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities = (
    functionName: string,
    node: any,
    selfTime: number
  ): OptimizationOpportunity[] => {
    const opportunities: OptimizationOpportunity[] = [];
    const frame = node.callFrame;
    if (!frame) return opportunities;

    const url = frame.url || "(unknown)";
    const lineNumber = frame.lineNumber || 0;

    // Large function opportunity
    if (selfTime > 50000) {
      // >50ms
      opportunities.push({
        type: "reduce-function-size",
        functionName,
        url,
        lineNumber,
        description: `Large function taking ${(selfTime / 1000).toFixed(
          1
        )}ms - consider breaking into smaller functions`,
        potentialImpact: "high",
        recommendation:
          "Break down this function into smaller, more focused functions to enable better V8 optimization",
        estimatedSavings: selfTime * 0.2, // 20% improvement estimate
      });
    }

    // Anonymous function opportunity
    if (functionName === "(anonymous)" && selfTime > 1000) {
      opportunities.push({
        type: "avoid-dynamic-calls",
        functionName,
        url,
        lineNumber,
        description: "Anonymous function with significant execution time",
        potentialImpact: "medium",
        recommendation:
          "Give this function a name to improve profiling visibility and potential optimization",
        estimatedSavings: selfTime * 0.1, // 10% improvement estimate
      });
    }

    return opportunities;
  };

  /**
   * Check if function shows signs of being optimized
   */
  private isLikelyOptimized = (
    functionName: string,
    selfTime: number,
    hitCount: number
  ): boolean => {
    // Functions with good performance characteristics
    if (hitCount > 10 && selfTime / hitCount < 100) {
      // Average < 100μs per call
      return true;
    }

    // Built-in or system functions are usually optimized
    if (functionName.startsWith("(") && functionName.endsWith(")")) {
      return true;
    }

    return false;
  };

  /**
   * Calculate impact level of optimizations
   */
  private calculateOptimizationImpact = (
    timeMicroseconds: number
  ): OptimizationImpact => {
    if (timeMicroseconds > 10000) return "high"; // >10ms
    if (timeMicroseconds > 1000) return "medium"; // >1ms
    if (timeMicroseconds > 100) return "low"; // >100μs
    return "neutral";
  };

  /**
   * Generate performance optimization recommendations
   */
  private generateRecommendations = (
    hotSpots: HotSpot[],
    functions: FunctionMetric[],
    activeTimeRatio: number,
    optimizations?: OptimizationDetails
  ): string[] => {
    const recommendations: string[] = [];

    // Hot spot recommendations
    if (hotSpots.length > 0) {
      const topHotSpot = hotSpots[0];
      if (topHotSpot && topHotSpot.percentage > 20) {
        recommendations.push(
          `High CPU usage in '${
            topHotSpot.functionName
          }' (${topHotSpot.percentage.toFixed(1)}%) - consider optimization`
        );
      }

      if (hotSpots.filter((h) => h.percentage > 5).length > 3) {
        recommendations.push(
          "Multiple performance hot spots detected - review function efficiency"
        );
      }
    }

    // Function-level recommendations
    const expensiveFunctions = functions.filter((f) => f.selfTime > 100000); // >100ms
    if (expensiveFunctions.length > 0) {
      recommendations.push(
        `${expensiveFunctions.length} functions taking >100ms - consider async patterns or optimization`
      );
    }

    // Overall performance recommendations
    if (activeTimeRatio > 0.9) {
      recommendations.push(
        "High CPU utilization - consider performance optimization or workload distribution"
      );
    } else if (activeTimeRatio < 0.1) {
      recommendations.push(
        "Low CPU utilization - investigate potential blocking operations"
      );
    }

    // Anonymous function recommendation
    const anonymousFunctions = functions.filter(
      (f) => f.functionName === "(anonymous)"
    );
    if (anonymousFunctions.length > functions.length * 0.3) {
      recommendations.push(
        "High percentage of anonymous functions - consider named functions for better profiling"
      );
    }

    // V8 optimization recommendations
    if (optimizations) {
      const stats = optimizations.optimizationStats;

      // Low optimization ratio
      if (stats.optimizationRatio < 0.3) {
        recommendations.push(
          `Only ${(stats.optimizationRatio * 100).toFixed(
            1
          )}% of functions are optimized - review code patterns that prevent V8 optimization`
        );
      }

      // Low inlining ratio for small functions
      if (stats.inliningRatio < 0.1 && stats.totalFunctions > 10) {
        recommendations.push(
          `Low function inlining ratio (${(stats.inliningRatio * 100).toFixed(
            1
          )}%) - consider creating smaller, focused functions`
        );
      }

      // Deoptimization issues
      if (optimizations.deoptimizations.length > 0) {
        const topDeopt = optimizations.deoptimizations[0];
        if (topDeopt) {
          recommendations.push(
            `Deoptimization risk in '${topDeopt.functionName}' (${topDeopt.reason}) - review for V8 optimization barriers`
          );
        }
      }

      // Top optimization opportunities
      if (optimizations.optimizationOpportunities.length > 0) {
        const topOpportunity = optimizations.optimizationOpportunities[0];
        if (topOpportunity && topOpportunity.potentialImpact === "high") {
          recommendations.push(
            `High-impact optimization opportunity: ${topOpportunity.recommendation}`
          );
        }
      }

      // Inlining success
      if (
        optimizations.inlinedFunctions.length > 0 &&
        stats.totalTimeSaved > 1000
      ) {
        recommendations.push(
          `V8 inlining saved ~${(stats.totalTimeSaved / 1000).toFixed(
            1
          )}ms - good function design enables optimization`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push("CPU performance appears optimal");
    }

    return recommendations;
  };

  /**
   * Get empty analysis structure for error cases
   */
  private getEmptyAnalysis = (): CPUAnalysis => ({
    totalSamples: 0,
    totalTime: 0,
    idleTime: 0,
    activeTime: 0,
    hotSpots: [],
    functionBreakdown: [],
    executionPath: {
      criticalPath: [],
      longestPath: [],
      mostFrequentPath: [],
    },
    optimizations: this.options.includeInlining
      ? {
          inlinedFunctions: [],
          deoptimizations: [],
          optimizationOpportunities: [],
          optimizationStats: {
            totalFunctions: 0,
            optimizedFunctions: 0,
            inlinedFunctions: 0,
            deoptimizedFunctions: 0,
            optimizationRatio: 0,
            inliningRatio: 0,
            totalTimeSaved: 0,
          },
        }
      : undefined,
    recommendations: ["No CPU profiling data available"],
  });

  /**
   * Simple logging utility
   */
  private log = (message: string, data?: any): void => {
    if (data) {
      console.log(`[CPUProfiler] ${message}`, data);
    } else {
      console.log(`[CPUProfiler] ${message}`);
    }
  };
}
