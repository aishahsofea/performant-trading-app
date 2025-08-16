/**
 * TypeScript Types for DevTools Automation
 * 
 * This file defines all the data structures used for performance timeline capture,
 * network analysis, and Chrome DevTools Protocol interactions.
 * 
 * The types are organized by category:
 * 1. Chrome DevTools Protocol (CDP) types
 * 2. Performance Timeline types
 * 3. Network Analysis types
 * 4. Core Web Vitals types
 * 5. Analysis and Processing types
 */

// =============================================================================
// Common Type Definitions
// =============================================================================

/**
 * Performance analysis categories
 */
export type PerformanceAnalysisCategory = 
  | 'loading' 
  | 'interactivity' 
  | 'visual-stability' 
  | 'network' 
  | 'javascript';

/**
 * Chrome DevTools Protocol timeline event phases
 */
export type CDPEventPhase = 'B' | 'E' | 'X' | 'I';

// =============================================================================
// Chrome DevTools Protocol (CDP) Types
// =============================================================================

/**
 * CDP Performance Timeline Event
 * Raw event data from Chrome DevTools Protocol Performance.enable
 */
export type CDPPerformanceTimelineEvent = {
  name: string;
  ts: number;        // Timestamp in microseconds
  dur?: number;      // Duration in microseconds
  ph: CDPEventPhase; // Phase: 'B' (begin), 'E' (end), 'X' (complete), 'I' (instant)
  pid: number;       // Process ID
  tid: number;       // Thread ID
  cat: string;       // Categories
  args?: any;        // Event arguments
  id?: string;       // Event ID for async events
  scope?: string;    // Event scope
}

/**
 * CDP Runtime Evaluation Result
 * For executing JavaScript in the page context
 */
export type CDPRuntimeEvaluateResult = {
  result: {
    type: string;
    value?: any;
    description?: string;
  };
  exceptionDetails?: {
    text: string;
    lineNumber: number;
    columnNumber: number;
    scriptId: string;
  };
}

/**
 * CDP Network Request Data
 * Information about network requests from Network domain
 */
export type CDPNetworkRequest = {
  requestId: string;
  loaderId: string;
  documentURL: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    postData?: string;
    hasPostData?: boolean;
    mixedContentType?: string;
    initialPriority: string;
    referrerPolicy: string;
  };
  timestamp: number;
  wallTime: number;
  initiator: {
    type: string;
    stack?: {
      callFrames: Array<{
        functionName: string;
        scriptId: string;
        url: string;
        lineNumber: number;
        columnNumber: number;
      }>;
    };
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  redirectHasExtraInfo?: boolean;
  type?: string;
  response?: CDPNetworkResponse;
  responseReceivedTime?: number;
  encodedDataLength?: number;
  dataLength?: number;
}

export type CDPNetworkResponse = {
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  headersText?: string;
  mimeType: string;
  connectionReused: boolean;
  connectionId: number;
  remoteIPAddress?: string;
  remotePort?: number;
  fromDiskCache?: boolean;
  fromServiceWorker?: boolean;
  fromPrefetchCache?: boolean;
  encodedDataLength: number;
  timing?: {
    requestTime: number;
    proxyStart: number;
    proxyEnd: number;
    dnsStart: number;
    dnsEnd: number;
    connectStart: number;
    connectEnd: number;
    sslStart: number;
    sslEnd: number;
    workerStart: number;
    workerReady: number;
    sendStart: number;
    sendEnd: number;
    pushStart: number;
    pushEnd: number;
    receiveHeadersEnd: number;
  };
  responseTime?: number;
  protocol?: string;
  securityState: string;
  securityDetails?: {
    protocol: string;
    keyExchange: string;
    cipher: string;
    certificateId: number;
    subjectName: string;
    sanList: string[];
    issuer: string;
    validFrom: number;
    validTo: number;
    signedCertificateTimestampList: any[];
    certificateTransparencyCompliance: string;
  };
}

// =============================================================================
// Performance Timeline Types
// =============================================================================

/**
 * Processed Performance Timeline Event
 * Cleaned and structured version of CDP timeline events
 */
export type PerformanceTimelineEvent = {
  name: string;
  category: PerformanceEventCategory;
  startTime: number;     // Milliseconds relative to navigation start
  endTime?: number;      // For events with duration
  duration?: number;     // In milliseconds
  phase: 'begin' | 'end' | 'complete' | 'instant';
  processId: number;
  threadId: number;
  data?: any;           // Parsed event arguments
  id?: string;          // For linking async events
}

/**
 * Performance Event Categories
 * Organized categories for different types of performance events
 */
export type PerformanceEventCategory = 
  | 'navigation'        // Page navigation and loading
  | 'script'           // JavaScript execution
  | 'layout'           // CSS layout and reflow
  | 'paint'            // Rendering and painting
  | 'composite'        // Compositing layers
  | 'input'            // User input handling
  | 'animation'        // CSS/JS animations
  | 'idle'             // Browser idle time
  | 'gc'               // Garbage collection
  | 'other';           // Other events

/**
 * Core Web Vitals Measurements
 * The three key metrics Google uses for page experience
 */
export type CoreWebVitals = {
  // Largest Contentful Paint - loading performance
  lcp: {
    value: number;        // Time in milliseconds
    element?: string;     // CSS selector of LCP element
    url?: string;         // URL of LCP resource (if image)
    loadTime?: number;    // Time when element finished loading
    renderTime?: number;  // Time when element was rendered
  } | null;

  // First Input Delay - interactivity
  fid: {
    value: number;        // Delay in milliseconds
    eventType: string;    // Type of first input (click, keydown, etc.)
    startTime: number;    // When input occurred
    processingStart: number; // When processing began
    processingEnd: number;   // When processing finished
  } | null;

  // Cumulative Layout Shift - visual stability
  cls: {
    value: number;        // CLS score (0-1+)
    sources: Array<{
      node?: string;      // CSS selector of shifted element
      previousRect: DOMRect;
      currentRect: DOMRect;
      sessionValue: number;
    }>;
  } | null;

  // Interaction to Next Paint - responsiveness
  inp: {
    value: number;        // Time in milliseconds
    eventType: string;    // Type of interaction
    startTime: number;    // When interaction started
    processingStart: number;
    processingEnd: number;
    presentationTime: number;
  } | null;
}

/**
 * Navigation Timing Metrics
 * Based on W3C Navigation Timing API
 */
export type NavigationTimingMetrics = {
  // Navigation start (reference point)
  navigationStart: number;
  
  // Network timing
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  
  // Processing timing
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
  
  // Computed metrics
  computed: {
    ttfb: number;          // Time to First Byte
    domProcessing: number;  // DOM processing time
    totalPageLoad: number;  // Total page load time
  };
}

/**
 * JavaScript Performance Metrics
 * Metrics about JavaScript execution during timeline
 */
export type JavaScriptMetrics = {
  totalExecutionTime: number;    // Total JS execution time in ms
  mainThreadBlockingTime: number; // Time main thread was blocked
  longTasks: Array<{
    startTime: number;
    duration: number;
    attributionData?: {
      containerType: string;
      containerSrc: string;
      containerName: string;
    };
  }>;
  scriptUrls: string[];          // All executed script URLs
  compilationTime: number;       // Script compilation time
  executionBreakdown: {
    evaluation: number;          // Script evaluation time
    parsing: number;             // Script parsing time
    compilation: number;         // Script compilation time
  };
}

/**
 * Layout and Paint Metrics
 * Information about browser rendering performance
 */
export type LayoutPaintMetrics = {
  layoutCount: number;           // Number of layout operations
  totalLayoutTime: number;       // Total time spent in layout
  paintCount: number;            // Number of paint operations
  totalPaintTime: number;        // Total time spent painting
  layerCount: number;            // Number of composite layers
  
  // First Paint metrics
  firstPaint?: number;
  firstContentfulPaint?: number;
  
  // Layout thrashing indicators
  forcedReflowCount: number;     // Synchronous layout operations
  avgLayoutTime: number;         // Average layout operation time
}

// =============================================================================
// Network Analysis Types
// =============================================================================

/**
 * Processed Network Request
 * Analyzed version of CDP network data
 */
export type ProcessedNetworkRequest = {
  id: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  mimeType: string;
  
  // Timing information
  timing: {
    startTime: number;           // Relative to navigation start
    endTime: number;
    duration: number;
    dns?: number;                // DNS lookup time
    connect?: number;            // Connection time
    ssl?: number;                // SSL handshake time
    request: number;             // Request send time
    response: number;            // Response receive time
    total: number;               // Total request time
  };
  
  // Size information
  size: {
    requestHeaders: number;
    requestBody: number;
    responseHeaders: number;
    responseBody: number;
    encodedResponseBody: number;
    total: number;
    transferSize: number;        // Actual bytes transferred
  };
  
  // Request details
  priority: string;
  initiator: string;             // What triggered this request
  cached: boolean;
  fromServiceWorker: boolean;
  
  // Performance impact
  renderBlocking: boolean;       // Does this block rendering?
  criticalPath: boolean;         // Is this on critical path?
  resourceType: NetworkResourceType;
}

export type NetworkResourceType =
  | 'document'      // HTML documents
  | 'script'        // JavaScript files
  | 'stylesheet'    // CSS files
  | 'image'         // Images (PNG, JPG, SVG, etc.)
  | 'font'          // Web fonts
  | 'xhr'           // XMLHttpRequest/fetch
  | 'preflight'     // CORS preflight requests
  | 'other';        // Other resource types

/**
 * Network Analysis Summary
 * High-level analysis of network performance
 */
export type NetworkAnalysis = {
  requestCount: number;
  totalTransferSize: number;
  totalResourceSize: number;
  totalDuration: number;
  
  // Resource breakdown
  breakdown: {
    [K in NetworkResourceType]: {
      count: number;
      transferSize: number;
      resourceSize: number;
    };
  };
  
  // Performance indicators
  criticalPathRequests: ProcessedNetworkRequest[];
  renderBlockingRequests: ProcessedNetworkRequest[];
  largestRequests: ProcessedNetworkRequest[]; // Top 10 by size
  slowestRequests: ProcessedNetworkRequest[]; // Top 10 by duration
  
  // Timing analysis
  parallelRequestCount: number;    // Max concurrent requests
  connectionReuse: number;         // % of requests that reused connections
  cacheHitRatio: number;          // % of requests served from cache
}

// =============================================================================
// Timeline Analysis and Processing Types
// =============================================================================

/**
 * Complete Performance Timeline Data
 * The main data structure returned by timeline capture
 */
export type TimelineData = {
  // Raw and processed events
  events: PerformanceTimelineEvent[];
  
  // Core metrics
  coreWebVitals: CoreWebVitals;
  navigationTiming: NavigationTimingMetrics;
  
  // Detailed breakdowns
  javascript: JavaScriptMetrics;
  layoutPaint: LayoutPaintMetrics;
  network: NetworkAnalysis;
  
  // Timeline metadata
  metadata: {
    captureStart: number;        // When recording started
    captureEnd: number;          // When recording ended
    captureDuration: number;     // Total capture time
    navigationStart: number;     // Navigation start timestamp
    url: string;                 // Page URL
    userAgent: string;           // Browser user agent
  };
  
  // Screenshots (if enabled)
  screenshots?: Array<{
    timestamp: number;           // When screenshot was taken
    data: string;               // Base64 encoded image
  }>;
}

/**
 * Timeline Processing Options
 * Configuration for how timeline data should be processed
 */
export type TimelineProcessingOptions = {
  // Event filtering
  includeCategories?: PerformanceEventCategory[];
  excludeCategories?: PerformanceEventCategory[];
  minEventDuration?: number;     // Filter out events shorter than this (ms)
  
  // Core Web Vitals calculation
  calculateCWV: boolean;
  cwvThresholds?: {
    lcp: { good: number; poor: number };    // Default: 2500ms, 4000ms
    fid: { good: number; poor: number };    // Default: 100ms, 300ms
    cls: { good: number; poor: number };    // Default: 0.1, 0.25
    inp: { good: number; poor: number };    // Default: 200ms, 500ms
  };
  
  // Network analysis
  analyzeNetwork: boolean;
  networkThresholds?: {
    slowRequest: number;         // Requests slower than this are flagged (ms)
    largeResource: number;       // Resources larger than this are flagged (bytes)
  };
  
  // JavaScript analysis
  analyzeJavaScript: boolean;
  longTaskThreshold: number;     // Tasks longer than this are considered long (ms)
}

/**
 * Timeline Analysis Result
 * Summary and insights from timeline analysis
 */
export type TimelineAnalysisResult = {
  // Overall performance score (0-100)
  performanceScore: number;
  
  // Category scores
  scores: {
    loading: number;             // Based on LCP, FCP, etc.
    interactivity: number;       // Based on FID, TBT, etc.
    visualStability: number;     // Based on CLS
  };
  
  // Issues and recommendations
  issues: PerformanceIssue[];
  recommendations: PerformanceRecommendation[];
  
  // Opportunities for improvement
  opportunities: {
    category: PerformanceAnalysisCategory;
    description: string;
    potentialSavings: number;    // Estimated time savings in ms
    priority: 'high' | 'medium' | 'low';
  }[];
}

export type PerformanceIssue = {
  type: 'error' | 'warning' | 'info';
  category: PerformanceAnalysisCategory;
  title: string;
  description: string;
  impact: number;              // Impact score (0-100)
  element?: string;            // CSS selector if applicable
  url?: string;               // URL if applicable
  startTime?: number;         // When issue occurred
  duration?: number;          // How long issue lasted
}

export type PerformanceRecommendation = {
  title: string;
  description: string;
  category: PerformanceAnalysisCategory;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';    // Implementation effort
  impact: number;              // Expected impact (0-100)
  resources?: string[];        // URLs to helpful resources
}

// =============================================================================
// Utility and Helper Types
// =============================================================================

/**
 * DOM Rectangle for layout shift calculations
 */
export type DOMRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Color coding for performance metrics
 */
export type PerformanceThreshold = {
  good: number;
  needsImprovement: number;
  poor: number;
}

/**
 * Timeline event filter function
 */
export type EventFilter = (event: PerformanceTimelineEvent) => boolean;

/**
 * Timeline event processor function
 */
export type EventProcessor = (events: PerformanceTimelineEvent[]) => any;

// =============================================================================
// Memory Profiling Types
// =============================================================================

/**
 * Enhanced Memory Data with comprehensive analysis
 */
export type MemoryData = {
  snapshots: MemorySnapshot[];
  heapUsage: HeapUsageMetric[];
  gcEvents: GCEvent[];
  allocationSamples: AllocationSample[];
  analysis: MemoryAnalysis;
  metadata: {
    profilingDuration: number;
    startTime: number;
    endTime: number;
    options: MemoryProfilingOptions;
  };
}

/**
 * Heap Snapshot Data
 */
export type MemorySnapshot = {
  id: string;
  label: string;
  elapsedTimeMs: number; // Milliseconds since recording started
  data: any; // Raw CDP heap snapshot data
  metadata: {
    nodeCount: number;
    edgeCount: number;
    totalSize: number;
  };
}

/**
 * Heap Usage Metric
 */
export type HeapUsageMetric = {
  elapsedTimeMs: number; // Milliseconds since recording started
  source: string; // 'start', 'interval', 'end', etc.
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  memoryPressure: number; // 0-1 ratio of used/total
}

/**
 * Garbage Collection Event
 */
export type GCEvent = {
  elapsedTimeMs: number; // Milliseconds since recording started
  type: string; // 'scavenge', 'mark-sweep', etc.
  duration: number; // milliseconds
  freedBytes: number;
  totalHeapSize: number;
  usedHeapSize: number;
  cause: string;
}

/**
 * Allocation Sample from sampling profiler
 */
export type AllocationSample = {
  elapsedTimeMs: number; // Milliseconds since recording started
  size: number;
  nodeId: number;
  ordinal: number;
  stackTrace: string[];
}

/**
 * Memory Profiling Options
 */
export type MemoryProfilingOptions = {
  captureHeapSnapshots: boolean;
  monitorGCEvents: boolean;
  trackAllocationSampling: boolean;
  usageMonitoringInterval: number; // milliseconds
  maxSnapshots: number;
  snapshotTriggers: ('start' | 'end' | 'interval' | 'manual')[];
  gcEventDetails: boolean;
  allocationSamplingInterval: number; // bytes
}

/**
 * Memory Analysis Results
 */
export type MemoryAnalysis = {
  totalGCTime: number;
  avgMemoryUsage: number;
  maxMemoryUsage: number;
  memoryGrowthRate: number; // bytes per second
  memoryGrowthTrend: 'increasing' | 'decreasing' | 'stable';
  gcFrequency: number; // events per second
  gcEfficiency: number; // bytes freed per millisecond
  potentialLeaks: ObjectRetention[];
  recommendations: string[];
}

/**
 * Object Retention Analysis
 */
export type ObjectRetention = {
  objectType: string;
  retainedSize: number;
  instanceCount: number;
  suspicionLevel: 'low' | 'medium' | 'high';
}

// =============================================================================
// CPU Profiling Types
// =============================================================================

/**
 * CPU Profile Data
 */
export type CPUProfileData = {
  profile: any; // CDP CPU profile format
  duration: number;
  sampleCount: number;
  analysis: CPUAnalysis;
  metadata: {
    profilingDuration: number;
    startTime: number;
    endTime: number;
    options: CPUProfilingOptions;
  };
}

/**
 * CPU Profiling Options
 */
export type CPUProfilingOptions = {
  samplingInterval: number; // microseconds
  includeInlining: boolean;
  trackExecutionContexts: boolean;
  analyzeHotSpots: boolean;
  generateFlameGraph: boolean;
}

/**
 * CPU Analysis Results
 */
export type CPUAnalysis = {
  totalSamples: number;
  totalTime: number; // microseconds
  idleTime: number;
  activeTime: number;
  hotSpots: HotSpot[];
  functionBreakdown: FunctionMetric[];
  executionPath: ExecutionPath;
  optimizations?: OptimizationDetails; // V8 optimization analysis
  recommendations: string[];
}

/**
 * Hot Spot Analysis
 */
export type HotSpot = {
  functionName: string;
  url: string;
  line: number;
  column: number;
  selfTime: number; // microseconds
  totalTime: number; // microseconds
  hitCount: number;
  percentage: number; // of total execution time
  optimizationInfo?: {
    isInlined: boolean;
    isOptimized: boolean;
    deoptimizationRisk?: DeoptimizationReason;
  };
}

/**
 * Function-level Performance Metrics
 */
export type FunctionMetric = {
  functionName: string;
  url: string;
  callCount: number;
  selfTime: number;
  totalTime: number;
  averageTime: number;
  children: FunctionMetric[];
}

/**
 * Execution Path Analysis
 */
export type ExecutionPath = {
  criticalPath: CallFrame[];
  longestPath: CallFrame[];
  mostFrequentPath: CallFrame[];
}

/**
 * Call Frame Information
 */
export type CallFrame = {
  functionName: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
  scriptId: string;
}

// =============================================================================
// V8 Optimization and Inlining Types
// =============================================================================

/**
 * V8 Optimization Details
 * Information about V8's function optimization decisions
 */
export type OptimizationDetails = {
  inlinedFunctions: InlinedFunction[];
  deoptimizations: DeoptimizationEvent[];
  optimizationOpportunities: OptimizationOpportunity[];
  optimizationStats: OptimizationStats;
}

/**
 * Inlined Function Information
 * Details about functions that V8 successfully inlined
 */
export type InlinedFunction = {
  parentFunction: string;
  parentUrl: string;
  inlinedFunction: string;
  inlinedUrl: string;
  lineNumber: number;
  columnNumber: number;
  reason: InliningReason;
  impact: OptimizationImpact;
  selfTime: number; // Time saved by inlining (microseconds)
  callCount: number; // Number of times this would have been called
}

/**
 * Deoptimization Event
 * Information about functions that were deoptimized by V8
 */
export type DeoptimizationEvent = {
  functionName: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
  reason: DeoptimizationReason;
  timestamp: number;
  bailoutType: string;
  impact: OptimizationImpact;
}

/**
 * Optimization Opportunity
 * Suggestions for code changes that could improve V8 optimization
 */
export type OptimizationOpportunity = {
  type: OptimizationOpportunityType;
  functionName: string;
  url: string;
  lineNumber: number;
  description: string;
  potentialImpact: OptimizationImpact;
  recommendation: string;
  estimatedSavings: number; // Microseconds
}

/**
 * Overall Optimization Statistics
 */
export type OptimizationStats = {
  totalFunctions: number;
  optimizedFunctions: number;
  inlinedFunctions: number;
  deoptimizedFunctions: number;
  optimizationRatio: number; // 0-1
  inliningRatio: number; // 0-1
  totalTimeSaved: number; // Microseconds from optimizations
}

/**
 * Reasons why V8 inlined a function
 */
export type InliningReason =
  | 'small-function'      // Function is small enough to inline
  | 'frequent-call'       // Function is called frequently
  | 'hot-path'           // Function is on a hot execution path
  | 'monomorphic'        // Function has consistent type signatures
  | 'forced'             // Explicitly forced by V8 heuristics
  | 'constructor'        // Constructor function inlining
  | 'getter-setter'      // Property accessor inlining

/**
 * Reasons why V8 couldn't inline a function
 */
export type DeoptimizationReason =
  | 'function-too-large'     // Function exceeds inlining size limits
  | 'dynamic-call'           // Function called dynamically (apply/call)
  | 'try-catch-block'        // Function contains try/catch
  | 'with-statement'         // Function contains with statement
  | 'eval-usage'             // Function uses eval
  | 'arguments-object'       // Function uses arguments object
  | 'generator-function'     // Function is a generator
  | 'async-function'         // Function is async
  | 'polymorphic'           // Function has inconsistent type signatures
  | 'bailout'               // Runtime deoptimization occurred
  | 'insufficient-type-info' // Not enough type information available

/**
 * Types of optimization opportunities
 */
export type OptimizationOpportunityType =
  | 'eliminate-polymorphism'  // Reduce type variations
  | 'avoid-dynamic-calls'     // Replace apply/call with direct calls
  | 'reduce-function-size'    // Break down large functions
  | 'remove-try-catch'        // Move try/catch to outer scope
  | 'avoid-arguments-object'  // Use rest parameters instead
  | 'enable-monomorphic-ic'   // Ensure consistent object shapes
  | 'optimize-property-access' // Improve property access patterns

/**
 * Impact level of optimizations
 */
export type OptimizationImpact =
  | 'high'     // Significant performance improvement (>10% faster)
  | 'medium'   // Moderate performance improvement (2-10% faster)
  | 'low'      // Minor performance improvement (<2% faster)
  | 'neutral'  // No measurable impact
  | 'negative' // Performance regression (rare)