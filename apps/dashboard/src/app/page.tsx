"use client";

import { usePerformance } from "@/providers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components";

export default function Home() {
  const { trackCustomMetric, startTimer, trackError } = usePerformance();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    trackCustomMetric("page_loads", 1);
  }, [trackCustomMetric]);

  const handleClick = () => {
    const endTimer = startTimer("button_click");

    try {
      setClickCount((prev) => prev + 1);
      trackCustomMetric("button_clicks", 1);

      // simulate error for demonstration
      if (Math.random() < 0.1) {
        throw new Error("Simulated error on button click");
      }
    } catch (error) {
      trackError({
        message: "An error occurred during button click",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      endTimer();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-white">
            Trading Dashboard
          </h1>
          <p className="text-gray-400 text-center mb-6">
            High-performance trading platform with real-time monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Performance Testing
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Button clicks:</span>
                <span className="text-violet-400 font-mono text-lg">
                  {clickCount}
                </span>
              </div>
              <Button
                variant="default"
                onClick={handleClick}
                className="w-full"
              >
                Test Performance Tracking
              </Button>
              <p className="text-gray-500 text-sm">
                Simulates 10% error rate for testing
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Generate New Metrics
              </Button>
              <Link href="/performance">
                <Button variant="outline" className="w-full">
                  View Performance Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 border border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-green-500 text-lg">●</span>
              <div>
                <p className="text-white font-medium">Trading Engine</p>
                <p className="text-gray-400 text-sm">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500 text-lg">●</span>
              <div>
                <p className="text-white font-medium">Market Data</p>
                <p className="text-gray-400 text-sm">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-violet-500 text-lg">●</span>
              <div>
                <p className="text-white font-medium">Performance Monitor</p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
