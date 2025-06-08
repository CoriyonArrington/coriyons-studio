import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@chakra-ui/react';

const meta: Meta<typeof Input> = {
  title: 'UI/Themed Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled', 'flushed', 'unstyled'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your email...',
  },
};

export const FilledWithValue: Story = {
    args: {
      ...Default.args,
      defaultValue: 'jane.doe@example.com',
    },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
    defaultValue: 'Cannot edit this',
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    isInvalid: true,
    defaultValue: 'invalid-email',
  },
};