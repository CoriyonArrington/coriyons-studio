// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Button } from '@chakra-ui/react';

const meta: Meta<typeof Button> = {
  title: 'UI/Themed Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
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

export const Default: Story = {
  args: {
    children: 'Click me',
    colorScheme: 'primary',
    variant: 'solid',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // FIX: Removed unnecessary `await` from synchronous `getByRole`.
    const button = canvas.getByRole('button', { name: /click me/i });

    await userEvent.hover(button);
    await userEvent.click(button);
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Submitting',
    loadingText: 'Loading...',
    isLoading: true,
  },
};

export const ThemedOutline: Story = {
  args: {
    children: 'Outline CTA',
    colorScheme: 'primary',
    variant: 'themedOutline',
  },
};