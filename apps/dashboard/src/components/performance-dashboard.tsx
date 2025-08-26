"use client";

import { useEffect, useState } from "react";
import { PerformanceMetrics } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { DateInput } from "./date-input";
import { MetricCard } from "./metric-card";
import { SummaryStat } from "./summary-stat";
import { MetricsTable } from "./metrics-table";

type MetricsSummary = {
  avgLCP: number;
  avgFID: number;
  avgCLS: number;
  avgTTFB: number;
  avgFCP: number;
  avgINP: number;
  totalErrors: number;
  totalSessions: number;
  appBreakdown: Record<string, number>;
};

type PerformanceDashboardProps = {
  apiEndpoint?: string;
  title?: string;
  showAppFilter?: boolean;
};

export const PerformanceDashboard = ({
  apiEndpoint = "/api/metrics",
  title = "Performance Dashboard",
  showAppFilter = true,
}: PerformanceDashboardProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const debouncedDateRange = useDebounce(dateRange, 1000);

  useEffect(() => {
    fetchMetrics();
  }, [debouncedDateRange, selectedApp]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        startDate: dateRange.start ?? "",
        endDate: dateRange.end ?? "",
        limit: "1000",
      });

      if (selectedApp !== "all") {
        params.append("appName", selectedApp);
      }

      const response = await fetch(`${apiEndpoint}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setMetrics(data || []);
      calculateSummary(data || []);
    } catch (error) {
      console.error(`failed to fetch metrics: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: PerformanceMetrics[]) => {
    if (data.length === 0) {
      setSummary(null);
      return;
    }

    const validMetrics = data.filter(
      (m) =>
        m.lcp !== undefined ||
        m.fid !== undefined ||
        m.cls !== undefined ||
        m.ttfb !== undefined ||
        m.fcp !== undefined ||
        m.inp !== undefined
    );

    const appBreakdown: Record<string, number> = {};
    data.forEach((metric) => {
      const app = metric.appName || "Unknown";
      appBreakdown[app] = (appBreakdown[app] || 0) + 1;
    });

    const summary: MetricsSummary = {
      avgLCP: calculateAverage(validMetrics, "lcp"),
      avgFID: calculateAverage(validMetrics, "fid"),
      avgCLS: calculateAverage(validMetrics, "cls"),
      avgTTFB: calculateAverage(validMetrics, "ttfb"),
      avgFCP: calculateAverage(validMetrics, "fcp"),
      avgINP: calculateAverage(validMetrics, "inp"),
      totalErrors: data.reduce(
        (sum, metric) => sum + (metric.errors?.length || 0),
        0
      ),
      totalSessions: new Set(data.map((metric) => metric.sessionId)).size,
      appBreakdown,
    };

    setSummary(summary);
  };

  const calculateAverage = (
    metrics: PerformanceMetrics[],
    field: keyof PerformanceMetrics
  ): number => {
    const values = metrics
      .map((metric) => metric[field] as number)
      .filter((val) => val !== null && !isNaN(val));

    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  };

  const getUniqueApps = () => {
    const apps = new Set(metrics.map((metric) => metric.appName || "Unknown"));
    return Array.from(apps).sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <div className="text-lg text-white">
            Loading performance metrics...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">{title}</h1>
          <p className="text-gray-400">
            Real-time performance monitoring and analytics
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Filters & Date Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
            {/* Start date */}
            <div className="flex flex-col">
              <DateInput
                label="Start Date"
                id="start-date"
                value={dateRange.start}
                handleChange={(date) =>
                  setDateRange((prev) => ({ ...prev, start: date }))
                }
              />
            </div>
            {/* End date */}
            <div className="flex flex-col">
              <DateInput
                label="End Date"
                id="end-date"
                value={dateRange.end}
                handleChange={(date) =>
                  setDateRange((prev) => ({ ...prev, end: date }))
                }
              />
            </div>

            {showAppFilter && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-200 mb-2"
                  htmlFor="application"
                >
                  Application
                </label>
                <Select
                  options={[
                    { value: "all", label: "All applications" },
                    ...getUniqueApps().map((app) => ({ value: app, label: app }))
                  ]}
                  value={selectedApp}
                  onChange={setSelectedApp}
                  placeholder="Select application"
                />
              </div>
            )}
          </div>
          <Button onClick={fetchMetrics} className="mt-4">
            Apply Filters
          </Button>
        </div>

        {summary ? (
          <>
            {/* App Breakdown */}
            {showAppFilter && Object.keys(summary.appBreakdown).length >= 1 && (
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Application Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(summary.appBreakdown).map(([app, count]) => (
                    <div
                      key={app}
                      className="text-center bg-gray-700 rounded-lg p-4"
                    >
                      <p className="text-2xl font-bold text-violet-400">
                        {count}
                      </p>
                      <p className="text-sm text-gray-300">{app}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Largest Contentful Paint"
                subtitle="LCP"
                value={`${summary.avgLCP.toFixed(0)}ms`}
                metric="LCP"
                numValue={summary.avgLCP}
                description="Time until largest element is rendered"
                icon="🎯"
              />
              <MetricCard
                title="First Input Delay"
                subtitle="FID"
                value={`${summary.avgFID.toFixed(0)}ms`}
                metric="FID"
                numValue={summary.avgFID}
                description="Time until page responds to first interaction"
                icon="⚡️"
              />
              <MetricCard
                title="Cumulative Layout Shift"
                subtitle="CLS"
                value={`${summary.avgCLS.toFixed(0)}ms`}
                metric="CLS"
                numValue={summary.avgCLS}
                description="Visual stability of the page"
                icon="📐"
              />
              <MetricCard
                title="Time to First Byte"
                subtitle="TTFB"
                value={`${summary.avgTTFB.toFixed(0)}ms`}
                metric="TTFB"
                numValue={summary.avgTTFB}
                description="Server response time"
                icon="🚀"
              />
              <MetricCard
                title="Interaction to Next Paint"
                subtitle="INP"
                value={`${summary.avgINP.toFixed(0)}ms`}
                metric="INP"
                numValue={summary.avgINP}
                description="Responsiveness to user interactions"
                icon="👆"
              />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryStat
                icon="👥"
                title="Total Sessions"
                value={summary.totalSessions}
              />
              <SummaryStat
                icon="⚠️"
                title="Total Errors"
                value={summary.totalErrors}
              />
              <SummaryStat
                icon="📊"
                title="Error Rate"
                value={
                  summary.totalSessions > 0
                    ? `${(
                        (summary.totalErrors / summary.totalSessions) *
                        100
                      ).toFixed(2)}%`
                    : "0%"
                }
              />
            </div>

            {/* Recent Metrics Table */}
            <MetricsTable metrics={metrics} />
          </>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-white">
              No data available
            </h3>
            <p className="text-gray-400">
              No performance metrics found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
