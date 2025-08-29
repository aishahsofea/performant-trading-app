import type { Meta, StoryObj } from "@storybook/react-vite";
import { SummaryStats } from "@repo/ui/components";

const meta = {
  title: "Display/SummaryStats",
  component: SummaryStats,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SummaryStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "💰",
    title: "Total Revenue",
    value: "$125,430.50",
  },
};

export const Success: Story = {
  args: {
    icon: "📈",
    title: "Active Trades",
    value: "24",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    icon: "⚠️",
    title: "Pending Orders",
    value: "8",
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    icon: "📉",
    title: "Failed Trades",
    value: "3",
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    icon: "⚡",
    title: "Performance",
    value: "98.2%",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    icon: "🎯",
    title: "Success Rate",
    value: "87.5%",
    size: "lg",
    variant: "success",
  },
};
