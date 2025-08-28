import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PasswordInput } from "@repo/ui/components";

const meta = {
  title: "Input/PasswordInput",
  component: PasswordInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Password Input",
    defaultValue: "password",
    disabled: false,
  },
};

export const Error: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Password Input",
    defaultValue: "password",
    disabled: false,
    error: "Invalid password",
  },
};

export const Disabled: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Password Input",
    defaultValue: "password",
    disabled: true,
  },
};
