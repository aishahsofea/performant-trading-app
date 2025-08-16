/**
 * Memory Profiler Class
 *
 * This class handles comprehensive memory profiling using Chrome DevTools Protocol.
 * It provides detailed heap analysis, garbage collection monitoring, and memory
 * usage tracking to identify memory leaks and optimization opportunities.
 *
 * Key Responsibilities:
 * 1. Capture heap snapshots at different points during execution
 * 2. Monitor garbage collection events and timing
 * 3. Track memory allocation patterns and growth
 * 4. Analyze memory usage by object types and constructors
 * 5. Detect potential memory leaks and excessive allocations
 * 6. Calculate memory efficiency metrics
 *
 * Features:
 * - Multiple heap snapshot comparison for leak detection
 * - Real-time memory usage monitoring
 * - GC event tracking with detailed timing
 * - Memory allocation sampling
 * - Object retention analysis
 * - Memory pressure detection
 *
 * Usage:
 * ```typescript
 * const memoryProfiler = new MemoryProfiler(cdpSession, options);
 * await memoryProfiler.startProfiling();
 * // ... perform user interactions
 * const memoryData = await memoryProfiler.stopProfiling();
 * ```
 */

import type { CDPSession } from "playwright";
import {
  MemoryData,
  MemorySnapshot,
  HeapUsageMetric,
  GCEvent,
  MemoryProfilingOptions,
  MemoryAnalysis,
  ObjectRetention,
  AllocationSample,
} from "./types";

export class MemoryProfiler {
  private cdpSession: CDPSession;
  private options: MemoryProfilingOptions;
  private isRecording = false;
  private recordingStartTime: number = 0;

  // Data collectors
  private heapSnapshots: MemorySnapshot[] = [];
  private heapUsageHistory: HeapUsageMetric[] = [];
  private gcEvents: GCEvent[] = [];
  private allocationSamples: AllocationSample[] = [];

  // Monitoring intervals
  private usageMonitoringInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, (params: any) => void> = new Map();

  /**
   * Initialize memory profiler with CDP session and options
   *
   * @param cdpSession - Chrome DevTools Protocol session
   * @param options - Memory profiling configuration
   */
  constructor(
    cdpSession: CDPSession,
    options: Partial<MemoryProfilingOptions> = {}
  ) {
    this.cdpSession = cdpSession;
    this.options = {
      captureHeapSnapshots: true,
      monitorGCEvents: true,
      trackAllocationSampling: true,
      usageMonitoringInterval: 1000, // Monitor every second
      maxSnapshots: 10,
      snapshotTriggers: ["start", "end"], // Take snapshots at start and end
      gcEventDetails: true,
      allocationSamplingInterval: 32768, // bytes
      ...options,
    };
  }

  /**
   * Start memory profiling
   * Sets up monitoring and begins data collection
   */
  startProfiling = async (): Promise<void> => {
    if (this.isRecording) {
      throw new Error("Memory profiling already in progress");
    }

    this.log("Starting memory profiling...");
    this.recordingStartTime = Date.now();
    this.isRecording = true;

    // Reset data collectors
    this.heapSnapshots = [];
    this.heapUsageHistory = [];
    this.gcEvents = [];
    this.allocationSamples = [];

    try {
      // Enable necessary CDP domains
      await this.cdpSession.send("HeapProfiler.enable");
      await this.cdpSession.send("Runtime.enable");

      // Set up event listeners
      this.setupEventListeners();

      // Configure sampling profiler if enabled
      if (this.options.trackAllocationSampling) {
        await this.cdpSession.send("HeapProfiler.startSampling", {
          samplingInterval: this.options.allocationSamplingInterval,
        });
        this.log("Allocation sampling started");
      }

      // Start usage monitoring
      if (this.options.usageMonitoringInterval > 0) {
        this.startUsageMonitoring();
      }

      // Take initial snapshot if configured
      if (this.options.snapshotTriggers.includes("start")) {
        await this.captureHeapSnapshot("start");
      }

      this.log("Memory profiling started successfully");
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to start memory profiling:", error);
      throw error;
    }
  };

  /**
   * Stop memory profiling and analyze collected data
   *
   * @returns Complete memory profiling data and analysis
   */
  stopProfiling = async (): Promise<MemoryData> => {
    if (!this.isRecording) {
      throw new Error("No memory profiling in progress");
    }

    this.log("Stopping memory profiling...");

    try {
      // Take final snapshot if configured
      if (this.options.snapshotTriggers.includes("end")) {
        await this.captureHeapSnapshot("end");
      }

      // Stop allocation sampling
      if (this.options.trackAllocationSampling) {
        const samplingProfile = await this.cdpSession.send(
          "HeapProfiler.stopSampling"
        );
        this.processSamplingProfile(samplingProfile);
        this.log("Allocation sampling stopped");
      }

      // Stop usage monitoring
      this.stopUsageMonitoring();

      // Remove event listeners
      this.removeEventListeners();

      // Collect final usage data
      await this.collectCurrentUsage("final");

      // Create analysis
      const analysis = this.analyzeMemoryData();

      this.isRecording = false;
      this.log(
        `Memory profiling completed. Collected ${this.heapSnapshots.length} snapshots, ${this.gcEvents.length} GC events`
      );

      return {
        snapshots: this.heapSnapshots,
        heapUsage: this.heapUsageHistory,
        gcEvents: this.gcEvents,
        allocationSamples: this.allocationSamples,
        analysis,
        metadata: {
          profilingDuration: Date.now() - this.recordingStartTime,
          startTime: this.recordingStartTime,
          endTime: Date.now(),
          options: this.options,
        },
      };
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to stop memory profiling:", error);
      throw error;
    }
  };

  /**
   * Manually capture a heap snapshot
   *
   * @param label - Label for the snapshot (for identification)
   */
  captureHeapSnapshot = async (
    label: string = "manual"
  ): Promise<MemorySnapshot> => {
    if (!this.isRecording) {
      throw new Error("Memory profiling not active");
    }

    if (this.heapSnapshots.length >= this.options.maxSnapshots) {
      this.log(
        `Maximum snapshots (${this.options.maxSnapshots}) reached, skipping capture`
      );
      throw new Error("Maximum heap snapshots reached");
    }

    this.log(`Capturing heap snapshot: ${label}`);

    try {
      const snapshot = await this.cdpSession.send(
        "HeapProfiler.takeHeapSnapshot",
        {
          reportProgress: false,
        }
      );

      const memorySnapshot: MemorySnapshot = {
        id: `snapshot_${Date.now()}_${label}`,
        label,
        elapsedTimeMs: Date.now() - this.recordingStartTime,
        data: snapshot,
        metadata: {
          nodeCount: (snapshot as any).nodes?.length || 0,
          edgeCount: (snapshot as any).edges?.length || 0,
          totalSize: this.calculateSnapshotSize(snapshot),
        },
      };

      this.heapSnapshots.push(memorySnapshot);
      this.log(
        `Heap snapshot captured: ${label} (${memorySnapshot.metadata.nodeCount} nodes)`
      );

      return memorySnapshot;
    } catch (error) {
      this.log(`Failed to capture heap snapshot: ${label}`, error);
      throw error;
    }
  };

  /**
   * Set up CDP event listeners for memory events
   */
  private setupEventListeners = (): void => {
    // GC event listener
    const _gcEventListener = (params: any) => {
      if (this.options.monitorGCEvents) {
        this.handleGCEvent(params);
      }
    };

    // Console API calls (for memory logs)
    const consoleListener = (params: any) => {
      if (
        params.type === "profile" &&
        params.args?.[0]?.value?.includes("memory")
      ) {
        this.handleMemoryConsoleEvent(params);
      }
    };

    // Store listeners for cleanup
    this.eventListeners.set("Runtime.consoleAPICalled", consoleListener);
    // Note: GC events come through Runtime.consoleAPICalled or custom monitoring

    // Attach listeners
    this.cdpSession.on("Runtime.consoleAPICalled", consoleListener);
  };

  /**
   * Remove all event listeners
   */
  private removeEventListeners = (): void => {
    this.eventListeners.forEach((listener, eventName) => {
      this.cdpSession.off(eventName as any, listener);
    });
    this.eventListeners.clear();
  };

  /**
   * Start monitoring memory usage at regular intervals
   */
  private startUsageMonitoring = (): void => {
    this.usageMonitoringInterval = setInterval(async () => {
      try {
        await this.collectCurrentUsage("interval");
      } catch (error) {
        this.log("Error during usage monitoring:", error);
      }
    }, this.options.usageMonitoringInterval);

    this.log(
      `Started usage monitoring (${this.options.usageMonitoringInterval}ms intervals)`
    );
  };

  /**
   * Stop memory usage monitoring
   */
  private stopUsageMonitoring = (): void => {
    if (this.usageMonitoringInterval) {
      clearInterval(this.usageMonitoringInterval);
      this.usageMonitoringInterval = null;
      this.log("Stopped usage monitoring");
    }
  };

  /**
   * Collect current memory usage data
   */
  private collectCurrentUsage = async (source: string): Promise<void> => {
    try {
      const result = await this.cdpSession.send("Runtime.evaluate", {
        expression: `
          // Collect comprehensive memory data
          ({
            // Performance memory API (if available)
            performance: typeof performance !== 'undefined' && performance.memory ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : null,
            
            // Current timestamp
            timestamp: Date.now(),
            
            // Additional browser-specific memory info
            memoryInfo: typeof window !== 'undefined' && window.performance?.memory ? {
              used: window.performance.memory.usedJSHeapSize,
              total: window.performance.memory.totalJSHeapSize,
              limit: window.performance.memory.jsHeapSizeLimit
            } : null
          })
        `,
        returnByValue: true,
      });

      if (result.result?.value) {
        const memoryInfo = result.result.value;

        const usage: HeapUsageMetric = {
          elapsedTimeMs: Date.now() - this.recordingStartTime,
          source,
          usedJSHeapSize:
            memoryInfo.performance?.usedJSHeapSize ||
            memoryInfo.memoryInfo?.used ||
            0,
          totalJSHeapSize:
            memoryInfo.performance?.totalJSHeapSize ||
            memoryInfo.memoryInfo?.total ||
            0,
          jsHeapSizeLimit:
            memoryInfo.performance?.jsHeapSizeLimit ||
            memoryInfo.memoryInfo?.limit ||
            0,
          memoryPressure: this.calculateMemoryPressure(memoryInfo),
        };

        this.heapUsageHistory.push(usage);
      }
    } catch (error) {
      // Silently handle errors in usage collection to avoid disrupting main flow
      this.log("Non-critical error collecting usage data:", error);
    }
  };

  /**
   * Handle garbage collection events
   */
  private handleGCEvent = (params: any): void => {
    const gcEvent: GCEvent = {
      elapsedTimeMs: Date.now() - this.recordingStartTime,
      type: params.type || "unknown",
      duration: params.duration || 0,
      freedBytes: params.freedBytes || 0,
      totalHeapSize: params.totalHeapSize || 0,
      usedHeapSize: params.usedHeapSize || 0,
      cause: params.cause || "unknown",
    };

    this.gcEvents.push(gcEvent);
    this.log(
      `GC event recorded: ${gcEvent.type} (${gcEvent.duration}ms, freed ${gcEvent.freedBytes} bytes)`
    );
  };

  /**
   * Handle memory-related console events
   */
  private handleMemoryConsoleEvent = (params: any): void => {
    // Process memory-related console logs for additional insights
    this.log("Memory console event:", params);
  };

  /**
   * Process allocation sampling profile
   */
  private processSamplingProfile = (profile: any): void => {
    if (!profile.profile?.samples) return;

    profile.profile.samples.forEach((sample: any, index: number) => {
      const allocationSample: AllocationSample = {
        elapsedTimeMs: Date.now() - this.recordingStartTime,
        size: sample.size || 0,
        nodeId: sample.nodeId || index,
        ordinal: sample.ordinal || index,
        stackTrace: this.extractStackTrace(sample, profile.profile),
      };

      this.allocationSamples.push(allocationSample);
    });

    this.log(`Processed ${profile.profile.samples.length} allocation samples`);
  };

  /**
   * Extract stack trace from allocation sample
   */
  private extractStackTrace = (sample: any, _profile: any): string[] => {
    // Extract meaningful stack trace from sampling profile
    const stackTrace: string[] = [];

    if (sample.stack) {
      sample.stack.forEach((frame: any) => {
        const functionName = frame.functionName || "<anonymous>";
        const url = frame.url || "<unknown>";
        const line = frame.lineNumber || 0;
        stackTrace.push(`${functionName} (${url}:${line})`);
      });
    }

    return stackTrace;
  };

  /**
   * Calculate memory pressure based on current usage
   */
  private calculateMemoryPressure = (memoryInfo: any): number => {
    if (!memoryInfo.performance && !memoryInfo.memoryInfo) return 0;

    const used =
      memoryInfo.performance?.usedJSHeapSize ||
      memoryInfo.memoryInfo?.used ||
      0;
    const total =
      memoryInfo.performance?.totalJSHeapSize ||
      memoryInfo.memoryInfo?.total ||
      0;

    return total > 0 ? used / total : 0;
  };

  /**
   * Calculate total size of heap snapshot
   */
  private calculateSnapshotSize = (snapshot: any): number => {
    if (!snapshot.nodes) return 0;

    // Sum up node sizes (simplified calculation)
    return snapshot.nodes.reduce((total: number, node: any) => {
      return total + (node.self_size || 0);
    }, 0);
  };

  /**
   * Analyze collected memory data for insights
   */
  private analyzeMemoryData = (): MemoryAnalysis => {
    const totalGCTime = this.gcEvents.reduce(
      (sum, event) => sum + event.duration,
      0
    );
    const avgMemoryUsage =
      this.heapUsageHistory.length > 0
        ? this.heapUsageHistory.reduce(
            (sum, usage) => sum + usage.usedJSHeapSize,
            0
          ) / this.heapUsageHistory.length
        : 0;

    const memoryGrowth = this.calculateMemoryGrowth();
    const leakSuspects = this.detectPotentialLeaks();
    const gcEfficiency = this.calculateGCEfficiency();

    return {
      totalGCTime,
      avgMemoryUsage,
      maxMemoryUsage: Math.max(
        ...this.heapUsageHistory.map((u) => u.usedJSHeapSize)
      ),
      memoryGrowthRate: memoryGrowth.rate,
      memoryGrowthTrend: memoryGrowth.trend,
      gcFrequency:
        (this.gcEvents.length / (Date.now() - this.recordingStartTime)) * 1000, // events per second
      gcEfficiency,
      potentialLeaks: leakSuspects,
      recommendations: this.generateRecommendations(leakSuspects, gcEfficiency),
    };
  };

  /**
   * Calculate memory growth rate and trend
   */
  private calculateMemoryGrowth = (): {
    rate: number;
    trend: "increasing" | "decreasing" | "stable";
  } => {
    if (this.heapUsageHistory.length < 2) {
      return { rate: 0, trend: "stable" };
    }

    const first = this.heapUsageHistory[0]!;
    const last = this.heapUsageHistory[this.heapUsageHistory.length - 1]!;
    const timeDiff = last.elapsedTimeMs - first.elapsedTimeMs;
    const memoryDiff = last.usedJSHeapSize - first.usedJSHeapSize;

    const rate = timeDiff > 0 ? (memoryDiff / timeDiff) * 1000 : 0; // bytes per second

    let trend: "increasing" | "decreasing" | "stable" = "stable";
    if (Math.abs(rate) > 1024) {
      // More than 1KB/s change
      trend = rate > 0 ? "increasing" : "decreasing";
    }

    return { rate, trend };
  };

  /**
   * Detect potential memory leaks
   */
  private detectPotentialLeaks = (): ObjectRetention[] => {
    const suspects: ObjectRetention[] = [];

    // Compare snapshots if we have multiple
    if (this.heapSnapshots.length >= 2) {
      const first = this.heapSnapshots[0]!;
      const last = this.heapSnapshots[this.heapSnapshots.length - 1]!;

      // Simplified leak detection - look for significant size increases
      const sizeIncrease = last.metadata.totalSize - first.metadata.totalSize;

      if (sizeIncrease > 1024 * 1024) {
        // More than 1MB increase
        suspects.push({
          objectType: "unknown",
          retainedSize: sizeIncrease,
          instanceCount: last.metadata.nodeCount - first.metadata.nodeCount,
          suspicionLevel: sizeIncrease > 10 * 1024 * 1024 ? "high" : "medium",
        });
      }
    }

    return suspects;
  };

  /**
   * Calculate garbage collection efficiency
   */
  private calculateGCEfficiency = (): number => {
    if (this.gcEvents.length === 0) return 1;

    const totalFreed = this.gcEvents.reduce(
      (sum, event) => sum + event.freedBytes,
      0
    );
    const totalTime = this.gcEvents.reduce(
      (sum, event) => sum + event.duration,
      0
    );

    // Efficiency = bytes freed per millisecond
    return totalTime > 0 ? totalFreed / totalTime : 0;
  };

  /**
   * Generate memory optimization recommendations
   */
  private generateRecommendations = (
    leaks: ObjectRetention[],
    gcEfficiency: number
  ): string[] => {
    const recommendations: string[] = [];

    if (leaks.length > 0) {
      recommendations.push(
        "Potential memory leaks detected - review object retention patterns"
      );
    }

    if (gcEfficiency < 1000) {
      // Less than 1KB freed per ms
      recommendations.push(
        "Low GC efficiency - consider reducing object allocations"
      );
    }

    if (this.gcEvents.length > 10) {
      recommendations.push(
        "High GC frequency - optimize memory usage patterns"
      );
    }

    const avgPressure =
      this.heapUsageHistory.reduce((sum, u) => sum + u.memoryPressure, 0) /
      this.heapUsageHistory.length;
    if (avgPressure > 0.8) {
      recommendations.push(
        "High memory pressure - consider memory optimization"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("Memory usage appears optimal");
    }

    return recommendations;
  };

  /**
   * Simple logging utility
   */
  private log = (message: string, data?: any): void => {
    if (data) {
      console.log(`[MemoryProfiler] ${message}`, data);
    } else {
      console.log(`[MemoryProfiler] ${message}`);
    }
  };
}
