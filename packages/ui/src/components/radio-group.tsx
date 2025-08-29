import * as React from "react";
import { cn } from "../utils";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  label?: string;
  orientation?: "horizontal" | "vertical";
};

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      defaultValue,
      onChange,
      className,
      error,
      label,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ""
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = (optionValue: string) => {
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      if (onChange) {
        onChange(optionValue);
      }
    };

    return (
      <div ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium mb-2 text-gray-200">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={currentValue === option.value}
                onChange={() => handleChange(option.value)}
                disabled={option.disabled}
                className={cn(
                  "h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500 focus:ring-red-500"
                )}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="ml-2 text-sm text-gray-200"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
