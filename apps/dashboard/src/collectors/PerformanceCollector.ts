import {
  ErrorMetric,
  PerformanceConfig,
  PerformanceMetrics,
  WebVitalsMetric,
} from "@/types";

export class PerformanceCollector {
  private sessionId: string;
  private config: PerformanceConfig;
  private metrics: Partial<PerformanceMetrics> = {};
  private customMetrics: Record<string, number> = {};
  private errors: ErrorMetric[] = [];
  private retryCount = 0;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      apiEndpoint: "/api/metrics",
      appName: "default",
      userId: undefined,
      enableErrorTracking: true,
      enableCustomMetrics: true,
      debounceTime: 2000,
      maxRetries: 3,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.initializeMetrics();

    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private initializeMetrics() {
    this.metrics = {
      id: this.generateSessionId(),
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
      sessionId: this.sessionId,
      userId: this.config.userId,
      appName: this.config.appName,
      customMetrics: {},
      errors: [],
    };
  }

  private setupErrorTracking() {
    if (typeof window === "undefined") return;

    window.addEventListener("error", (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: event.filename || window.location.href,
        appName: this.config.appName,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.trackError({
        message: event.reason?.message || "Unhandled Promise Rejection",
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        appName: this.config.appName,
      });
    });
  }

  public trackError(error: ErrorMetric) {
    this.errors.push(error);
    this.metrics.errors = this.errors;
  }

  public handleWebVitals(metric: WebVitalsMetric) {
    switch (metric.name) {
      case "CLS":
        this.metrics.cls = metric.value;
        break;
      case "FID":
        this.metrics.fid = metric.value;
        break;
      case "FCP":
        this.metrics.fcp = metric.value;
        break;
      case "LCP":
        this.metrics.lcp = metric.value;
        break;
      case "TTFB":
        this.metrics.ttfb = metric.value;
        break;
      case "INP":
        this.metrics.inp = metric.value;
        break;
    }

    this.debouncedSendMetrics();
  }

  private debouncedSendMetrics() {
    this.debounce(() => {
      this.sendMetrics();
    }, this.config.debounceTime || 2000)();
  }

  private debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  public async sendMetrics(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    try {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.startTime;
        this.metrics.loadComplete =
          navigation.loadEventEnd - navigation.startTime;
      }

      const response = await fetch(this.config.apiEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...this.metrics,
          customMetrics: this.customMetrics,
          errors: this.errors,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.retryCount = 0; // Reset retry count on successful send
      return true;
    } catch (error) {
      console.error("Failed to send metrics: ", error);

      // Retry logic
      if (this.retryCount < (this.config.maxRetries ?? 3)) {
        this.retryCount++;
        setTimeout(() => {
          this.sendMetrics();
        }, 1000 * this.retryCount);
      }
      return false;
    }
  }

  public trackCustomMetric(name: string, value: number) {
    if (!this.config.enableCustomMetrics) return;

    this.customMetrics[name] = value;
    this.metrics.customMetrics = this.customMetrics;
  }

  public startTimer(name: string): () => void {
    const startime = performance.now();

    return () => {
      const duration = performance.now() - startime;
      this.trackCustomMetric(name, duration);
    };
  }

  public updateConfig(newConfig: Partial<PerformanceConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.metrics.userId = this.config.userId;
    this.metrics.appName = this.config.appName;
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public destroy() {
    this.sendMetrics();
  }
}
