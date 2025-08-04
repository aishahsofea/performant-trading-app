import { PerformanceDashboard } from "@/components/PerformanceDashboard";

export default function PerformancePage() {
  return (
    <PerformanceDashboard
      title="Trading Dashboard Performance"
      apiEndpoint="/api/metrics"
      showAppFilter={true}
    />
  );
}
