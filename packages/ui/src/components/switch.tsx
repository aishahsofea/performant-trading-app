"use client";

import * as React from "react";
import { cn } from "../utils";

const Switch = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input"> & {
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  }
>(({ className, onCheckedChange, onChange, label, id, ...props }, ref) => {
  const switchId = id || `switch-${React.useId()}`;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        role="switch"
        ref={ref}
        id={switchId}
        className={cn(
          "peer h-6 w-11 shrink-0 cursor-pointer appearance-none items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          "bg-gray-600 checked:bg-blue-600",
          "relative before:absolute before:left-0 before:top-0 before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow-lg before:transition-transform before:content-['']",
          "checked:before:translate-x-5",
          className
        )}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
});
Switch.displayName = "Switch";

export { Switch };
