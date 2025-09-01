import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Tabs } from "@repo/ui/components";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onTabChange: fn(),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "preferences", label: "Trading Preferences", icon: "⚙️" },
  { id: "portfolio", label: "Portfolio Settings", icon: "📊" },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "profile",
    children: (activeTab: string) => `Content for ${activeTab} tab`,
  },
};

export const Light: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "preferences",
    variant: "light",
    children: (activeTab: string) => `Light variant - ${activeTab} content`,
  },
};

export const Dark: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "portfolio",
    variant: "dark",
    children: (activeTab: string) => `Dark variant - ${activeTab} content`,
  },
};

export const SmallSpacing: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "profile",
    spacing: "sm",
    children: (activeTab: string) => `Small spacing - ${activeTab} content`,
  },
};

export const LargeSpacing: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "preferences",
    spacing: "lg",
    children: (activeTab: string) => `Large spacing - ${activeTab} content`,
  },
};

export const WithoutIcons: Story = {
  args: {
    tabs: [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
    defaultActiveTab: "about",
    children: (activeTab: string) => `${activeTab} content (no icons)`,
  },
};
