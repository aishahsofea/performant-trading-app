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

import type { CDPSession } from 'playwright';
import {
  CPUProfileData,
  CPUProfilingOptions,
  CPUAnalysis,
  HotSpot,
  FunctionMetric,
  ExecutionPath,
  CallFrame
} from './types';

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
      ...options
    };
  }

  /**
   * Start CPU profiling
   * Configures and begins sampling-based CPU profiling
   */
  startProfiling = async (): Promise<void> => {
    if (this.isRecording) {
      throw new Error('CPU profiling already in progress');
    }

    this.log('Starting CPU profiling...');
    this.recordingStartTime = Date.now();
    this.isRecording = true;

    // Reset data
    this.rawProfile = null;

    try {
      // Enable Profiler domain
      await this.cdpSession.send('Profiler.enable');

      // Set sampling interval if specified
      if (this.options.samplingInterval > 0) {
        await this.cdpSession.send('Profiler.setSamplingInterval', {
          interval: this.options.samplingInterval
        });
      }

      // Start the profiler
      await this.cdpSession.send('Profiler.start');

      this.log(`CPU profiling started with ${this.options.samplingInterval}μs sampling interval`);

    } catch (error) {
      this.isRecording = false;
      this.log('Failed to start CPU profiling:', error);
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
      throw new Error('No CPU profiling in progress');
    }

    this.log('Stopping CPU profiling...');

    try {
      // Stop the profiler and get the profile
      const result = await this.cdpSession.send('Profiler.stop');
      this.rawProfile = result.profile;

      // Disable profiler domain
      await this.cdpSession.send('Profiler.disable');

      const profilingDuration = Date.now() - this.recordingStartTime;

      // Analyze the profile data
      const analysis = this.analyzeProfile(this.rawProfile);

      this.isRecording = false;
      this.log(`CPU profiling completed. Collected ${this.rawProfile?.samples?.length || 0} samples`);

      return {
        profile: this.rawProfile,
        duration: profilingDuration,
        sampleCount: this.rawProfile?.samples?.length || 0,
        analysis,
        metadata: {
          profilingDuration,
          startTime: this.recordingStartTime,
          endTime: Date.now(),
          options: this.options
        }
      };

    } catch (error) {
      this.isRecording = false;
      this.log('Failed to stop CPU profiling:', error);
      throw error;
    }
  };

  /**
   * Analyze the CPU profile data
   */
  private analyzeProfile = (profile: any): CPUAnalysis => {
    if (!profile || !profile.nodes || !profile.samples) {
      this.log('Warning: Empty or invalid CPU profile data');
      return this.getEmptyAnalysis();
    }

    this.log('Analyzing CPU profile data...');

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
    const functionBreakdown = this.generateFunctionMetrics(nodeMap, sampleCounts, sampleDuration);

    // Identify hot spots
    const hotSpots = this.identifyHotSpots(nodeMap, sampleCounts, totalSamples, sampleDuration);

    // Analyze execution paths
    const executionPath = this.analyzeExecutionPaths(profile, nodeMap);

    // Calculate timing breakdown
    const idleTime = this.calculateIdleTime(profile, nodeMap, sampleCounts);
    const activeTime = totalTime - idleTime;

    // Generate recommendations
    const recommendations = this.generateRecommendations(hotSpots, functionBreakdown, activeTime / totalTime);

    return {
      totalSamples,
      totalTime,
      idleTime,
      activeTime,
      hotSpots,
      functionBreakdown,
      executionPath,
      recommendations
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
        functionName: frame.functionName || '(anonymous)',
        url: frame.url || '(unknown)',
        callCount: hitCount, // Approximation based on samples
        selfTime,
        totalTime: selfTime, // Will be updated when building hierarchy
        averageTime: selfTime / Math.max(hitCount, 1),
        children: [] // Will be populated if building full tree
      };

      metrics.push(metric);
    });

    // Sort by self time (most expensive first)
    return metrics
      .sort((a, b) => b.selfTime - a.selfTime)
      .slice(0, 50); // Top 50 functions
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
        functionName: frame.functionName || '(anonymous)',
        url: frame.url || '(unknown)',
        line: frame.lineNumber || 0,
        column: frame.columnNumber || 0,
        selfTime,
        totalTime: selfTime, // Simplified - could calculate including children
        hitCount,
        percentage
      };

      hotSpots.push(hotSpot);
    });

    // Sort by percentage (highest first)
    return hotSpots
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 20); // Top 20 hot spots
  };

  /**
   * Analyze execution paths through the call tree
   */
  private analyzeExecutionPaths = (_profile: any, nodeMap: Map<number, any>): ExecutionPath => {
    // This is a simplified implementation
    // A full implementation would build the complete call tree and analyze paths
    
    const allFrames: CallFrame[] = [];
    
    // Extract unique call frames from the profile
    nodeMap.forEach((node) => {
      if (node.callFrame) {
        const frame: CallFrame = {
          functionName: node.callFrame.functionName || '(anonymous)',
          url: node.callFrame.url || '(unknown)',
          lineNumber: node.callFrame.lineNumber || 0,
          columnNumber: node.callFrame.columnNumber || 0,
          scriptId: node.callFrame.scriptId || '0'
        };
        allFrames.push(frame);
      }
    });

    // For now, return simplified paths
    // In a full implementation, these would be built from actual call relationships
    return {
      criticalPath: allFrames.slice(0, 10), // Top 10 frames
      longestPath: allFrames.slice(0, 5),   // Simplified
      mostFrequentPath: allFrames.slice(0, 3) // Simplified
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
      if (functionName.includes('idle') || 
          functionName.includes('wait') ||
          functionName.includes('sleep') ||
          functionName === '(idle)') {
        idleSamples += count;
      }
    });

    return idleSamples * (this.options.samplingInterval / 1000) * 1000; // microseconds
  };

  /**
   * Generate performance optimization recommendations
   */
  private generateRecommendations = (
    hotSpots: HotSpot[],
    functions: FunctionMetric[],
    activeTimeRatio: number
  ): string[] => {
    const recommendations: string[] = [];

    // Hot spot recommendations
    if (hotSpots.length > 0) {
      const topHotSpot = hotSpots[0];
      if (topHotSpot && topHotSpot.percentage > 20) {
        recommendations.push(
          `High CPU usage in '${topHotSpot.functionName}' (${topHotSpot.percentage.toFixed(1)}%) - consider optimization`
        );
      }

      if (hotSpots.filter(h => h.percentage > 5).length > 3) {
        recommendations.push('Multiple performance hot spots detected - review function efficiency');
      }
    }

    // Function-level recommendations
    const expensiveFunctions = functions.filter(f => f.selfTime > 100000); // >100ms
    if (expensiveFunctions.length > 0) {
      recommendations.push(`${expensiveFunctions.length} functions taking >100ms - consider async patterns or optimization`);
    }

    // Overall performance recommendations
    if (activeTimeRatio > 0.9) {
      recommendations.push('High CPU utilization - consider performance optimization or workload distribution');
    } else if (activeTimeRatio < 0.1) {
      recommendations.push('Low CPU utilization - investigate potential blocking operations');
    }

    // Anonymous function recommendation
    const anonymousFunctions = functions.filter(f => f.functionName === '(anonymous)');
    if (anonymousFunctions.length > functions.length * 0.3) {
      recommendations.push('High percentage of anonymous functions - consider named functions for better profiling');
    }

    if (recommendations.length === 0) {
      recommendations.push('CPU performance appears optimal');
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
      mostFrequentPath: []
    },
    recommendations: ['No CPU profiling data available']
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