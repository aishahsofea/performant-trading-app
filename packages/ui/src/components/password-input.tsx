import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const passwordInputVariants = cva(
  "w-full border rounded-md px-3 pr-10 text-sm transition-colors placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-border-primary text-content-primary bg-surface-primary hover:border-border-secondary",
        error:
          "border-danger text-content-primary bg-surface-primary hover:border-danger-400 focus:ring-danger focus:border-danger",
      },
      size: {
        default: "py-2.5",
        sm: "py-2",
        lg: "py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const toggleButtonVariants = cva(
  "absolute inset-y-0 right-0 pr-3 flex items-center text-content-tertiary transition-colors",
  {
    variants: {
      state: {
        enabled: "hover:text-content-secondary cursor-pointer",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      state: "enabled",
    },
  }
);

export type PasswordInputProps = {
  label: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> &
  VariantProps<typeof passwordInputVariants>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, variant, size, label, error, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputVariant = error ? "error" : variant;

    return (
      <>
        <label
          htmlFor={props.id}
          className="block text-sm font-medium mb-2 text-content-secondary"
        >
          {label}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              passwordInputVariants({ variant: inputVariant, size, className })
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          <button
            type="button"
            onClick={
              disabled ? undefined : () => setShowPassword(!showPassword)
            }
            className={cn(
              toggleButtonVariants({
                state: disabled ? "disabled" : "enabled",
              })
            )}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
