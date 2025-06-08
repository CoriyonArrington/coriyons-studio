/*
 FINAL VERSION - Key Changes:
 - Added `import { vi } from 'vitest'` to correctly import the Vitest mock utility.
 - This resolves the "Cannot find namespace 'vi'" TypeScript error.
*/
import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './submit-button';
import { useFormStatus } from 'react-dom';
import React from 'react';
import { vi, type Mock } from 'vitest'; // Import vi and Mock

// Mock react-dom's useFormStatus
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});
const mockedUseFormStatus = useFormStatus as Mock;

const meta: Meta<typeof SubmitButton> = {
  title: 'Forms/SubmitButton',
  component: SubmitButton,
  tags: ['autodocs'],
  decorators: [(Story) => <form><Story /></form>],
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  render: (args) => {
    mockedUseFormStatus.mockReturnValue({ pending: false, data: null, method: null, action: null });
    return <SubmitButton {...args} />;
  },
  args: {
    children: 'Submit Feedback',
    pendingText: 'Submitting...',
    colorScheme: 'primary',
  },
};

export const Pending: Story = {
  render: (args) => {
    mockedUseFormStatus.mockReturnValue({ pending: true, data: null, method: null, action: null });
    return <SubmitButton {...args} />;
  },
  args: {
    children: 'Submit Feedback',
    pendingText: 'Please wait...',
    colorScheme: 'primary',
  },
};