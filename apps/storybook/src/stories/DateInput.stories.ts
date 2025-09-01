import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateInput } from "@repo/ui/components";

const meta = {
  title: "Input/DateInput",
  component: DateInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Date Input",
    id: crypto.randomUUID(),
  },
};
