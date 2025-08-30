import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const alertVariants = cva(
  "p-3 border rounded-md",
  {
    variants: {
      variant: {
        success: "bg-success-900/20 border-success",
        error: "bg-danger-900/20 border-danger",
        warning: "bg-warning-900/20 border-warning",
        info: "bg-info-900/20 border-info",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const alertTextVariants = cva(
  "text-sm font-medium",
  {
    variants: {
      variant: {
        success: "text-success-400",
        error: "text-danger-400",
        warning: "text-warning-400",
        info: "text-info-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export type AlertProps = {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info";
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <p className={cn(alertTextVariants({ variant }))}>
          {children}
        </p>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };