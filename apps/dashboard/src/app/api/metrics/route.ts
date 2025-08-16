import { PerformanceMetrics } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { metricsStorage } from "@/lib/metricsStorage";

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

    await metricsStorage.store(metric);

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

    const filteredMetrics = await metricsStorage.getFiltered({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      appName: appName || undefined,
      limit,
    });

    console.log("Fetched metrics:", filteredMetrics);

    return NextResponse.json(filteredMetrics);
  } catch (error) {
    console.error("Error fetching metrics: ", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
};
