import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "@repo/ui/components";

const meta = {
  title: "Input/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Checkbox Option",
    defaultChecked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Checked Option",
    defaultChecked: true,
    disabled: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    id: crypto.randomUUID(),
    defaultChecked: false,
    disabled: false,
  },
};

export const Error: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Checkbox Option",
    defaultChecked: false,
    disabled: false,
    error: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Disabled Option",
    defaultChecked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Disabled Checked Option",
    defaultChecked: true,
    disabled: true,
  },
};