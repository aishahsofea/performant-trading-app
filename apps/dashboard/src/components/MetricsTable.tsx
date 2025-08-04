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
    <div className="rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-950">
        <h3 className="text-xl font-semibold text-gray-50">Recent Metrics</h3>
        <p className="text-sm text-gray-300 mt-1">
          Latest performance data across all applications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {metrics
              .slice(-10)
              .reverse()
              .map((metric, index) => (
                <tr
                  key={`${metric.id}-${index}`}
                  className={index % 2 === 0 ? "bg-gray-950" : "bg-gray-900"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(metric.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {metric.appName || "unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">
                    {metric.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {metric.lcp ? `${metric.lcp.toFixed(0)}ms` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {metric.fid ? `${metric.fid.toFixed(0)}ms` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {metric.cls !== undefined
                      ? `${metric.cls.toFixed(0)}ms`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        metric.errors?.length || 0 > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
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
