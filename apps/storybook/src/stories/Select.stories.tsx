import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components";

const meta = {
  title: "Input/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    onValueChange: { action: "valueChanged" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: "Risk Tolerance",
    value: "moderate",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select your risk tolerance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="conservative">Conservative</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="aggressive">Aggressive</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: "",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Choose your preference" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const Selected: Story = {
  args: {
    value: "option2",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    label: "Required Selection",
    error: "Please select an option",
    value: "",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Please select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const LongOptions: Story = {
  args: {
    label: "Length Test",
    value: "medium",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select option length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Short Option</SelectItem>
          <SelectItem value="medium">Medium Length Option</SelectItem>
          <SelectItem value="long">This is a very long option that might overflow</SelectItem>
          <SelectItem value="longest">
            This is an extremely long option that definitely will test the width constraints of the select component
          </SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const CompoundExample: Story = {
  args: {
    label: "Trading Experience Level",
    value: "intermediate",
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Select experience level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner (Less than 1 year)</SelectItem>
          <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
          <SelectItem value="experienced">Experienced (3+ years)</SelectItem>
          <SelectItem value="professional">Professional Trader</SelectItem>
        </SelectContent>
      </>
    ),
  },
};