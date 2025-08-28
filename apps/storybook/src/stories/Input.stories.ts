import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@repo/ui/components";

const meta = {
  title: "Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: crypto.randomUUID(),
  },
};

export const WithLabel: Story = {
  args: {
    id: crypto.randomUUID(),
    label: "Input Label",
  },
};

export const WithError: Story = {
  args: {
    id: crypto.randomUUID(),
    error: "Error message",
  },
};
