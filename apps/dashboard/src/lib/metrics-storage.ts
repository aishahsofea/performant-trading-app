import { PerformanceMetrics } from "@/types";
import { promises as fs } from "fs";
import path from "path";

class MetricsStorage {
  private dataDir: string;
  private dataFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), "data");
    this.dataFile = path.join(this.dataDir, "metrics.json");
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async readMetrics(): Promise<PerformanceMetrics[]> {
    try {
      const data = await fs.readFile(this.dataFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeMetrics(metrics: PerformanceMetrics[]): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(this.dataFile, JSON.stringify(metrics, null, 2));
  }

  async store(metric: PerformanceMetrics): Promise<void> {
    const metrics = await this.readMetrics();
    metrics.push(metric);

    // Keep only last 10,000 metrics to prevent unbounded growth
    if (metrics.length > 10000) {
      metrics.splice(0, metrics.length - 10000);
    }

    await this.writeMetrics(metrics);
  }

  async getAll(): Promise<PerformanceMetrics[]> {
    return await this.readMetrics();
  }

  async getByDateRange(
    startDate?: string,
    endDate?: string
  ): Promise<PerformanceMetrics[]> {
    const metrics = await this.readMetrics();

    let filtered = metrics;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set to 12:00 AM local time
      filtered = filtered.filter((m) => m.timestamp >= start.getTime());
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to 11:59:59.999 PM local time
      filtered = filtered.filter((m) => m.timestamp <= end.getTime());
    }

    return filtered;
  }

  async getByApp(appName: string): Promise<PerformanceMetrics[]> {
    const metrics = await this.readMetrics();
    return metrics.filter((m) => m.appName === appName);
  }

  async getFiltered(filters: {
    startDate?: string;
    endDate?: string;
    appName?: string;
    limit?: number;
  }): Promise<PerformanceMetrics[]> {
    const metrics = await this.readMetrics();
    let filtered = [...metrics];

    console.log({
      startDate: filters.startDate,
      endDate: filters.endDate,
      appName: filters.appName,
    });

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0); // Set to 12:00 AM local time
      const start = startDate.getTime();
      filtered = filtered.filter((m) => m.timestamp >= start);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to 11:59:59.999 PM local time
      const end = endDate.getTime();
      filtered = filtered.filter((m) => m.timestamp <= end);
    }

    if (filters.appName && filters.appName !== "all") {
      filtered = filtered.filter((m) => m.appName === filters.appName);
    }

    // Apply limit and return most recent entries
    if (filters.limit) {
      filtered = filtered.slice(-filters.limit);
    }

    return filtered;
  }
}

export const metricsStorage = new MetricsStorage();
