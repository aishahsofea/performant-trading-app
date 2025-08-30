import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type SpinnerProps = {
  text?: string;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants>;

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, text, ...props }, ref) => {
    if (text) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center justify-center gap-4",
            className
          )}
          {...props}
        >
          <div className={cn(spinnerVariants({ size }))} />
          <div className="text-lg text-content-secondary">{text}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
