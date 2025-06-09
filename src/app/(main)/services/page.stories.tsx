// ATTEMPT 1: Creating a strongly-typed mock for `pageData` to remove 'as any'.
// - Imported the 'PageRow' type to build a complete mock object.
// - Removed the unsafe 'as any' cast from the story's args.

import type { Meta, StoryObj } from '@storybook/react';
import ServicesView from './view';
import type { ServiceData } from '@/src/lib/data/services';
// FIX: Imported the PageRow type to create a valid mock object.
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const mockServices: ServiceData[] = [
  {
    id: '1',
    slug: 'kickstart-bundle',
    title: 'Kickstart Bundle',
    description: 'Perfect for: Solo practitioners or small clinics needing a rapid test of their most critical flow. Includes: User Research + Clickable Prototype.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1581092921440-b521e90b6392?auto=format&fit=crop&w=800&q=60',
    content: null,
    featured: true,
    sort_order: 1,
  },
  {
    id: '2',
    slug: 'momentum-bundle',
    title: 'Momentum Bundle',
    description: 'Perfect for: Medium-sized practices or teams revamping multiple user journeys. Includes: Usability Testing + UX Audit + Clickable Prototype.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60',
    content: null,
    featured: true,
    sort_order: 2,
  },
  {
    id: '3',
    slug: 'elevate-bundle',
    title: 'Elevate Bundle',
    description: 'Perfect for: Digital health startups or clinics launching a full MVP with strategic support. Includes: AI Rapid Prototype + Strategy Sprint.',
    offering_type: 'BUNDLE',
    featured_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60',
    content: null,
    featured: true,
    sort_order: 3,
  },
];

// FIX: Created a complete mock that satisfies the expected PageRow type.
const mockPageData: PageRow = {
  id: 'page_services_mock',
  slug: 'services',
  title: 'Our Services',
  page_type: 'STANDARD',
  nav_title: 'Services',
  content: { 
    intro_text: "Discover how our specialized UX and design services can help your business succeed by solving real user problems and achieving tangible results." 
  },
  meta_description: "Explore the specialized UX and design services offered by Coriyon's Studio.",
  og_image_url: null,
  status: 'PUBLISHED',
  sort_order: 2,
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
    // FIX: Removed the 'as any' cast, now using the strongly-typed mock.
    pageData: mockPageData,
    allServices: mockServices,
  },
};