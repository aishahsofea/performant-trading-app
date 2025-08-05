import { PerformanceCollector } from "@/collectors/PerformanceCollector";
import { PerformanceConfig, WebVitalsMetric } from "@/types";
import { useRef, useEffect, useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";

export const usePerformanceMetrics = (config: PerformanceConfig) => {
  const collectorRef = useRef<PerformanceCollector | null>(null);

  useEffect(() => {
    collectorRef.current = new PerformanceCollector(config);

    return () => {
      if (collectorRef.current) {
        collectorRef.current.destroy();
      }
    };
  }, []);

  useReportWebVitals((metric: WebVitalsMetric) => {
    if (collectorRef.current) {
      collectorRef.current.handleWebVitals(metric);
    }

    if (process.env.NODE_ENV === "production") {
      console.log(`Web Vital: ${metric}`);
    }
  });

  const trackCustomMetric = (name: string, value: number) => {
    collectorRef.current?.trackCustomMetric(name, value);
  };

  const startTimer = (name: string) => {
    return collectorRef.current?.startTimer(name) || (() => {});
  };

  const trackError = useCallback(
    (error: { message: string; stack?: string }) => {
      collectorRef.current?.trackError({
        ...error,
        timestamp: Date.now(),
        url: typeof window !== "undefined" ? window.location.href : "",
        appName: config.appName,
      });
    },
    [config.appName]
  );

  const updateConfig = (newConfig: Partial<PerformanceConfig>) => {
    collectorRef.current?.updateConfig(newConfig);
  };

  const getMetrics = () => {
    return collectorRef.current?.getMetrics() || {};
  };

  return {
    trackCustomMetric,
    startTimer,
    trackError,
    updateConfig,
    getMetrics,
  };
};
