import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TimeInput } from "@repo/ui/components";

const meta = {
  title: "Input/TimeInput",
  component: TimeInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Time Input",
    defaultValue: "09:30",
    disabled: false,
  },
};

export const WithMinMax: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Trading Hours",
    defaultValue: "09:30",
    min: "09:00",
    max: "16:00",
    disabled: false,
  },
};

export const Error: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Time Input",
    defaultValue: "09:30",
    disabled: false,
    error: "Invalid time",
  },
};

export const Disabled: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Time Input",
    defaultValue: "09:30",
    disabled: true,
  },
};
