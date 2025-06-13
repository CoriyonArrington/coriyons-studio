/*
  This file provides stories for the unified PostCard component.
  It showcases the card with various props to demonstrate its flexibility
  for displaying services, projects, and blog posts.
*/
import type { Meta, StoryObj } from '@storybook/react';
import PostCard from './post-card';

const meta: Meta<typeof PostCard> = {
  title: 'Common/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    imageUrl: { control: 'text' },
    href: { control: 'text' },
    ctaText: { control: 'text' },
    tagColorScheme: {
      control: 'select',
      options: ['purple', 'teal', 'blue', 'green', 'red'],
    },
  },
  parameters: {
    // This helps Storybook's Next.js addon handle the <NextLink> component
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const ProjectExample: Story = {
  args: {
    href: '#',
    title: 'SaaS Platform UI Kit & Design System',
    description: 'Developed a comprehensive UI kit and design system for a B2B SaaS platform to ensure consistency and speed up development.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d1469c9b?auto=format&fit=crop&w=800&q=60',
    tags: [{ id: '1', name: 'UX Design' }, { id: '2', name: 'Design System' }],
    tagColorScheme: 'blue',
    ctaText: 'View Project',
  },
};

export const ServiceExample: Story = {
  args: {
    href: '#',
    title: 'Kickstart Bundle',
    description: 'Perfect for: Solo practitioners or small clinics needing a rapid test of their most critical flow. Includes: User Research + Clickable Prototype.',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=60',
    tags: [{ id: '1', name: 'BUNDLE' }],
    tagColorScheme: 'purple',
    ctaText: 'Book Bundle Now',
  },
};

export const WithoutImage: Story = {
  args: {
    href: '#',
    title: 'Blog Post Without an Image',
    description: 'This example shows how the card adapts when no imageUrl is provided, maintaining a clean and balanced layout.',
    tags: [{ id: '1', name: 'Accessibility' }],
    tagColorScheme: 'green',
    ctaText: 'Read More',
  },
};