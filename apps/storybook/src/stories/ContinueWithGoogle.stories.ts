import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ContinueWithGoogle } from "@repo/ui/components";

const meta = {
  title: "Button/ContinueWithGoogle",
  component: ContinueWithGoogle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof ContinueWithGoogle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
