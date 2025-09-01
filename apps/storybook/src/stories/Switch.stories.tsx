import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Switch } from "@repo/ui/components";

const meta = {
  title: "Input/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "switch-default",
  },
};

export const Checked: Story = {
  args: {
    id: "switch-checked",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: "switch-disabled",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: "switch-disabled-checked",
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  args: {
    id: "switch-with-label",
    label: "Enable notifications",
  },
};