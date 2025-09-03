import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeavyDataTable } from "@repo/ui/components";

const meta = {
  title: "Heavy Components/HeavyDataTable",
  component: HeavyDataTable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Deliberately performance-heavy data table with thousands of rows, no virtualization, and excessive DOM elements for optimization learning purposes.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    withExcessiveElements: false,  // Safe mode default
    renderComplexity: "simple",   // Safe mode default
    animationLevel: "none",       // Safe mode default
    virtualized: true,            // Safe mode default
  },
  argTypes: {
    withExcessiveElements: {
      control: "boolean",
      description: "Toggle excessive DOM elements for performance testing",
    },
    renderComplexity: {
      control: "select", 
      options: ["simple", "complex", "extreme"],
      description: "Control rendering complexity and DOM element count",
    },
    animationLevel: {
      control: "select",
      options: ["none", "basic", "heavy", "extreme"],
      description: "Control animation intensity for performance impact testing",
    },
    virtualized: {
      control: "boolean",
      description: "Enable virtualization (limits to 100 rows) vs showing all data",
    },
  },
} satisfies Meta<typeof HeavyDataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Safe Mode (Virtualized)",
  args: {},
};

export const ExtremePerformanceImpact: Story = {
  name: "⚠️ PERFORMANCE TEST - 3000 Rows (DANGER)",
  args: {
    withExcessiveElements: true,
    renderComplexity: "extreme",
    animationLevel: "extreme",
    virtualized: false,
  },
};

export const OptimizedVersion: Story = {
  args: {
    withExcessiveElements: false,
    renderComplexity: "simple",
    animationLevel: "none",
    virtualized: true,
  },
};

export const VirtualizedComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", padding: "20px" }}>
      <div>
        <h3>Performance Impact: Virtualized vs Non-Virtualized</h3>
      </div>
      
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Virtualized (100 rows) - Optimized</h4>
          <HeavyDataTable
            withExcessiveElements={false}
            renderComplexity="simple"
            animationLevel="none"
            virtualized={true}
          />
        </div>
        
        <div>
          <h4>Non-Virtualized (3000 rows) - Heavy</h4>
          <HeavyDataTable
            withExcessiveElements={true}
            renderComplexity="extreme"
            animationLevel="heavy"
            virtualized={false}
          />
        </div>
      </div>
    </div>
  ),
};