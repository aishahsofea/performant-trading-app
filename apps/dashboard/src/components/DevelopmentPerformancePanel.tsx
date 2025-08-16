'use client';

import { useState, useEffect } from 'react';

type DevPerformanceData = {
  buildTime?: number;
  hmrTime?: number;
  bundleSize?: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

// Extend Performance interface to include memory property
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

export function DevelopmentPerformancePanel() {
  const [devData, setDevData] = useState<DevPerformanceData>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      
      // Monitor performance in development
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && 'performance' in window) {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const memory = performance.memory;
          
          setDevData({
            buildTime: navigation?.loadEventEnd - navigation?.loadEventStart,
            memoryUsage: memory?.usedJSHeapSize,
            cpuUsage: window.navigator?.hardwareConcurrency,
          });
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold text-yellow-400">🚧 DEV PERFORMANCE</div>
      
      <div className="space-y-1">
        {devData.buildTime && (
          <div>⏱️ Load: {Math.round(devData.buildTime)}ms</div>
        )}
        
        {devData.memoryUsage && (
          <div>🧠 Memory: {(devData.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        )}
        
        <div className="pt-1 border-t border-gray-600">
          <div className="text-gray-400">Quick Actions:</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 mr-2"
          >
            Reload
          </button>
          <button 
            onClick={() => console.log('Performance entries:', performance.getEntries())}
            className="text-green-400 hover:text-green-300"
          >
            Log Perf
          </button>
        </div>
      </div>
    </div>
  );
}