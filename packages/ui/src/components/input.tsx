import * as React from "react";
import { cn } from "../utils";

export type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium mb-2 text-content-secondary"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-border-primary text-content-primary px-3 py-2 text-sm hover:border-border-secondary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-danger focus-visible:ring-danger",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-danger-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
