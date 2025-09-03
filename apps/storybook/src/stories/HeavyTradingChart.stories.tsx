import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeavyTradingChart } from "@repo/ui/components";

const meta = {
  title: "Heavy Components/HeavyTradingChart",
  component: HeavyTradingChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Deliberately performance-heavy trading chart with excessive DOM elements, data points, and animations for optimization learning purposes.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    width: 600,
    height: 300,
    withExcessiveElements: false,  // Safe mode default
    animationLevel: "basic",       // Safe mode default  
    renderComplexity: "simple",    // Safe mode default
  },
  argTypes: {
    width: {
      control: { type: "range", min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: "range", min: 200, max: 800, step: 50 },
    },
    withExcessiveElements: {
      control: "boolean",
      description: "Toggle excessive DOM elements for performance testing",
    },
    animationLevel: {
      control: "select",
      options: ["none", "basic", "heavy", "extreme"],
      description: "Control animation intensity for performance impact testing",
    },
    renderComplexity: {
      control: "select", 
      options: ["simple", "complex", "extreme"],
      description: "Control rendering complexity and DOM element count",
    },
  },
} satisfies Meta<typeof HeavyTradingChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Safe Mode (Recommended)",
  args: {},
};

export const ExtremePerformanceImpact: Story = {
  name: "⚠️ PERFORMANCE TEST - Use with Caution",
  args: {
    width: 800,
    height: 400,
    withExcessiveElements: true,
    animationLevel: "extreme",
    renderComplexity: "extreme",
  },
};

export const OptimizedVersion: Story = {
  args: {
    width: 600,
    height: 300,
    withExcessiveElements: false,
    animationLevel: "none",
    renderComplexity: "simple",
  },
};

export const HeavyAnimations: Story = {
  args: {
    animationLevel: "extreme",
    renderComplexity: "complex",
    withExcessiveElements: true,
  },
};

export const ComplexRendering: Story = {
  args: {
    renderComplexity: "extreme",
    animationLevel: "basic",
    withExcessiveElements: true,
  },
};

export const PerformanceComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <h3>Performance Impact Comparison</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <h4>Optimized (Low Impact)</h4>
          <HeavyTradingChart
            width={400}
            height={200}
            withExcessiveElements={false}
            animationLevel="none"
            renderComplexity="simple"
          />
        </div>
        
        <div>
          <h4>Medium Impact</h4>
          <HeavyTradingChart
            width={400}
            height={200}
            withExcessiveElements={false}
            animationLevel="basic"
            renderComplexity="complex"
          />
        </div>
        
        <div>
          <h4>Heavy Impact (Performance Bottleneck)</h4>
          <HeavyTradingChart
            width={400}
            height={200}
            withExcessiveElements={true}
            animationLevel="extreme"
            renderComplexity="extreme"
          />
        </div>
      </div>
    </div>
  ),
};