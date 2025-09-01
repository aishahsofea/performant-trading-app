import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, buttonVariantsConfig } from "@repo/ui/components";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
    disabled: false,
    size: "default",
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: Object.keys(buttonVariantsConfig.variant),
    },
    size: {
      control: "select",
      options: Object.keys(buttonVariantsConfig.size),
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "profit",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const Profit: Story = {
  args: {
    variant: "profit",
    children: "Profit",
  },
};

export const Loss: Story = {
  args: {
    variant: "loss",
    children: "Loss",
  },
};

export const Light: Story = {
  args: {
    children: "Light",
  },
  parameters: {
    themes: {
      themeOverride: "light",
    },
  },
};
