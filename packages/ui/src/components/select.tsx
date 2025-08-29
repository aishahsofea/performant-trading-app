"use client";

import * as React from "react";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "../utils";

type Option = {
  value: string;
  label: string;
};

// Context for compositional API
const SelectContext = createContext<{
  value: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedLabel?: string;
  setSelectedLabel?: (label: string) => void;
}>({
  value: "",
  isOpen: false,
  setIsOpen: () => {},
});

// Simple API Props
type SimpleSelectProps = {
  id: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
};

// Compositional API Props
type CompositeSelectProps = {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
};

type SelectProps = SimpleSelectProps | CompositeSelectProps;

// Type guard to differentiate between APIs
function isSimpleSelect(props: SelectProps): props is SimpleSelectProps {
  return "options" in props;
}

export const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compositional API
  const {
    value,
    onValueChange,
    children,
    disabled = false,
    className = "",
    label,
    error,
  } = props as CompositeSelectProps;

  // Extract label from children when value changes
  useEffect(() => {
    if (value && children) {
      const findLabelFromChildren = (
        children: React.ReactNode,
        targetValue: string
      ): string => {
        let foundLabel = "";

        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child)) {
            // Handle Fragment case (React.Fragment or <>)
            const childProps = child.props as {
              children?: React.ReactNode;
              value?: string;
            };
            if (child.type === React.Fragment && child.props) {
              foundLabel = findLabelFromChildren(
                childProps.children,
                targetValue
              );
            }
            // Check by displayName instead of direct type comparison
            else if (
              child.type &&
              typeof child.type === "function" &&
              (child.type as React.ComponentType<any>).displayName ===
                "SelectContent"
            ) {
              foundLabel = findLabelFromChildren(
                childProps.children,
                targetValue
              );
            } else if (
              child.type &&
              typeof child.type === "function" &&
              (child.type as React.ComponentType<any>).displayName ===
                "SelectItem" &&
              childProps.value === targetValue
            ) {
              foundLabel = childProps.children?.toString() || targetValue;
            }
            // Also check direct type comparison as fallback
            else if (child.type === SelectContent) {
              foundLabel = findLabelFromChildren(
                childProps.children,
                targetValue
              );
            } else if (
              child.type === SelectItem &&
              childProps.value === targetValue
            ) {
              foundLabel = childProps.children?.toString() || targetValue;
            }
          }
        });

        return foundLabel;
      };

      const label = findLabelFromChildren(children, value);
      if (label) {
        setSelectedLabel(label);
      }
    }
  }, [value, children]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-200">
          {label}
        </label>
      )}
      <SelectContext.Provider
        value={{
          value,
          onValueChange,
          isOpen,
          setIsOpen,
          selectedLabel,
          setSelectedLabel,
        }}
      >
        <div ref={selectRef} className={cn("relative", className)}>
          {children}
        </div>
      </SelectContext.Provider>
      {error && (
        <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}
    </>
  );
};

// Compositional API - Individual components for flexibility
const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }
>(({ className, children, onClick, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-white bg-gray-800",
        "hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
        "transition-all duration-200 text-left flex items-center justify-between",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      onClick={(e) => {
        setIsOpen(!isOpen);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      <svg
        className={cn(
          "w-4 h-4 text-gray-400 transition-transform ml-1.5",
          isOpen ? "rotate-180" : ""
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    placeholder?: string;
    children?: React.ReactNode;
  }
>(({ className, children, placeholder, ...props }, ref) => {
  const { value, selectedLabel } = useContext(SelectContext);

  // If children are provided, use them (for custom content)
  if (children) {
    return (
      <span ref={ref} className={cn("text-white", className)} {...props}>
        {children}
      </span>
    );
  }

  // Show the selected label, or value, or placeholder
  const displayValue = selectedLabel || value || placeholder;
  return (
    <span
      ref={ref}
      className={cn(value ? "text-white" : "text-gray-400", className)}
      {...props}
    >
      {displayValue}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-xl max-h-60 overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string;
    children?: React.ReactNode;
  }
>(({ className, children, value, onClick, ...props }, ref) => {
  const {
    value: selectedValue,
    onValueChange,
    setIsOpen,
    setSelectedLabel,
  } = useContext(SelectContext);
  const isSelected = value === selectedValue;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "w-full px-3 py-2.5 text-sm text-left transition-all duration-200",
        isSelected
          ? "bg-violet-600 text-white"
          : "text-gray-200 hover:bg-gray-700 hover:text-white",
        className
      )}
      onClick={(e) => {
        onValueChange?.(value);
        setSelectedLabel?.(children?.toString() || value);
        setIsOpen?.(false);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
SelectItem.displayName = "SelectItem";

export { SelectTrigger, SelectValue, SelectContent, SelectItem };
