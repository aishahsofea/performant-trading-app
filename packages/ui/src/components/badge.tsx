"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "px-2.5",
    "py-0.5",
    "text-xs",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-border-focus",
    "focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border-primary text-content-secondary hover:bg-surface-primary",
        secondary: "border-info-600 text-info-300 hover:bg-info-950",
        destructive: "border-danger-600 text-danger-300 hover:bg-danger-950",
        success: "border-success-600 text-success-300 hover:bg-success-950",
        warning: "border-warning-600 text-warning-300 hover:bg-warning-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
