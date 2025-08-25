import { PerformanceDashboard } from "@/components/performance-dashboard";

export default function PerformancePage() {
  return (
    <PerformanceDashboard
      title="Trading Dashboard Performance"
      apiEndpoint="/api/metrics"
      showAppFilter={true}
    />
  );
}
