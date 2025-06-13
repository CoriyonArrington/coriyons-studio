// ATTEMPT 1: Creating a strongly-typed mock for `pageData` to remove 'as any'.
// - Imported the 'PageRow' type to build a complete mock object.
// - Removed the unsafe 'as any' cast from the story's args.

import type { Meta, StoryObj } from '@storybook/react';
import BlogView from './view';
import type { PostCardItem } from '@/src/lib/data/posts';
// FIX: Imported the PageRow type to create a valid mock object.
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const mockPosts: PostCardItem[] = [
    { id: '1', slug: 'ux-trends-2025', title: 'Top 5 UX Design Trends to Watch in 2025', excerpt: 'Explore the cutting-edge user experience design trends that are set to define digital product interactions in the coming year, from AI to ethic...', published_at: '2025-05-29', featured_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=60', tags: [{id: '1', name: 'UX Design', slug: 'ux-design'}] },
    { id: '2', slug: 'accessible-design', title: 'Why Accessible Design is Non-Negotiable in Modern Tech', excerpt: 'Discover the critical importance of creating accessible digital products for all users and how it benefits businesses and society.', published_at: '2025-05-22', featured_image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=60', tags: [{id: '2', name: 'Accessibility', slug: 'accessibility'}] },
    { id: '3', slug: 'lean-ux-startup', title: 'Lean UX Principles for Agile Startup Product Development', excerpt: 'How startups can leverage Lean UX methodologies to build user-centered products faster, iterate efficiently, and achieve product-...', published_at: '2025-05-17', featured_image_url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=60', tags: [{id: '3', name: 'Lean UX', slug: 'lean-ux'}] },
];

// FIX: Created a complete mock that satisfies the expected PageRow type.
const mockPageData: PageRow = {
  id: 'page_blog_mock',
  slug: 'blog',
  title: 'Our Blog',
  page_type: 'RESOURCES',
  nav_title: 'Blog',
  content: { 
    intro_text: "Explore articles, insights, and updates on UX design, digital health innovation, and industry best practices from Coriyon’s Studio." 
  },
  meta_description: "The official blog of Coriyon's Studio, featuring articles on UX design and digital health.",
  og_image_url: null,
  status: 'PUBLISHED',
  sort_order: 4,
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
    // FIX: Removed the 'as any' cast, now using the strongly-typed mock.
    pageData: mockPageData,
    posts: mockPosts,
  },
};