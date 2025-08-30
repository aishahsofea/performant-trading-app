import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const textareaVariants = cva(
  "w-full border rounded-md px-3 py-2.5 text-sm transition-colors resize-vertical placeholder-content-tertiary focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "border-border-primary text-content-primary bg-surface-primary hover:border-border-secondary focus:ring-border-focus focus:border-border-focus",
        error: "border-danger text-content-primary bg-surface-primary hover:border-danger-400 focus:ring-danger focus:border-danger",
        success: "border-success text-content-primary bg-surface-primary hover:border-success-400 focus:ring-success focus:border-success",
      },
      size: {
        sm: "px-2 py-1.5 text-xs",
        default: "px-3 py-2.5 text-sm",
        lg: "px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const labelVariants = cva(
  "block font-medium mb-2",
  {
    variants: {
      variant: {
        default: "text-content-secondary text-sm",
        error: "text-danger-400 text-sm",
        success: "text-success-400 text-sm",
        light: "text-content-tertiary text-sm",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const errorVariants = cva("mt-1 text-xs", {
  variants: {
    variant: {
      default: "text-danger-400",
      error: "text-danger-400",
      success: "text-success-400",
      light: "text-danger-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type TextareaProps = {
  label?: string;
  error?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, error, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const effectiveVariant = error ? "error" : variant;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(labelVariants({ variant: effectiveVariant, size }))}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(textareaVariants({ variant: effectiveVariant, size }), className)}
          {...props}
        />
        {error && (
          <p className={cn(errorVariants({ variant: effectiveVariant }))} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };