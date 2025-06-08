// src/app/(resources)/blog/page.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import BlogView from './view';
import type { PostCardItem } from '@/src/lib/data/posts';

const mockPosts: PostCardItem[] = [
    { id: '1', slug: 'ux-trends-2025', title: 'Top 5 UX Design Trends to Watch in 2025', excerpt: 'Explore the cutting-edge user experience design trends that are set to define digital product interactions in the coming year, from AI to ethic...', published_at: '2025-05-29', featured_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=60', tags: [{id: '1', name: 'UX Design', slug: 'ux-design'}] },
    { id: '2', slug: 'accessible-design', title: 'Why Accessible Design is Non-Negotiable in Modern Tech', excerpt: 'Discover the critical importance of creating accessible digital products for all users and how it benefits businesses and society.', published_at: '2025-05-22', featured_image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=60', tags: [{id: '2', name: 'Accessibility', slug: 'accessibility'}] },
    { id: '3', slug: 'lean-ux-startup', title: 'Lean UX Principles for Agile Startup Product Development', excerpt: 'How startups can leverage Lean UX methodologies to build user-centered products faster, iterate efficiently, and achieve product-...', published_at: '2025-05-17', featured_image_url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=60', tags: [{id: '3', name: 'Lean UX', slug: 'lean-ux'}] },
];

const mockPageData = {
  title: 'Our Blog',
  content: { intro_text: "Explore articles, insights, and updates on UX design, digital health innovation, and industry best practices from Coriyon’s Studio." }
};

const meta: Meta<typeof BlogView> = {
  title: 'Pages/Blog',
  component: BlogView,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BlogView>;

export const Default: Story = {
  args: {
    pageData: mockPageData as any,
    posts: mockPosts,
  },
};