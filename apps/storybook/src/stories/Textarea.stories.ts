import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Textarea } from "@repo/ui/components";

const meta = {
  title: "Input/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself and your trading experience",
    rows: 4,
  },
};

export const WithValue: Story = {
  args: {
    label: "Description",
    value:
      "This is a sample textarea with some content already filled in. You can edit this text to see how the component behaves.",
    placeholder: "Enter description",
    rows: 4,
  },
};

export const Error: Story = {
  args: {
    label: "Comments",
    placeholder: "Please enter your comments",
    error: "This field is required and must be at least 10 characters long",
    rows: 3,
  },
};

export const Success: Story = {
  args: {
    label: "Feedback",
    placeholder: "Your feedback is valuable to us",
    variant: "success",
    rows: 4,
  },
};

export const Small: Story = {
  args: {
    label: "Quick Note",
    placeholder: "Brief note",
    size: "sm",
    rows: 2,
  },
};

export const Large: Story = {
  args: {
    label: "Detailed Description",
    placeholder: "Provide detailed information",
    size: "lg",
    rows: 6,
  },
};

export const Disabled: Story = {
  args: {
    label: "Read Only",
    value: "This textarea is disabled and cannot be edited.",
    disabled: true,
    rows: 3,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "Textarea without label",
    rows: 3,
  },
};

export const WithMaxLength: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself and your trading experience",
    rows: 4,
    maxLength: 200,
  },
};
