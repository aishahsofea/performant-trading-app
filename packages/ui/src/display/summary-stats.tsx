import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const summaryStatsVariants = cva(
  "bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg",
  {
    variants: {
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
      variant: {
        default: "bg-gray-800 border-gray-600",
        success: "bg-green-900/20 border-green-500",
        warning: "bg-amber-900/20 border-amber-500",
        danger: "bg-red-900/20 border-red-500",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const iconContainerVariants = cva("py-4 px-5 rounded-full mr-4", {
  variants: {
    variant: {
      default: "bg-gray-700 border border-gray-600",
      success: "bg-green-800/40 border border-green-600",
      warning: "bg-amber-800/40 border border-amber-600",
      danger: "bg-red-800/40 border border-red-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const valueVariants = cva("text-3xl font-bold", {
  variants: {
    variant: {
      default: "text-violet-400",
      success: "text-green-400",
      warning: "text-amber-400",
      danger: "text-red-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type SummaryStatsProps = {
  icon: string;
  title: string;
  value: number | string;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof summaryStatsVariants>;

const SummaryStats = React.forwardRef<HTMLDivElement, SummaryStatsProps>(
  ({ className, size, variant, icon, title, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(summaryStatsVariants({ size, variant }), className)}
        {...props}
      >
        <div className="flex items-center">
          <div className={cn(iconContainerVariants({ variant }))}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className={cn(valueVariants({ variant }))}>{value}</p>
          </div>
        </div>
      </div>
    );
  }
);
SummaryStats.displayName = "SummaryStats";

export { SummaryStats };
