import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { HeavyButton, heavyButtonVariantsConfig } from "@repo/ui/components";

const meta = {
  title: "Heavy Components/HeavyButton",
  component: HeavyButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Deliberately performance-heavy button with excessive DOM elements, animations, and styling for optimization learning purposes.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
    disabled: false,
    size: "default",
    withExcessiveElements: false, // Safe mode default
    animationIntensity: "low",    // Safe mode default
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: Object.keys(heavyButtonVariantsConfig.variant),
    },
    size: {
      control: "select",
      options: Object.keys(heavyButtonVariantsConfig.size),
    },
    withExcessiveElements: {
      control: "boolean",
      description: "Toggle excessive DOM elements for performance testing",
    },
    animationIntensity: {
      control: "select",
      options: ["low", "medium", "high", "extreme"],
      description: "Control animation intensity for performance impact testing",
    },
  },
} satisfies Meta<typeof HeavyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Safe Mode Button",
    withExcessiveElements: false,
    animationIntensity: "low",
  },
};

export const SafePreview: Story = {
  args: {
    variant: "default",
    children: "Preview Mode (Low Impact)",
    withExcessiveElements: false,
    animationIntensity: "medium",
  },
};

export const HeavyVariant: Story = {
  args: {
    variant: "heavy",
    children: "⚠️ PERFORMANCE TEST - Heavy Button",
    animationIntensity: "extreme",
    withExcessiveElements: true,
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Heavy Destructive",
    animationIntensity: "high",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Heavy Outline",
    withExcessiveElements: true,
  },
};

export const ExtraLarge: Story = {
  args: {
    variant: "heavy",
    size: "xl",
    children: "XL Heavy Button",
    animationIntensity: "extreme",
    withExcessiveElements: true,
  },
};

export const PerformanceComparison: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div>
        <h3>Performance Impact Levels</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <HeavyButton
            variant="default"
            animationIntensity="low"
            withExcessiveElements={false}
          >
            Low Impact
          </HeavyButton>
          <HeavyButton
            variant="default"
            animationIntensity="medium"
            withExcessiveElements={false}
          >
            Medium Impact
          </HeavyButton>
          <HeavyButton
            variant="heavy"
            animationIntensity="high"
            withExcessiveElements={true}
          >
            High Impact
          </HeavyButton>
          <HeavyButton
            variant="heavy"
            animationIntensity="extreme"
            withExcessiveElements={true}
            size="xl"
          >
            Extreme Impact
          </HeavyButton>
        </div>
      </div>
    </div>
  ),
};

export const LowPerformance: Story = {
  args: {
    variant: "default",
    children: "Optimized Version",
    withExcessiveElements: false,
    animationIntensity: "low",
  },
};

export const HighPerformance: Story = {
  args: {
    variant: "heavy",
    children: "Heavy Version",
    withExcessiveElements: true,
    animationIntensity: "extreme",
    size: "xl",
  },
};
