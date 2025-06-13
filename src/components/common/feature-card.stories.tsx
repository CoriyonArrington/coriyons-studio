/*
  This file provides stories for the simpler FeatureCard component.
  It showcases the card used for highlighting key concepts like UX problems or solutions.
*/
import type { Meta, StoryObj } from '@storybook/react';
import FeatureCard from './featured-card';

const meta: Meta<typeof FeatureCard> = {
  title: 'Common/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    href: { control: 'text' },
    iconName: { control: 'text' },
    iconColor: { control: 'text' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const UXProblem: Story = {
  args: {
    href: '#',
    title: 'Low Conversion Rates',
    description: 'Users are visiting key pages but failing to complete desired actions like sign-ups, purchases, or form submissions.',
    iconName: 'TrendingDown',
    iconColor: 'orange.500',
  },
};

export const UXSolution: Story = {
  args: {
    href: '#',
    title: 'UX Audit & Optimization',
    description: 'A thorough expert review of your product to identify usability flaws and provide actionable recommendations for improvement.',
    iconName: 'CheckSquare',
    iconColor: 'green.500',
  },
};