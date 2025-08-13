/**
 * Network Analysis Class
 *
 * This class handles the collection and analysis of network requests during
 * performance timeline capture. It monitors Chrome DevTools Protocol Network
 * domain events to track all HTTP requests, responses, and resource loading.
 *
 * Key Responsibilities:
 * 1. Monitor network requests and responses via CDP Network domain
 * 2. Calculate request timing, size, and performance metrics
 * 3. Identify critical path and render-blocking resources
 * 4. Analyze resource types and caching behavior
 * 5. Detect performance issues and optimization opportunities
 *
 * Features:
 * - Real-time request tracking with detailed timing
 * - Resource type classification and analysis
 * - Critical path identification for performance optimization
 * - Cache efficiency analysis
 * - Connection reuse tracking
 * - Large/slow request detection
 *
 * Usage:
 * ```typescript
 * const networkAnalysis = new NetworkAnalysis(cdpSession, options);
 * await networkAnalysis.startRecording();
 * // ... perform user interactions
 * const networkData = await networkAnalysis.stopRecording();
 * ```
 */

import type { CDPSession } from "playwright";
import {
  CDPNetworkRequest,
  CDPNetworkResponse,
  ProcessedNetworkRequest,
  NetworkAnalysis as NetworkAnalysisType,
  NetworkResourceType,
  TimelineProcessingOptions,
} from "./types";

export class NetworkAnalysis {
  private cdpSession: CDPSession;
  private options: TimelineProcessingOptions;
  private isRecording = false;
  private recordingStartTime: number = 0;
  private firstRequestTimestamp: number = 0; // Will be set from first CDP timestamp

  // Request tracking
  private activeRequests = new Map<string, Partial<ProcessedNetworkRequest>>();
  private completedRequests: ProcessedNetworkRequest[] = [];
  private requestTimings = new Map<string, any>();
  private responseData = new Map<string, CDPNetworkResponse>();

  // Event listeners for cleanup
  private eventListeners: Map<string, (params: any) => void> = new Map();

  /**
   * Initialize network analysis with CDP session and options
   *
   * @param cdpSession - Chrome DevTools Protocol session
   * @param options - Processing and analysis options
   */
  constructor(
    cdpSession: CDPSession,
    options: Partial<TimelineProcessingOptions> = {}
  ) {
    this.cdpSession = cdpSession;
    this.options = {
      analyzeNetwork: true,
      networkThresholds: {
        slowRequest: 2000, // 2 seconds
        largeResource: 1024 * 1024, // 1MB
      },
      ...options,
    } as TimelineProcessingOptions;
  }

  /**
   * Start recording network activity
   * Sets up CDP Network domain listeners
   */
  startRecording = async (): Promise<void> => {
    if (this.isRecording) {
      throw new Error("Network recording already in progress");
    }

    this.log("Starting network analysis...");
    this.recordingStartTime = Date.now();
    this.isRecording = true;

    // Reset data structures
    this.activeRequests.clear();
    this.completedRequests = [];
    this.requestTimings.clear();
    this.responseData.clear();

    try {
      // Enable Network domain
      await this.cdpSession.send("Network.enable");

      // Set up event listeners
      this.setupNetworkEventListeners();

      this.log("Network analysis started successfully");
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to start network analysis:", error);
      throw error;
    }
  };

  /**
   * Stop recording and analyze collected network data
   *
   * @returns Complete network analysis results
   */
  stopRecording = async (): Promise<NetworkAnalysisType> => {
    if (!this.isRecording) {
      throw new Error("No network recording in progress");
    }

    this.log("Stopping network analysis...");

    try {
      // Remove event listeners
      this.removeEventListeners();

      // Finalize any pending requests
      this.finalizePendingRequests();

      // Analyze collected data
      const analysis = this.analyzeNetworkData();

      this.isRecording = false;
      this.log(
        `Network analysis completed. Analyzed ${this.completedRequests.length} requests`
      );

      return analysis;
    } catch (error) {
      this.isRecording = false;
      this.log("Failed to stop network analysis:", error);
      throw error;
    }
  };

  /**
   * Set up CDP Network domain event listeners
   */
  private setupNetworkEventListeners = (): void => {
    // Request will be sent
    const requestWillBeSentListener = (params: any) => {
      this.handleRequestWillBeSent(params);
    };

    // Response received
    const responseReceivedListener = (params: any) => {
      this.handleResponseReceived(params);
    };

    // Loading finished
    const loadingFinishedListener = (params: any) => {
      this.handleLoadingFinished(params);
    };

    // Loading failed
    const loadingFailedListener = (params: any) => {
      this.handleLoadingFailed(params);
    };

    // Resource timing
    const resourceTimingListener = (params: any) => {
      this.handleResourceTiming(params);
    };

    // Store listeners for cleanup
    this.eventListeners.set(
      "Network.requestWillBeSent",
      requestWillBeSentListener
    );
    this.eventListeners.set(
      "Network.responseReceived",
      responseReceivedListener
    );
    this.eventListeners.set("Network.loadingFinished", loadingFinishedListener);
    this.eventListeners.set("Network.loadingFailed", loadingFailedListener);
    this.eventListeners.set(
      "Network.resourceChangedPriority",
      resourceTimingListener
    );

    // Attach listeners
    this.cdpSession.on("Network.requestWillBeSent", requestWillBeSentListener);
    this.cdpSession.on("Network.responseReceived", responseReceivedListener);
    this.cdpSession.on("Network.loadingFinished", loadingFinishedListener);
    this.cdpSession.on("Network.loadingFailed", loadingFailedListener);
    this.cdpSession.on(
      "Network.resourceChangedPriority",
      resourceTimingListener
    );
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
   * Handle Network.requestWillBeSent event
   */
  private handleRequestWillBeSent = (params: any): void => {
    const requestId = params.requestId;
    const request = params.request;
    const timestamp = params.timestamp;
    
    // Set first request timestamp as reference point
    if (this.firstRequestTimestamp === 0) {
      this.firstRequestTimestamp = timestamp;
      this.log(`First request timestamp set: ${timestamp}`);
    }

    const processedRequest: Partial<ProcessedNetworkRequest> = {
      id: requestId,
      url: request.url,
      method: request.method,
      priority: request.initialPriority,
      initiator: this.getInitiatorString(params.initiator),
      timing: {
        startTime: (timestamp - this.firstRequestTimestamp) * 1000, // Convert to ms relative to first request
        endTime: 0,
        duration: 0,
        request: 0,
        response: 0,
        total: 0,
      },
      size: {
        requestHeaders: this.calculateHeadersSize(request.headers),
        requestBody: request.postData ? new Blob([request.postData]).size : 0,
        responseHeaders: 0,
        responseBody: 0,
        encodedResponseBody: 0,
        total: 0,
        transferSize: 0,
      },
      cached: false,
      fromServiceWorker: false,
      renderBlocking: this.isRenderBlocking(request),
      criticalPath: this.isOnCriticalPath(request),
      resourceType: this.classifyResourceType(request.url, request.headers),
    };

    this.activeRequests.set(requestId, processedRequest);
    this.requestTimings.set(requestId, { startTime: timestamp });
  };

  /**
   * Handle Network.responseReceived event
   */
  private handleResponseReceived = (params: any): void => {
    const requestId = params.requestId;
    const response = params.response;
    const timestamp = params.timestamp;

    const request = this.activeRequests.get(requestId);
    if (!request) return;

    // Update request with response data
    request.status = response.status;
    request.statusText = response.statusText;
    request.mimeType = response.mimeType;
    request.cached =
      response.fromDiskCache || response.fromPrefetchCache || false;
    request.fromServiceWorker = response.fromServiceWorker || false;

    // Update timing
    if (request.timing) {
      const requestTiming = this.requestTimings.get(requestId);
      if (requestTiming && response.timing) {
        this.updateDetailedTiming(
          request.timing,
          response.timing,
          requestTiming.startTime
        );
      }
    }

    // Update size information
    if (request.size) {
      request.size.responseHeaders = this.calculateHeadersSize(
        response.headers
      );
      request.size.encodedResponseBody = response.encodedDataLength || 0;
    }

    // Store response data
    this.responseData.set(requestId, response);
    this.requestTimings.set(requestId, {
      ...this.requestTimings.get(requestId),
      responseTime: timestamp,
    });
  };

  /**
   * Handle Network.loadingFinished event
   */
  private handleLoadingFinished = (params: any): void => {
    const requestId = params.requestId;
    const timestamp = params.timestamp;
    const encodedDataLength = params.encodedDataLength;

    const request = this.activeRequests.get(requestId);
    if (!request) return;

    // Finalize timing
    if (request.timing) {
      request.timing.endTime = (timestamp - this.firstRequestTimestamp) * 1000;
      request.timing.duration =
        request.timing.endTime - request.timing.startTime;
      request.timing.total = request.timing.duration;
    }

    // Finalize size
    if (request.size) {
      request.size.transferSize = encodedDataLength || 0;
      request.size.responseBody =
        request.size.transferSize - request.size.responseHeaders;
      request.size.total =
        request.size.requestHeaders +
        request.size.requestBody +
        request.size.responseHeaders +
        request.size.responseBody;
    }

    // Move to completed requests
    this.completedRequests.push(request as ProcessedNetworkRequest);
    this.activeRequests.delete(requestId);
  };

  /**
   * Handle Network.loadingFailed event
   */
  private handleLoadingFailed = (params: any): void => {
    const requestId = params.requestId;
    const timestamp = params.timestamp;

    const request = this.activeRequests.get(requestId);
    if (!request) return;

    // Mark as failed
    request.status = 0;
    request.statusText = params.errorText || "Failed";

    // Finalize timing
    if (request.timing) {
      request.timing.endTime = (timestamp - this.firstRequestTimestamp) * 1000;
      request.timing.duration =
        request.timing.endTime - request.timing.startTime;
      request.timing.total = request.timing.duration;
    }

    // Move to completed requests (even failed ones)
    this.completedRequests.push(request as ProcessedNetworkRequest);
    this.activeRequests.delete(requestId);
  };

  /**
   * Handle resource timing updates
   */
  private handleResourceTiming = (params: any): void => {
    // Handle priority changes and other resource timing updates
    const requestId = params.requestId;
    const request = this.activeRequests.get(requestId);

    if (request && params.newPriority) {
      request.priority = params.newPriority;
    }
  };

  /**
   * Update detailed timing information from CDP response timing
   */
  private updateDetailedTiming = (
    timing: ProcessedNetworkRequest["timing"],
    cdpTiming: any,
    requestStartTime: number
  ): void => {
    // CDP timing values are already relative durations, no base adjustment needed
    timing.dns =
      cdpTiming.dnsEnd > 0 ? cdpTiming.dnsEnd - cdpTiming.dnsStart : 0;
    timing.connect =
      cdpTiming.connectEnd > 0
        ? cdpTiming.connectEnd - cdpTiming.connectStart
        : 0;
    timing.ssl =
      cdpTiming.sslEnd > 0 ? cdpTiming.sslEnd - cdpTiming.sslStart : 0;
    timing.request = cdpTiming.sendEnd - cdpTiming.sendStart;
    timing.response = cdpTiming.receiveHeadersEnd - cdpTiming.sendEnd;
  };

  /**
   * Finalize any pending requests at recording stop
   */
  private finalizePendingRequests = (): void => {
    // Use current time relative to first request timestamp
    const currentTime = this.firstRequestTimestamp > 0 
      ? (Date.now() / 1000 - this.firstRequestTimestamp) * 1000 // Convert to same relative timing format
      : 0;

    this.activeRequests.forEach((request) => {
      if (request.timing) {
        request.timing.endTime = currentTime;
        request.timing.duration =
          request.timing.endTime - request.timing.startTime;
        request.timing.total = request.timing.duration;
      }

      // Mark as incomplete
      request.status = request.status || -1;
      request.statusText = request.statusText || "Incomplete";

      this.completedRequests.push(request as ProcessedNetworkRequest);
    });

    this.activeRequests.clear();
  };

  /**
   * Analyze collected network data and generate insights
   */
  private analyzeNetworkData = (): NetworkAnalysisType => {
    const requests = this.completedRequests;

    // Basic metrics
    const totalTransferSize = requests.reduce(
      (sum, req) => sum + req.size.transferSize,
      0
    );
    const totalResourceSize = requests.reduce(
      (sum, req) => sum + req.size.total,
      0
    );
    const totalDuration = Math.max(
      ...requests.map((req) => req.timing.endTime)
    );

    // Resource breakdown
    const breakdown = this.createResourceBreakdown(requests);

    // Performance insights
    const criticalPathRequests = requests.filter((req) => req.criticalPath);
    const renderBlockingRequests = requests.filter((req) => req.renderBlocking);
    const largestRequests = [...requests]
      .sort((a, b) => b.size.transferSize - a.size.transferSize)
      .slice(0, 10);
    const slowestRequests = [...requests]
      .sort((a, b) => b.timing.duration - a.timing.duration)
      .slice(0, 10);

    // Connection analysis
    const connectionReuse = this.calculateConnectionReuse(requests);
    const cacheHitRatio = this.calculateCacheHitRatio(requests);
    const parallelRequestCount = this.calculateMaxParallelRequests(requests);

    return {
      requestCount: requests.length,
      totalTransferSize,
      totalResourceSize,
      totalDuration,
      breakdown,
      criticalPathRequests,
      renderBlockingRequests,
      largestRequests,
      slowestRequests,
      parallelRequestCount,
      connectionReuse,
      cacheHitRatio,
    };
  };

  /**
   * Create resource breakdown by type
   */
  private createResourceBreakdown = (requests: ProcessedNetworkRequest[]) => {
    const breakdown = {
      document: { count: 0, transferSize: 0, resourceSize: 0 },
      script: { count: 0, transferSize: 0, resourceSize: 0 },
      stylesheet: { count: 0, transferSize: 0, resourceSize: 0 },
      image: { count: 0, transferSize: 0, resourceSize: 0 },
      font: { count: 0, transferSize: 0, resourceSize: 0 },
      xhr: { count: 0, transferSize: 0, resourceSize: 0 },
      preflight: { count: 0, transferSize: 0, resourceSize: 0 },
      other: { count: 0, transferSize: 0, resourceSize: 0 },
    };

    requests.forEach((request) => {
      const type = request.resourceType;
      breakdown[type].count++;
      breakdown[type].transferSize += request.size.transferSize;
      breakdown[type].resourceSize += request.size.total;
    });

    return breakdown;
  };

  /**
   * Calculate connection reuse percentage
   */
  private calculateConnectionReuse = (
    requests: ProcessedNetworkRequest[]
  ): number => {
    // This is a simplified calculation
    // In a full implementation, you'd track actual connection IDs
    const uniqueHosts = new Set(requests.map((req) => new URL(req.url).host));
    const totalConnections = requests.length;
    const estimatedNewConnections = uniqueHosts.size * 2; // Rough estimate

    return totalConnections > 0
      ? Math.max(
          0,
          ((totalConnections - estimatedNewConnections) / totalConnections) *
            100
        )
      : 0;
  };

  /**
   * Calculate cache hit ratio
   */
  private calculateCacheHitRatio = (
    requests: ProcessedNetworkRequest[]
  ): number => {
    const cachedRequests = requests.filter((req) => req.cached).length;
    return requests.length > 0 ? (cachedRequests / requests.length) * 100 : 0;
  };

  /**
   * Calculate maximum parallel requests
   */
  private calculateMaxParallelRequests = (
    requests: ProcessedNetworkRequest[]
  ): number => {
    // Create timeline of active requests
    const events: Array<{ time: number; type: "start" | "end" }> = [];

    requests.forEach((request) => {
      events.push({ time: request.timing.startTime, type: "start" });
      events.push({ time: request.timing.endTime, type: "end" });
    });

    // Sort by time
    events.sort((a, b) => a.time - b.time);

    // Calculate max concurrent
    let current = 0;
    let max = 0;

    events.forEach((event) => {
      if (event.type === "start") {
        current++;
        max = Math.max(max, current);
      } else {
        current--;
      }
    });

    return max;
  };

  /**
   * Classify resource type from URL and headers
   */
  private classifyResourceType = (
    url: string,
    headers: any
  ): NetworkResourceType => {
    const urlLower = url.toLowerCase();
    const contentType = headers["content-type"] || "";

    if (contentType.includes("text/html") || urlLower.includes(".html")) {
      return "document";
    }
    if (contentType.includes("javascript") || urlLower.includes(".js")) {
      return "script";
    }
    if (contentType.includes("css") || urlLower.includes(".css")) {
      return "stylesheet";
    }
    if (
      contentType.includes("image/") ||
      /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(urlLower)
    ) {
      return "image";
    }
    if (
      contentType.includes("font/") ||
      /\.(woff|woff2|ttf|otf|eot)$/i.test(urlLower)
    ) {
      return "font";
    }
    if (headers["access-control-request-method"]) {
      return "preflight";
    }
    if (contentType.includes("json") || contentType.includes("xml")) {
      return "xhr";
    }

    return "other";
  };

  /**
   * Determine if request is render-blocking
   */
  private isRenderBlocking = (request: any): boolean => {
    const url = request.url.toLowerCase();

    // CSS is typically render-blocking
    if (
      url.includes(".css") ||
      request.headers["content-type"]?.includes("css")
    ) {
      return true;
    }

    // Synchronous scripts in <head> are render-blocking
    if (
      url.includes(".js") &&
      request.headers["content-type"]?.includes("javascript")
    ) {
      // This would need more context about script placement
      return false; // Conservative default
    }

    return false;
  };

  /**
   * Determine if request is on critical path
   */
  private isOnCriticalPath = (request: any): boolean => {
    const url = request.url.toLowerCase();

    // Main document is always critical
    if (request.headers["content-type"]?.includes("text/html")) {
      return true;
    }

    // CSS for initial render
    if (url.includes(".css")) {
      return true;
    }

    // Above-the-fold images
    // This would need more sophisticated analysis

    return false;
  };

  /**
   * Get string representation of request initiator
   */
  private getInitiatorString = (initiator: any): string => {
    if (!initiator) return "unknown";

    switch (initiator.type) {
      case "parser":
        return "parser";
      case "script":
        return `script:${initiator.url || "unknown"}`;
      case "preload":
        return "preload";
      case "preflight":
        return "preflight";
      default:
        return initiator.type || "unknown";
    }
  };

  /**
   * Calculate headers size
   */
  private calculateHeadersSize = (headers: Record<string, string>): number => {
    return Object.entries(headers).reduce(
      (size, [key, value]) => size + key.length + value.length + 4,
      0
    ); // +4 for ": " and "\r\n"
  };

  /**
   * Simple logging utility
   */
  private log = (message: string, data?: any): void => {
    if (data) {
      console.log(`[NetworkAnalysis] ${message}`, data);
    } else {
      console.log(`[NetworkAnalysis] ${message}`);
    }
  };
}
