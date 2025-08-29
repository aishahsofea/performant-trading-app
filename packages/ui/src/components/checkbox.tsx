import * as React from "react";
import { cn } from "../utils";

export type CheckboxProps = {
  label?: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <>
        <div className="flex items-center">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-600 rounded bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label htmlFor={props.id} className="ml-2 text-sm text-gray-200">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
