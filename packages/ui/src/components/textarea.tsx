import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const textareaVariants = cva(
  "w-full border rounded-md px-3 py-2.5 text-sm transition-colors resize-vertical placeholder-gray-400 focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "border-gray-600 text-gray-100 bg-gray-800 hover:border-gray-500 focus:ring-purple-500 focus:border-purple-500",
        error: "border-red-500 text-gray-100 bg-gray-800 hover:border-red-400 focus:ring-red-500 focus:border-red-500",
        success: "border-green-500 text-gray-100 bg-gray-800 hover:border-green-400 focus:ring-green-500 focus:border-green-500",
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
        default: "text-gray-200 text-sm",
        error: "text-red-400 text-sm",
        success: "text-green-400 text-sm",
        light: "text-gray-700 text-sm",
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
      default: "text-red-400",
      error: "text-red-400",
      success: "text-green-400",
      light: "text-red-600",
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