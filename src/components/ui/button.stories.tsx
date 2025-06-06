import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Button from './button';

// 📘 Storybook metadata for the Button component
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'destructive'],
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
    colorScheme: 'primary',
    variant: 'solid',
    isDisabled: true,
  },
};

// ⏳ Loading spinner state
export const Loading: Story = {
  args: {
    children: 'Loading...',
    colorScheme: 'primary',
    variant: 'solid',
    isLoading: true,
  },
};

// 🧪 Custom variant for theme showcase
export const ThemedOutline: Story = {
  args: {
    children: 'Outline CTA',
    colorScheme: 'primary',
    variant: 'themedOutline',
    size: 'md',
  },
};
