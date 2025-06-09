// ATTEMPT 1: Creating a strongly-typed mock for `pageData` to remove 'as any'.
// - Imported the 'PageRow' type to build a complete mock object.
// - Removed the unused 'Tag' import.

import type { Meta, StoryObj } from '@storybook/react';
import ProjectsView from './view';
// FIX: Removed unused 'Tag' import. 'HomepageProject' already includes it.
import type { HomepageProject } from '@/src/lib/data/projects';
// FIX: Imported the PageRow type to create a valid mock object.
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const mockProjects: HomepageProject[] = [
  {
    id: '1',
    slug: 'project-one',
    title: 'HealthTech Startup MVP Prototyping',
    description: 'Designed and prototyped an MVP for a health-tech startup, focusing on core user flows to validate the concept with target users and secure initial funding.',
    client_name: 'CareConnect Startups',
    featured_image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=60',
    tags: [{id: '1', name: 'UX Design', slug: 'ux-design'}, {id: '2', name: 'Prototyping', slug: 'prototyping'}]
  },
  {
    id: '2',
    slug: 'project-two',
    title: 'Mobile Wellness App UX Overhaul',
    description: 'Redesigned a wellness app to improve user engagement and satisfaction through an intuitive, personalized experience.',
    client_name: 'HealthyLife Inc.',
    featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d1469c9b?auto=format&fit=crop&w=800&q=60',
    tags: [{id: '3', name: 'UI/UX Redesign', slug: 'ui-ux-redesign'}]
  },
];

// FIX: Created a complete mock that satisfies the expected PageRow type.
const mockPageData: PageRow = {
  id: 'page_projects_mock',
  slug: 'projects',
  title: 'Our Work & Case Studies',
  page_type: 'STANDARD',
  nav_title: 'Projects',
  content: { 
    intro_text: "Browse through a selection of our recent projects and case studies that showcase our approach to creating impactful user experiences." 
  },
  meta_description: "Explore the portfolio of UX design projects and case studies by Coriyon's Studio.",
  og_image_url: null,
  status: 'PUBLISHED',
  sort_order: 3,
};


const meta: Meta<typeof ProjectsView> = {
  title: 'Pages/Projects',
  component: ProjectsView,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectsView>;

export const Default: Story = {
  args: {
    // FIX: Removed the 'as any' cast, now using the strongly-typed mock.
    pageData: mockPageData,
    allProjects: mockProjects,
  },
};