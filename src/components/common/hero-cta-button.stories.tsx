/*
 FINAL VERSION - Key Changes:
 - Removed the manual decorator workaround for NextLink.
 - The `parameters.nextjs.appDirectory` setting is now the primary method for handling Next.js routing in Storybook.
 - Corrected a minor linting issue in the MockLink component.
*/
import type { Meta, StoryObj } from '@storybook/react';
import HeroCtaButton from './hero-cta-button';

const meta: Meta<typeof HeroCtaButton> = {
  title: 'Common/HeroCtaButton',
  component: HeroCtaButton,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
    showIcon: { control: 'boolean' },
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'blue', 'green', 'red'],
    },
  },
  // This parameter tells the storybook-addon-next to handle routing
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  // The manual decorator is no longer needed with the addon configured
  decorators: [],
};

export default meta;
type Story = StoryObj<typeof HeroCtaButton>;

export const Default: Story = {
  args: {
    children: 'Get Free Consultation',
    href: '/contact',
    showIcon: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    children: 'Learn More',
    href: '/about',
    showIcon: false,
  },
};