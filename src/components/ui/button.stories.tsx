import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
// 👇 Change this import
import { Button } from '@chakra-ui/react';

// 📘 Storybook metadata for the Button component
const meta: Meta<typeof Button> = {
  title: 'UI/Themed Button', // Renamed for clarity
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      // These should match your theme's color schemes
      options: ['primary', 'secondary', 'accent', 'destructive', 'blue', 'green', 'red', 'purple'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'themedOutline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ✅ Default interactive button with hover + click simulation
export const Default: Story = {
  args: {
    children: 'Click me',
    colorScheme: 'primary',
    variant: 'solid',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.getByRole('button', { name: /click me/i });

    await userEvent.hover(button);
    await userEvent.click(button);
  },
};

// 🚫 Disabled state (no interaction)
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    isDisabled: true,
  },
};

// ⏳ Loading spinner state
export const Loading: Story = {
  args: {
    children: 'Submitting', // Children are often ignored when loading
    loadingText: 'Loading...', // This text is shown with the spinner
    isLoading: true,
  },
};

// 🧪 Custom variant for theme showcase
export const ThemedOutline: Story = {
  args: {
    children: 'Outline CTA',
    colorScheme: 'primary',
    variant: 'themedOutline',
  },
};