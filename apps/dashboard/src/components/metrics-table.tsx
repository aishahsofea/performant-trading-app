import { PerformanceMetrics } from "@/types";

type MetricsTableProps = {
  metrics: PerformanceMetrics[];
};

export const MetricsTable = ({ metrics }: MetricsTableProps) => {
  const columns = [
    { header: "Timestamp", accessorKey: "timestamp" },
    { header: "App", accessorKey: "appName" },
    { header: "URL", accessorKey: "url" },
    { header: "LCP", accessorKey: "lcp" },
    { header: "FID", accessorKey: "fid" },
    { header: "CLS", accessorKey: "cls" },
    { header: "Errors", accessorKey: "errors" },
  ];

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-600">
        <h3 className="text-xl font-semibold text-white">Recent Metrics</h3>
        <p className="text-sm text-gray-400 mt-1">
          Latest performance data across all applications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {metrics
              .slice(-10)
              .reverse()
              .map((metric, index) => (
                <tr
                  key={`${metric.id}-${index}`}
                  className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700/50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {new Date(metric.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {metric.appName || "unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate text-gray-200">
                    {metric.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-400 font-mono">
                    {metric.lcp ? `${metric.lcp.toFixed(0)}ms` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-400 font-mono">
                    {metric.fid ? `${metric.fid.toFixed(0)}ms` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-violet-400 font-mono">
                    {metric.cls !== undefined
                      ? `${metric.cls.toFixed(0)}ms`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        metric.errors?.length || 0 > 0
                          ? "bg-red-900/30 text-red-400 border border-red-500/30"
                          : "bg-green-900/30 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {metric.errors?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
