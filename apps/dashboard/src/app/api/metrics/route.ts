import { PerformanceMetrics } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const metricsStore: PerformanceMetrics[] = [];

export const POST = async (request: NextRequest) => {
  try {
    const metric: PerformanceMetrics = await request.json();

    if (!metric.sessionId || !metric.timestamp) {
      return NextResponse.json(
        { error: "Invalid metric data" },
        { status: 400 }
      );
    }

    metric.timestamp = Date.now();
    metricsStore.push(metric);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing metric: ", error);
    return NextResponse.json(
      { error: "Failed to store metric" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const appName = searchParams.get("appName");
    const limit = parseInt(searchParams.get("limit") || "100");

    let filteredMetrics = [...metricsStore];

    if (startDate) {
      const start = new Date(startDate).getTime();
      filteredMetrics = filteredMetrics.filter(
        (metric) => metric.timestamp >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      filteredMetrics = filteredMetrics.filter(
        (metric) => metric.timestamp <= end
      );
    }

    if (appName && appName !== "all") {
      filteredMetrics = filteredMetrics.filter(
        (metric) => metric.appName === appName
      );
    }

    const results = filteredMetrics.slice(-limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching metrics: ", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
};
