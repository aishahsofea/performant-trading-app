import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NumberInput } from "@repo/ui/components";

const meta = {
  title: "Input/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Number Input",
    defaultValue: 42,
    disabled: false,
  },
};

export const WithMinMax: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Percentage",
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
};

export const WithDecimal: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Price",
    defaultValue: 123.45,
    min: 0,
    step: 0.01,
    disabled: false,
    placeholder: "Enter price",
  },
};

export const Error: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Number Input",
    defaultValue: 42,
    disabled: false,
    error: "Invalid number",
  },
};

export const Disabled: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Number Input",
    defaultValue: 42,
    disabled: true,
  },
};