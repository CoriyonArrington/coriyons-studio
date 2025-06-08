// src/app/(main)/services/page.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ServicesView from './view';
import type { ServiceData } from '@/src/lib/data/services';

const mockServices: ServiceData[] = [
  {
    id: '1',
    slug: 'kickstart-bundle',
    title: 'Kickstart Bundle',
    description: 'Perfect for: Solo practitioners or small clinics needing a rapid test of their most critical flow. Includes: User Research + Clickable Prototype.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1581092921440-b521e90b6392?auto=format&fit=crop&w=800&q=60',
    content: null,
  },
  {
    id: '2',
    slug: 'momentum-bundle',
    title: 'Momentum Bundle',
    description: 'Perfect for: Medium-sized practices or teams revamping multiple user journeys. Includes: Usability Testing + UX Audit + Clickable Prototype.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60',
    content: null,
  },
  {
    id: '3',
    slug: 'elevate-bundle',
    title: 'Elevate Bundle',
    description: 'Perfect for: Digital health startups or clinics launching a full MVP with strategic support. Includes: AI Rapid Prototype + Strategy Sprint.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60',
    content: null,
  },
];

const mockPageData = {
  title: 'Our Services',
  content: { intro_text: "Discover how our specialized UX and design services can help your business succeed by solving real user problems and achieving tangible results." }
};

const meta: Meta<typeof ServicesView> = {
  title: 'Pages/Services',
  component: ServicesView,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServicesView>;

export const Default: Story = {
  args: {
    pageData: mockPageData as any,
    allServices: mockServices,
  },
};