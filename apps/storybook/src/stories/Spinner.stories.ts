import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@repo/ui/components";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
  },
};

export const WithCustomText: Story = {
  args: {
    size: "lg",
    text: "Loading performance metrics...",
  },
};
