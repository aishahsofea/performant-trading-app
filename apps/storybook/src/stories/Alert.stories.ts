import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@repo/ui/components";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    children: "Profile updated successfully!",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Failed to update profile. Please try again.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Please verify your email address to continue.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Your changes have been saved as draft.",
  },
};

export const LongMessage: Story = {
  args: {
    variant: "error",
    children: "This is a longer error message that demonstrates how the alert component handles multiple lines of text and maintains proper spacing and readability.",
  },
};

export const CustomClassName: Story = {
  args: {
    variant: "success",
    children: "Custom styled alert with additional margin",
    className: "mt-4 mb-4",
  },
};