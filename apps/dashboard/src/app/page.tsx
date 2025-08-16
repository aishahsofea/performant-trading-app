"use client";

import { usePerformance } from "@/providers";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Trading Dashboard that comes with Performance Monitoring
      </h1>

      <div>
        <h3 className="text-lg font-semibold">
          Button clicked {clickCount} times
        </h3>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4 my-2"
          onClick={handleClick}
        >
          Test performance tracking (10% error rate)
        </button>
      </div>

      <div className="mt-8">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          onClick={() => window.location.reload()}
        >
          Reload (Generate new metrics)
        </button>
        <Link
          className="text-white px-4 py-2 rounded hover:text-blue-600 mr-4 min-h-12"
          href="/performance"
        >
          View performance dashboard
        </Link>
      </div>
    </div>
  );
}
