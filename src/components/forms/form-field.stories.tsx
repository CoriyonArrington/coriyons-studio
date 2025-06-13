import type { Meta, StoryObj } from '@storybook/react';
import FormField from './form-field';
import { Input } from '@chakra-ui/react';

const meta: Meta<typeof FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    isRequired: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    id: 'email',
    children: <Input placeholder="you@example.com" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    id: 'username',
    helperText: "Your username must be unique.",
    children: <Input placeholder="e.g., jane_doe" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    id: 'password',
    error: 'Password must be at least 8 characters long.',
    children: <Input type="password" defaultValue="123" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    id: 'full-name',
    isRequired: true,
    children: <Input placeholder="Jane Doe" />,
  },
};