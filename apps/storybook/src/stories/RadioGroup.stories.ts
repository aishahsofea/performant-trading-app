import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { RadioGroup } from "@repo/ui/components";

const meta = {
  title: "Input/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "riskTolerance",
    label: "Risk Tolerance",
    defaultValue: "moderate",
    options: [
      { value: "conservative", label: "Conservative" },
      { value: "moderate", label: "Moderate" },
      { value: "aggressive", label: "Aggressive" },
    ],
    orientation: "horizontal",
  },
};

export const Vertical: Story = {
  args: {
    name: "preferences",
    label: "Preferences",
    defaultValue: "option2",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    orientation: "vertical",
  },
};

export const WithDisabledOption: Story = {
  args: {
    name: "features",
    label: "Available Features",
    defaultValue: "basic",
    options: [
      { value: "basic", label: "Basic" },
      { value: "premium", label: "Premium", disabled: true },
      { value: "enterprise", label: "Enterprise" },
    ],
    orientation: "horizontal",
  },
};

export const Error: Story = {
  args: {
    name: "selection",
    label: "Make a Selection",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
    error: "Please select an option",
    orientation: "horizontal",
  },
};

export const WithoutLabel: Story = {
  args: {
    name: "unlabeled",
    defaultValue: "choice1",
    options: [
      { value: "choice1", label: "Choice 1" },
      { value: "choice2", label: "Choice 2" },
    ],
    orientation: "horizontal",
  },
};
