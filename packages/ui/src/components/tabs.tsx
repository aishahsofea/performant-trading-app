import * as React from "react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const tabsVariants = cva("w-full");

const tabsListVariants = cva("border-b", {
  variants: {
    variant: {
      default: "border-border-primary",
      light: "border-border-secondary",
      dark: "border-border-tertiary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tabsNavVariants = cva("flex");

const tabsListUlVariants = cva("flex flex-row", {
  variants: {
    spacing: {
      default: "gap-x-8",
      sm: "gap-x-4",
      lg: "gap-x-12",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

const tabsTriggerVariants = cva(
  "py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer no-underline inline-block",
  {
    variants: {
      variant: {
        default: "",
        light: "",
        dark: "",
      },
      state: {
        active: "",
        inactive: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        state: "active",
        className: "border-primary text-primary-400",
      },
      {
        variant: "default",
        state: "inactive",
        className:
          "border-transparent text-content-tertiary hover:text-content-primary hover:border-border-secondary",
      },
      {
        variant: "light",
        state: "active",
        className: "border-primary text-primary-400",
      },
      {
        variant: "light",
        state: "inactive",
        className:
          "border-transparent text-secondary-600 hover:text-secondary-900 hover:border-border-secondary",
      },
      {
        variant: "dark",
        state: "active",
        className: "border-primary-400 text-primary-300",
      },
      {
        variant: "dark",
        state: "inactive",
        className:
          "border-transparent text-content-tertiary hover:text-content-secondary hover:border-border-primary",
      },
    ],
    defaultVariants: {
      variant: "default",
      state: "inactive",
    },
  }
);

const tabsContentVariants = cva("mt-6");

export type TabItem = {
  id: string;
  label: string;
  icon?: string;
};

export type TabsProps = {
  tabs: TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode | ((activeTab: string) => React.ReactNode);
  variant?: "default" | "light" | "dark";
  spacing?: "default" | "sm" | "lg";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  // Add other HTMLDivElement props as needed
} & VariantProps<typeof tabsVariants>;

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs,
      activeTab: controlledActiveTab,
      defaultActiveTab,
      onTabChange,
      children,
      variant = "default",
      spacing = "default",
      ...props
    },
    ref
  ) => {
    const [internalActiveTab, setInternalActiveTab] = useState(
      defaultActiveTab || tabs[0]?.id || ""
    );

    const activeTab = controlledActiveTab ?? internalActiveTab;
    const isControlled = controlledActiveTab !== undefined;

    const handleTabChange = (tabId: string) => {
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    };

    const renderChildren = () => {
      if (typeof children === "function") {
        return children(activeTab);
      }
      return children;
    };

    return (
      <div ref={ref} className={cn(tabsVariants(), className)} {...props}>
        {/* Tab Navigation */}
        <div className={cn(tabsListVariants({ variant }))}>
          <nav className={cn(tabsNavVariants())}>
            <ul className={cn(tabsListUlVariants({ spacing }))}>
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabChange(tab.id);
                    }}
                    className={cn(
                      tabsTriggerVariants({
                        variant,
                        state: activeTab === tab.id ? "active" : "inactive",
                      })
                    )}
                  >
                    <span className="flex items-center space-x-2">
                      {tab.icon && <span>{tab.icon}</span>}
                      <span>{tab.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Tab Content */}
        <div className={cn(tabsContentVariants())}>{renderChildren()}</div>
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

export { Tabs };
