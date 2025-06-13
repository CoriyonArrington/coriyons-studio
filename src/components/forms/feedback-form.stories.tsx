/*
  This file provides a story for the FeedbackForm component.
  It showcases the complex layout with various input types for easy visual testing.
*/
import type { Meta, StoryObj } from '@storybook/react';
import FeedbackForm from './feedback-form';

const meta: Meta<typeof FeedbackForm> = {
  title: 'Forms/FeedbackForm',
  component: FeedbackForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedbackForm>;

export const Default: Story = {
  args: {},
};