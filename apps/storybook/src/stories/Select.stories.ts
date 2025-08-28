import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select } from "@repo/ui/components";

const meta = {
  title: "Input/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onChange: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    onChange: { action: "changed" },
    onValueChange: { action: "valueChanged" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const riskToleranceOptions = [
  { value: "conservative", label: "Conservative" },
  { value: "moderate", label: "Moderate" },
  { value: "aggressive", label: "Aggressive" },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    value: "",
    onChange: fn(),
    placeholder: "Select an option",
    disabled: false,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Risk Tolerance",
    options: riskToleranceOptions,
    value: "moderate",
    onChange: fn(),
    disabled: false,
  },
};

export const WithPlaceholder: Story = {
  args: {
    options: sampleOptions,
    value: "",
    onChange: fn(),
    placeholder: "Choose your preference",
    disabled: false,
  },
};

export const Selected: Story = {
  args: {
    options: sampleOptions,
    value: "option2",
    onChange: fn(),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: "option1",
    onChange: fn(),
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    value: "",
    onChange: fn(),
    label: "Required Selection",
    error: "Please select an option",
    disabled: false,
  },
};

export const LongOptions: Story = {
  args: {
    options: [
      { value: "short", label: "Short Option" },
      { value: "medium", label: "Medium Length Option" },
      {
        value: "long",
        label: "This is a very long option that might overflow",
      },
      {
        value: "longest",
        label:
          "This is an extremely long option that definitely will test the width constraints of the select component",
      },
    ],
    value: "medium",
    onChange: fn(),
    label: "Length Test",
    disabled: false,
  },
};
