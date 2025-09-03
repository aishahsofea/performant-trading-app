import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

// Deliberately heavy button with excessive DOM elements and styles
const heavyButtonVariantsConfig = {
  variant: {
    default:
      "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl animate-pulse",
    destructive:
      "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl animate-bounce",
    outline:
      "border-4 border-dashed border-gradient-to-r from-cyan-500 to-blue-500 bg-transparent text-gradient shadow-xl transform transition-all duration-500 hover:scale-105 hover:rotate-1",
    heavy:
      "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl transform transition-all duration-700 hover:scale-110 hover:rotate-3 hover:shadow-3xl animate-ping",
  },
  size: {
    default: "h-16 px-8 py-4 text-lg font-bold",
    sm: "h-12 px-6 py-3 text-md font-semibold",
    lg: "h-20 px-12 py-6 text-xl font-black",
    xl: "h-24 px-16 py-8 text-2xl font-black",
  },
};

const heavyButtonVariants = cva(
  [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "whitespace-nowrap",
    "rounded-3xl",
    "font-extrabold",
    "text-shadow",
    "transition-all",
    "duration-700",
    "ease-in-out",
    "transform",
    "hover:scale-105",
    "focus:scale-105",
    "active:scale-95",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-purple-500",
    "focus-visible:ring-offset-4",
    "focus-visible:ring-offset-black",
    "disabled:pointer-events-none",
    "disabled:opacity-30",
    "cursor-pointer",
    "overflow-hidden",
    "backdrop-blur-xl",
    "border-2",
    "border-solid",
    "border-opacity-30",
    "before:absolute",
    "before:inset-0",
    "before:bg-gradient-to-r",
    "before:from-transparent",
    "before:via-white",
    "before:to-transparent",
    "before:opacity-20",
    "before:transform",
    "before:skew-x-12",
    "before:translate-x-[-100%]",
    "hover:before:translate-x-[100%]",
    "before:transition-transform",
    "before:duration-1000",
    "after:absolute",
    "after:inset-0",
    "after:bg-gradient-to-bl",
    "after:from-transparent",
    "after:via-purple-500",
    "after:to-transparent",
    "after:opacity-10",
    "after:animate-spin",
    "after:duration-[3000ms]",
  ],
  {
    variants: heavyButtonVariantsConfig,
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type HeavyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof heavyButtonVariants> & {
    withExcessiveElements?: boolean;
    animationIntensity?: "low" | "medium" | "high" | "extreme";
  };

const HeavyButton = React.forwardRef<HTMLButtonElement, HeavyButtonProps>(
  (
    {
      className,
      variant,
      size,
      type = "button",
      children,
      withExcessiveElements = true,
      animationIntensity = "high",
      ...props
    },
    ref
  ) => {
    // Generate excessive nested elements for performance impact
    const excessiveElements = withExcessiveElements
      ? Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className={`absolute inset-0 opacity-${Math.floor(
              Math.random() * 20
            )} bg-gradient-to-r from-purple-${100 + ((i * 10) % 900)} to-pink-${
              100 + ((i * 15) % 900)
            } animate-pulse`}
            style={{
              animationDelay: `${i * 50}ms`,
              animationDuration: `${1000 + i * 100}ms`,
              transform: `rotate(${i * 7.2}deg) scale(${0.8 + i * 0.01})`,
            }}
          />
        ))
      : null;

    const intensityClasses = {
      low: "animate-pulse",
      medium: "animate-pulse hover:animate-bounce",
      high: "animate-pulse hover:animate-bounce focus:animate-spin",
      extreme:
        "animate-pulse hover:animate-bounce focus:animate-spin active:animate-ping",
    };

    return (
      <button
        type={type}
        className={cn(
          heavyButtonVariants({ variant, size }),
          intensityClasses[animationIntensity],
          className
        )}
        ref={ref}
        {...props}
      >
        {excessiveElements}

        {/* Multiple nested shadow layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-l from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10 rounded-3xl blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-lg" />

        {/* Content wrapper with excessive styling */}
        <span className="relative z-10 flex items-center justify-center gap-2 text-shadow-lg drop-shadow-2xl filter brightness-110 contrast-125 saturate-150">
          {/* Decorative elements */}
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />

          {children}

          {/* More decorative elements */}
          <span className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
        </span>

        {/* Floating animation elements */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={`float-${i}`}
            className={`absolute w-1 h-1 bg-white rounded-full animate-bounce opacity-60`}
            style={{
              top: `${10 + i * 15}%`,
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: `${800 + i * 200}ms`,
            }}
          />
        ))}
      </button>
    );
  }
);

HeavyButton.displayName = "HeavyButton";

export { HeavyButton, heavyButtonVariantsConfig };
