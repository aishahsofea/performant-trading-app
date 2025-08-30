import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Button } from "@repo/ui/components";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-96",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            This is a description for the card component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-content-secondary">
            This is the main content area of the card. You can put any content here.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    className: "w-96",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Footer</CardTitle>
          <CardDescription>
            This card includes a footer with action buttons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-content-secondary">
            Main content goes here. This could be a form, text, or any other content.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </>
    ),
  },
};

export const SimpleCard: Story = {
  args: {
    className: "w-80 p-6",
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Simple Card</h3>
        <p className="text-sm text-content-tertiary">
          A basic card without using the compound components.
        </p>
      </div>
    ),
  },
};

export const ProfileCard: Story = {
  args: {
    className: "w-96",
    children: (
      <>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Complete your trading profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <p className="text-sm text-content-secondary">Intermediate (1-3 years)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Risk Tolerance</label>
              <p className="text-sm text-content-secondary">Moderate</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notifications</label>
              <p className="text-sm text-content-secondary">Enabled</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Update Profile</Button>
        </CardFooter>
      </>
    ),
  },
};

export const CompactCard: Story = {
  args: {
    className: "w-64",
    children: (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Compact</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-content-tertiary">
            A more compact version of the card component.
          </p>
        </CardContent>
      </>
    ),
  },
};