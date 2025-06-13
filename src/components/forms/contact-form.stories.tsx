/*
  This file provides a story for the ContactForm component.
  It allows for isolated visual testing of the form's layout and styles.
*/
import type { Meta, StoryObj } from '@storybook/react';
import ContactForm from './contact-form';

const meta: Meta<typeof ContactForm> = {
  title: 'Forms/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  args: {},
};