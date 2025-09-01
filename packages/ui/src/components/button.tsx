import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariantsConfig = {
  variant: {
    default:
      "bg-primary text-content-primary hover:bg-primary-600 border border-primary hover:border-primary-600",
    destructive:
      "bg-danger text-content-primary hover:bg-danger-600 border border-danger hover:border-danger-600",
    outline:
      "border border-border-primary bg-transparent text-content-secondary hover:bg-surface-primary hover:text-content-primary",
    secondary:
      "bg-surface-primary text-content-secondary hover:bg-surface-secondary border border-border-primary",
    ghost:
      "hover:bg-surface-primary text-content-secondary border border-transparent",
    link: "text-primary-400 underline-offset-4 hover:underline hover:text-primary-300",
    success:
      "bg-success text-content-primary hover:bg-success-600 border border-success",
    warning:
      "bg-warning text-content-primary hover:bg-warning-600 border border-warning",
    info: "bg-info text-content-primary hover:bg-info-600 border border-info",
    profit:
      "bg-trading-profit text-content-primary hover:bg-success-600 border border-trading-profit",
    loss: "bg-trading-loss text-content-primary hover:bg-danger-600 border border-trading-loss",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
    link: "px-2 py-1",
  },
};

export type ButtonVariant = keyof (typeof buttonVariantsConfig)["variant"];
export type ButtonSize = keyof (typeof buttonVariantsConfig)["size"];

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "whitespace-nowrap",
    "rounded-md",
    "text-sm",
    "font-medium",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-border-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background-primary",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: buttonVariantsConfig,
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariantsConfig };
