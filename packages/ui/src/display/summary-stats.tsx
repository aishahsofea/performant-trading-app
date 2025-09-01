import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const summaryStatsVariants = cva([
  "bg-surface-primary",
  "border",
  "border-border-primary",
  "p-6",
  "rounded-lg",
  "shadow-lg",
],
  {
    variants: {
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
      variant: {
        default: "bg-surface-primary border-border-primary",
        success: "bg-success-900/20 border-success",
        warning: "bg-warning-900/20 border-warning",
        danger: "bg-danger-900/20 border-danger",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const iconContainerVariants = cva(["py-4", "px-5", "rounded-full", "mr-4"], {
  variants: {
    variant: {
      default: "bg-surface-secondary border border-border-primary",
      success: "bg-success-800/40 border border-success-600",
      warning: "bg-warning-800/40 border border-warning-600",
      danger: "bg-danger-800/40 border border-danger-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const valueVariants = cva(["text-3xl", "font-bold"], {
  variants: {
    variant: {
      default: "text-primary-400",
      success: "text-success-400",
      warning: "text-warning-400",
      danger: "text-danger-400",
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
            <h3 className="text-lg font-semibold text-content-primary">{title}</h3>
            <p className={cn(valueVariants({ variant }))}>{value}</p>
          </div>
        </div>
      </div>
    );
  }
);
SummaryStats.displayName = "SummaryStats";

export { SummaryStats };
