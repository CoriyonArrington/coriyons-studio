import type { Meta, StoryObj } from '@storybook/react';
import { FormMessage } from './form-message';

const meta: Meta<typeof FormMessage> = {
  title: 'Forms/FormMessage',
  component: FormMessage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormMessage>;

export const Success: Story = {
  args: {
    message: {
      success: 'Your profile was updated successfully!',
      title: 'Success',
    },
  },
};

export const Error: Story = {
  args: {
    message: {
      error: 'The email address is already in use. Please try another.',
      title: 'Submission Error',
    },
  },
};

export const Info: Story = {
  args: {
    message: {
      message: 'Your password must be at least 8 characters long.',
      title: 'Info',
    },
  },
};