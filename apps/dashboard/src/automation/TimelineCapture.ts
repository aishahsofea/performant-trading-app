/**
 * Timeline Capture Class
 * 
 * This class handles the collection and processing of Chrome DevTools Protocol
 * performance timeline data. It listens to various CDP events during recording
 * and processes them into structured performance metrics.
 * 
 * Key Responsibilities:
 * 1. Set up CDP event listeners for timeline data collection
 * 2. Process raw CDP events into structured timeline events
 * 3. Calculate Core Web Vitals from timeline data
 * 4. Extract navigation timing metrics
 * 5. Analyze JavaScript execution performance
 * 6. Process layout and paint events
 * 
 * Usage:
 * ```typescript
 * const capture = new TimelineCapture(cdpSession, options);
 * await capture.startRecording();
 * // ... perform user interactions
 * const timelineData = await capture.stopRecording();
 * ```
 */

import type { CDPSession } from 'playwright';
import {
  CDPPerformanceTimelineEvent,
  CDPRuntimeEvaluateResult,
  PerformanceTimelineEvent,
  TimelineData,
  CoreWebVitals,
  NavigationTimingMetrics,
  JavaScriptMetrics,
  LayoutPaintMetrics,
  PerformanceEventCategory,
  TimelineProcessingOptions,
  CDPEventPhase
} from './types';

export class TimelineCapture {
  private cdpSession: CDPSession;
  private options: TimelineProcessingOptions;
  private isRecording = false;
  private recordingStartTime: number = 0;
  private navigationStartTime: number = 0;
  
  // Event collectors
  private rawEvents: CDPPerformanceTimelineEvent[] = [];
  private screenshots: Array<{ timestamp: number; data: string }> = [];
  
  // CDP event listeners (stored for cleanup)
  private eventListeners: Map<string, (params: any) => void> = new Map();
  
  /**
   * Initialize timeline capture with CDP session and options
   * 
   * @param cdpSession - Chrome DevTools Protocol session
   * @param options - Processing and capture options
   */
  constructor(
    cdpSession: CDPSession, 
    options: Partial<TimelineProcessingOptions> = {}
  ) {
    this.cdpSession = cdpSession;
    this.options = {
      calculateCWV: true,
      analyzeNetwork: true,
      analyzeJavaScript: true,
      longTaskThreshold: 50, // Tasks longer than 50ms
      cwvThresholds: {
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 },
        inp: { good: 200, poor: 500 }
      },
      networkThresholds: {
        slowRequest: 2000,    // 2 seconds
        largeResource: 1024 * 1024 // 1MB
      },
      ...options
    };
  }

  /**
   * Start recording performance timeline
   * Sets up all necessary CDP domain listeners
   */
  startRecording = async (): Promise<void> => {
    if (this.isRecording) {
      throw new Error('Timeline recording already in progress');
    }

    this.log('Starting timeline capture...');
    this.recordingStartTime = Date.now();
    this.isRecording = true;
    
    // Reset collectors
    this.rawEvents = [];
    this.screenshots = [];
    
    try {
      // Enable necessary CDP domains
      await this.cdpSession.send('Performance.enable');
      await this.cdpSession.send('Runtime.enable');
      await this.cdpSession.send('Page.enable');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Get navigation start time for relative calculations
      this.navigationStartTime = await this.getNavigationStartTime();
      
      this.log('Timeline capture started successfully');
      
    } catch (error) {
      this.isRecording = false;
      this.log('Failed to start timeline capture:', error);
      throw error;
    }
  };

  /**
   * Stop recording and process collected data
   * 
   * @returns Complete timeline data with metrics
   */
  stopRecording = async (): Promise<TimelineData> => {
    if (!this.isRecording) {
      throw new Error('No timeline recording in progress');
    }

    this.log('Stopping timeline capture...');
    
    try {
      // Remove all event listeners
      this.removeEventListeners();
      
      // Get final performance metrics
      const finalMetrics = await this.getFinalMetrics();
      
      // Process collected data
      const timelineData = await this.processTimelineData(finalMetrics);
      
      this.isRecording = false;
      this.log(`Timeline capture completed. Collected ${this.rawEvents.length} events`);
      
      return timelineData;
      
    } catch (error) {
      this.isRecording = false;
      this.log('Failed to stop timeline capture:', error);
      throw error;
    }
  };

  /**
   * Take a screenshot during recording
   * Screenshots are automatically timestamped and added to timeline
   */
  takeScreenshot = async (data: string): Promise<void> => {
    if (!this.isRecording) return;
    
    this.screenshots.push({
      timestamp: Date.now() - this.recordingStartTime,
      data
    });
  };

  /**
   * Set up CDP event listeners for data collection
   * Each listener processes specific types of performance events
   */
  private setupEventListeners = (): void => {
    // Performance timeline events
    const performanceListener = (params: any) => {
      this.rawEvents.push({
        name: params.name || 'PerformanceMetric',
        ts: Date.now() * 1000, // Convert to microseconds
        ph: 'I' as CDPEventPhase,
        pid: 0,
        tid: 0,
        cat: 'performance',
        args: params
      });
    };

    // Runtime evaluation events (for CWV calculation)
    const runtimeListener = (params: any) => {
      if (params.type === 'PerformanceObserver') {
        this.rawEvents.push({
          name: 'PerformanceObserver',
          ts: Date.now() * 1000,
          ph: 'I' as CDPEventPhase,
          pid: 0,
          tid: 0,
          cat: 'webvitals',
          args: params
        });
      }
    };

    // Page lifecycle events
    const pageListener = (params: any) => {
      this.rawEvents.push({
        name: params.name || 'PageEvent',
        ts: Date.now() * 1000,
        ph: 'I' as CDPEventPhase,
        pid: 0,
        tid: 0,
        cat: 'navigation',
        args: params
      });
    };

    // Store listeners for cleanup
    this.eventListeners.set('Performance.metrics', performanceListener);
    this.eventListeners.set('Runtime.consoleAPICalled', runtimeListener);
    this.eventListeners.set('Page.lifecycleEvent', pageListener);

    // Attach listeners to CDP session
    this.cdpSession.on('Performance.metrics' as any, performanceListener);
    this.cdpSession.on('Runtime.consoleAPICalled' as any, runtimeListener);
    this.cdpSession.on('Page.lifecycleEvent' as any, pageListener);
  };

  /**
   * Remove all CDP event listeners
   */
  private removeEventListeners = (): void => {
    this.eventListeners.forEach((listener, eventName) => {
      this.cdpSession.off(eventName as any, listener);
    });
    this.eventListeners.clear();
  };

  /**
   * Get navigation start time from the browser
   */
  private getNavigationStartTime = async (): Promise<number> => {
    try {
      const result = await this.cdpSession.send('Runtime.evaluate', {
        expression: 'performance.timeOrigin || performance.timing.navigationStart',
        returnByValue: true
      }) as CDPRuntimeEvaluateResult;

      if (result.result && typeof result.result.value === 'number') {
        return result.result.value;
      }
      
      return Date.now();
    } catch (error) {
      this.log('Failed to get navigation start time:', error);
      return Date.now();
    }
  };

  /**
   * Get final performance metrics from browser APIs
   */
  private getFinalMetrics = async (): Promise<any> => {
    try {
      const result = await this.cdpSession.send('Runtime.evaluate', {
        expression: `
          // Collect all available performance data
          ({
            // Navigation Timing
            navigation: performance.getEntriesByType('navigation')[0],
            
            // Paint Timing
            paint: performance.getEntriesByType('paint'),
            
            // Layout Shift (if available)
            layoutShift: typeof PerformanceObserver !== 'undefined' ? 
              new Promise(resolve => {
                try {
                  const observer = new PerformanceObserver(list => {
                    resolve(list.getEntries());
                  });
                  observer.observe({ entryTypes: ['layout-shift'] });
                  setTimeout(() => resolve([]), 1000);
                } catch(e) { resolve([]); }
              }) : [],
            
            // Largest Contentful Paint
            lcp: typeof PerformanceObserver !== 'undefined' ?
              new Promise(resolve => {
                try {
                  const observer = new PerformanceObserver(list => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                      resolve(entries[entries.length - 1]);
                    }
                  });
                  observer.observe({ entryTypes: ['largest-contentful-paint'] });
                  setTimeout(() => resolve(null), 1000);
                } catch(e) { resolve(null); }
              }) : null,
            
            // First Input Delay
            fid: typeof PerformanceObserver !== 'undefined' ?
              new Promise(resolve => {
                try {
                  const observer = new PerformanceObserver(list => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                      resolve(entries[0]);
                    }
                  });
                  observer.observe({ entryTypes: ['first-input'] });
                  setTimeout(() => resolve(null), 1000);
                } catch(e) { resolve(null); }
              }) : null,
            
            // Memory info (if available)
            memory: performance.memory ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : null,
            
            // Current timestamp
            now: performance.now(),
            timeOrigin: performance.timeOrigin || performance.timing.navigationStart
          })
        `,
        returnByValue: true,
        awaitPromise: true
      }) as CDPRuntimeEvaluateResult;

      return result.result?.value || {};
    } catch (error) {
      this.log('Failed to get final metrics:', error);
      return {};
    }
  };

  /**
   * Process raw timeline data into structured metrics
   */
  private processTimelineData = async (finalMetrics: any): Promise<TimelineData> => {
    this.log('Processing timeline data...');

    // Convert raw events to structured events
    const events = this.processRawEvents();
    
    // Calculate Core Web Vitals
    const coreWebVitals = this.options.calculateCWV 
      ? await this.calculateCoreWebVitals(finalMetrics, events)
      : this.getEmptyCoreWebVitals();

    // Extract navigation timing
    const navigationTiming = this.extractNavigationTiming(finalMetrics);
    
    // Analyze JavaScript performance
    const javascript = this.options.analyzeJavaScript 
      ? this.analyzeJavaScriptPerformance(events)
      : this.getEmptyJavaScriptMetrics();
    
    // Analyze layout and paint
    const layoutPaint = this.analyzeLayoutPaint(events, finalMetrics);

    // Create timeline data
    const timelineData: TimelineData = {
      events,
      coreWebVitals,
      navigationTiming,
      javascript,
      layoutPaint,
      network: {
        requestCount: 0,
        totalTransferSize: 0,
        totalResourceSize: 0,
        totalDuration: 0,
        breakdown: {
          document: { count: 0, transferSize: 0, resourceSize: 0 },
          script: { count: 0, transferSize: 0, resourceSize: 0 },
          stylesheet: { count: 0, transferSize: 0, resourceSize: 0 },
          image: { count: 0, transferSize: 0, resourceSize: 0 },
          font: { count: 0, transferSize: 0, resourceSize: 0 },
          xhr: { count: 0, transferSize: 0, resourceSize: 0 },
          preflight: { count: 0, transferSize: 0, resourceSize: 0 },
          other: { count: 0, transferSize: 0, resourceSize: 0 }
        },
        criticalPathRequests: [],
        renderBlockingRequests: [],
        largestRequests: [],
        slowestRequests: [],
        parallelRequestCount: 0,
        connectionReuse: 0,
        cacheHitRatio: 0
      }, // Network analysis will be implemented separately
      metadata: {
        captureStart: this.recordingStartTime,
        captureEnd: Date.now(),
        captureDuration: Date.now() - this.recordingStartTime,
        navigationStart: this.navigationStartTime,
        url: finalMetrics.navigation?.name || 'unknown',
        userAgent: (typeof navigator !== 'undefined' ? navigator?.userAgent : null) || 'unknown'
      },
      screenshots: this.screenshots.length > 0 ? this.screenshots : undefined
    };

    return timelineData;
  };

  /**
   * Convert raw CDP events to structured timeline events
   */
  private processRawEvents = (): PerformanceTimelineEvent[] => {
    return this.rawEvents
      .filter(event => this.shouldIncludeEvent(event))
      .map(event => this.convertCDPEvent(event))
      .sort((a, b) => a.startTime - b.startTime);
  };

  /**
   * Check if event should be included based on options
   */
  private shouldIncludeEvent = (event: CDPPerformanceTimelineEvent): boolean => {
    // Filter by categories if specified
    const category = this.categorizeEvent(event);
    
    if (this.options.includeCategories && 
        !this.options.includeCategories.includes(category)) {
      return false;
    }
    
    if (this.options.excludeCategories && 
        this.options.excludeCategories.includes(category)) {
      return false;
    }
    
    // Filter by minimum duration
    if (this.options.minEventDuration && 
        event.dur && 
        event.dur / 1000 < this.options.minEventDuration) {
      return false;
    }
    
    return true;
  };

  /**
   * Convert CDP event to structured timeline event
   */
  private convertCDPEvent = (event: CDPPerformanceTimelineEvent): PerformanceTimelineEvent => {
    const startTime = (event.ts - this.navigationStartTime * 1000) / 1000; // Convert to ms
    
    return {
      name: event.name,
      category: this.categorizeEvent(event),
      startTime: Math.max(0, startTime), // Ensure non-negative
      endTime: event.dur ? startTime + (event.dur / 1000) : undefined,
      duration: event.dur ? event.dur / 1000 : undefined,
      phase: this.convertPhase(event.ph),
      processId: event.pid,
      threadId: event.tid,
      data: event.args,
      id: event.id
    };
  };

  /**
   * Categorize CDP event into performance category
   */
  private categorizeEvent = (event: CDPPerformanceTimelineEvent): PerformanceEventCategory => {
    const name = event.name.toLowerCase();
    const category = event.cat?.toLowerCase() || '';
    
    if (name.includes('navigation') || category.includes('navigation')) {
      return 'navigation';
    }
    if (name.includes('script') || name.includes('js') || category.includes('script')) {
      return 'script';
    }
    if (name.includes('layout') || name.includes('reflow')) {
      return 'layout';
    }
    if (name.includes('paint') || name.includes('render')) {
      return 'paint';
    }
    if (name.includes('composite') || name.includes('layer')) {
      return 'composite';
    }
    if (name.includes('input') || name.includes('click') || name.includes('key')) {
      return 'input';
    }
    if (name.includes('animation') || name.includes('transition')) {
      return 'animation';
    }
    if (name.includes('gc') || name.includes('garbage')) {
      return 'gc';
    }
    if (name.includes('idle')) {
      return 'idle';
    }
    
    return 'other';
  };

  /**
   * Convert CDP phase to structured phase
   */
  private convertPhase = (phase: CDPEventPhase): 'begin' | 'end' | 'complete' | 'instant' => {
    switch (phase) {
      case 'B': return 'begin';
      case 'E': return 'end';
      case 'X': return 'complete';
      case 'I': return 'instant';
      default: return 'instant';
    }
  };

  /**
   * Calculate Core Web Vitals from collected data
   */
  private calculateCoreWebVitals = async (finalMetrics: any, events: PerformanceTimelineEvent[]): Promise<CoreWebVitals> => {
    // This is a simplified implementation
    // In a full implementation, you'd use the actual PerformanceObserver data
    
    const paintEvents = events.filter(e => e.category === 'paint');
    const firstPaint = paintEvents.find(e => e.name.includes('first-paint'));
    const firstContentfulPaint = paintEvents.find(e => e.name.includes('first-contentful-paint'));

    return {
      lcp: finalMetrics.lcp ? {
        value: finalMetrics.lcp.startTime,
        element: finalMetrics.lcp.element?.tagName,
        renderTime: finalMetrics.lcp.renderTime,
        loadTime: finalMetrics.lcp.loadTime
      } : null,
      
      fid: finalMetrics.fid ? {
        value: finalMetrics.fid.processingStart - finalMetrics.fid.startTime,
        eventType: finalMetrics.fid.name,
        startTime: finalMetrics.fid.startTime,
        processingStart: finalMetrics.fid.processingStart,
        processingEnd: finalMetrics.fid.processingEnd
      } : null,
      
      cls: finalMetrics.layoutShift && Array.isArray(finalMetrics.layoutShift) ? {
        value: finalMetrics.layoutShift.reduce((sum: number, entry: any) => sum + entry.value, 0),
        sources: finalMetrics.layoutShift.map((entry: any) => ({
          sessionValue: entry.value,
          previousRect: entry.sources?.[0]?.previousRect || {},
          currentRect: entry.sources?.[0]?.currentRect || {}
        }))
      } : null,
      
      inp: null // Would need more complex implementation
    };
  };

  /**
   * Extract navigation timing metrics
   */
  private extractNavigationTiming = (finalMetrics: any): NavigationTimingMetrics => {
    const nav = finalMetrics.navigation || {};
    
    return {
      navigationStart: nav.startTime || 0,
      fetchStart: nav.fetchStart || 0,
      domainLookupStart: nav.domainLookupStart || 0,
      domainLookupEnd: nav.domainLookupEnd || 0,
      connectStart: nav.connectStart || 0,
      connectEnd: nav.connectEnd || 0,
      secureConnectionStart: nav.secureConnectionStart || 0,
      requestStart: nav.requestStart || 0,
      responseStart: nav.responseStart || 0,
      responseEnd: nav.responseEnd || 0,
      domLoading: nav.domLoading || 0,
      domInteractive: nav.domInteractive || 0,
      domContentLoadedEventStart: nav.domContentLoadedEventStart || 0,
      domContentLoadedEventEnd: nav.domContentLoadedEventEnd || 0,
      domComplete: nav.domComplete || 0,
      loadEventStart: nav.loadEventStart || 0,
      loadEventEnd: nav.loadEventEnd || 0,
      computed: {
        ttfb: (nav.responseStart || 0) - (nav.requestStart || 0),
        domProcessing: (nav.domComplete || 0) - (nav.domLoading || 0),
        totalPageLoad: (nav.loadEventEnd || 0) - (nav.startTime || 0)
      }
    };
  };

  /**
   * Analyze JavaScript performance from timeline events
   */
  private analyzeJavaScriptPerformance = (events: PerformanceTimelineEvent[]): JavaScriptMetrics => {
    const scriptEvents = events.filter(e => e.category === 'script');
    const totalExecutionTime = scriptEvents.reduce((sum, event) => sum + (event.duration || 0), 0);
    
    const longTasks = scriptEvents
      .filter(event => (event.duration || 0) > this.options.longTaskThreshold)
      .map(event => ({
        startTime: event.startTime,
        duration: event.duration || 0
      }));

    return {
      totalExecutionTime,
      mainThreadBlockingTime: longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0),
      longTasks,
      scriptUrls: [], // Would need to extract from event data
      compilationTime: 0, // Would need to extract from specific events
      executionBreakdown: {
        evaluation: totalExecutionTime * 0.4, // Rough estimates
        parsing: totalExecutionTime * 0.2,
        compilation: totalExecutionTime * 0.4
      }
    };
  };

  /**
   * Analyze layout and paint performance
   */
  private analyzeLayoutPaint = (events: PerformanceTimelineEvent[], finalMetrics: any): LayoutPaintMetrics => {
    const layoutEvents = events.filter(e => e.category === 'layout');
    const paintEvents = events.filter(e => e.category === 'paint');
    
    const firstPaint = finalMetrics.paint?.find((p: any) => p.name === 'first-paint');
    const firstContentfulPaint = finalMetrics.paint?.find((p: any) => p.name === 'first-contentful-paint');

    return {
      layoutCount: layoutEvents.length,
      totalLayoutTime: layoutEvents.reduce((sum, event) => sum + (event.duration || 0), 0),
      paintCount: paintEvents.length,
      totalPaintTime: paintEvents.reduce((sum, event) => sum + (event.duration || 0), 0),
      layerCount: 0, // Would need specific layer events
      firstPaint: firstPaint?.startTime,
      firstContentfulPaint: firstContentfulPaint?.startTime,
      forcedReflowCount: layoutEvents.filter(e => e.name.includes('forced')).length,
      avgLayoutTime: layoutEvents.length > 0 
        ? layoutEvents.reduce((sum, event) => sum + (event.duration || 0), 0) / layoutEvents.length
        : 0
    };
  };

  /**
   * Get empty Core Web Vitals structure
   */
  private getEmptyCoreWebVitals = (): CoreWebVitals => ({
    lcp: null,
    fid: null,
    cls: null,
    inp: null
  });

  /**
   * Get empty JavaScript metrics structure
   */
  private getEmptyJavaScriptMetrics = (): JavaScriptMetrics => ({
    totalExecutionTime: 0,
    mainThreadBlockingTime: 0,
    longTasks: [],
    scriptUrls: [],
    compilationTime: 0,
    executionBreakdown: {
      evaluation: 0,
      parsing: 0,
      compilation: 0
    }
  });

  /**
   * Simple logging utility
   */
  private log = (message: string, data?: any): void => {
    if (data) {
      console.log(`[TimelineCapture] ${message}`, data);
    } else {
      console.log(`[TimelineCapture] ${message}`);
    }
  };
}