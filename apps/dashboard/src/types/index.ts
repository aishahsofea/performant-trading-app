export type PerformanceMetrics = {
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  sessionId: string;
  userId?: string;
  appName?: string;

  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint

  // Navigation Timing
  domContentLoaded?: number;
  loadComplete?: number;

  // Custom Metrics
  customMetrics?: Record<string, number>;

  // Error Information
  errors?: ErrorMetric[];
};

export type ErrorMetric = {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  appName?: string;
};

export type WebVitalsMetric = {
  id: string;
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
  navigationType: string;
};

export type PerformanceConfig = {
  apiEndpoint?: string;
  appName?: string;
  userId?: string;
  enableErrorTracking?: boolean;
  enableCustomMetrics?: boolean;
  debounceTime?: number;
  maxRetries?: number;
};
