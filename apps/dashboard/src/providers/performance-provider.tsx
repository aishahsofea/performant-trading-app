"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { PerformanceConfig } from "@/types";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";

type PerformanceContextType = {
  trackCustomMetric: (name: string, value: number) => void;
  startTimer: (name: string) => () => void;
  trackError: (error: { message: string; stack?: string }) => void;
  updateConfig: (config: Partial<PerformanceConfig>) => void;
  getMetrics: () => any;
};

export const PerformanceContext = createContext<PerformanceContextType | null>(
  null
);

type PerformanceProviderProps = {
  children: ReactNode;
  config?: PerformanceConfig;
};

export const PerformanceProvider = ({
  children,
  config = {},
}: PerformanceProviderProps): React.JSX.Element => {
  const performance = usePerformanceMetrics(config);
  return (
    <PerformanceContext.Provider value={performance}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
