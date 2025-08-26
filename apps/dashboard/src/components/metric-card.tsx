import { WebVitalsMetric } from "@/types";

type MetricCardProps = {
  title: string;
  subtitle: string;
  value: string;
  metric: WebVitalsMetric["name"];
  numValue: number;
  description: string;
  icon: string;
};

export const MetricCard = ({
  title,
  subtitle,
  value,
  metric,
  numValue,
  description,
  icon,
}: MetricCardProps) => {
  const { grade, color } = getPerformanceGrade(metric, numValue);

  return (
    <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-300 font-medium">{subtitle}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
        >
          {grade}
        </span>
      </div>
      <div className="mb-3">
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

const getPerformanceGrade = (
  metric: WebVitalsMetric["name"],
  value: number
): { grade: string; color: string } => {
  let grade: string = "Unknown";
  let color: string = "text-gray-600 bg-gray-100";

  const COLOR_MAP: Record<string, Record<string, string>> = {
    good: {
      grade: "Good",
      color: "text-green-400 bg-green-900/30 border border-green-500/30",
    },
    needs_improvement: {
      grade: "Needs Improvement",
      color: "text-amber-400 bg-amber-900/30 border border-amber-500/30",
    },
    poor: {
      grade: "Poor",
      color: "text-red-400 bg-red-900/30 border border-red-500/30",
    },
  };

  const setGradeAndColor = (gradeKey: keyof typeof COLOR_MAP) => {
    grade = COLOR_MAP[gradeKey]?.grade ?? "";
    color = COLOR_MAP[gradeKey]?.color ?? "";
  };

  switch (metric) {
    case "LCP":
      if (value <= 2500) {
        setGradeAndColor("good");
      } else if (value <= 4000) {
        setGradeAndColor("needs_improvement");
      } else {
        setGradeAndColor("poor");
      }
      break;
    case "FID":
    case "INP":
      if (value <= 100) {
        setGradeAndColor("good");
      } else if (value <= 300) {
        setGradeAndColor("needs_improvement");
      } else {
        setGradeAndColor("poor");
      }
      break;
    case "CLS":
      if (value <= 0.1) {
        setGradeAndColor("good");
      } else if (value <= 0.25) {
        setGradeAndColor("needs_improvement");
      } else {
        setGradeAndColor("poor");
      }

    case "FCP":
      if (value <= 1800) {
        setGradeAndColor("good");
      } else if (value <= 3000) {
        setGradeAndColor("needs_improvement");
      } else {
        setGradeAndColor("poor");
      }
      break;
    case "TTFB":
      if (value <= 800) {
        setGradeAndColor("good");
      } else if (value <= 1800) {
        setGradeAndColor("needs_improvement");
      } else {
        setGradeAndColor("poor");
      }
      break;
    default:
      grade = "Unknown";
      color = "text-gray-400 bg-gray-700/50 border border-gray-600/30";
  }

  return { grade, color };
};
