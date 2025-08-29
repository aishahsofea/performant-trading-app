import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const alertVariants = cva(
  "p-3 border rounded-md",
  {
    variants: {
      variant: {
        success: "bg-green-900/20 border-green-500",
        error: "bg-red-900/20 border-red-500",
        warning: "bg-amber-900/20 border-amber-500",
        info: "bg-blue-900/20 border-blue-500",
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
        success: "text-green-400",
        error: "text-red-400",
        warning: "text-amber-400",
        info: "text-blue-400",
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