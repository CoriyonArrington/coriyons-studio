// src/app/(main)/projects/page.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ProjectsView from './view';
import type { ProjectCardItem } from '@/src/lib/data/projects';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const mockProjects: ProjectCardItem[] = [
  {
    id: '1',
    slug: 'project-one',
    title: 'HealthTech Startup MVP Prototyping',
    description: 'Designed and prototyped an MVP for a health-tech startup, focusing on core user flows to validate the concept with target users and secure initial funding.',
    featured_image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=60',
    services: [
        // FIX: Removed invalid `icon` property
        {id: '1', title: 'UX Design', slug: 'ux-design'}, 
        {id: '2', title: 'Prototyping', slug: 'prototyping'}
    ]
  },
  {
    id: '2',
    slug: 'project-two',
    title: 'Mobile Wellness App UX Overhaul',
    description: 'Redesigned a wellness app to improve user engagement and satisfaction through an intuitive, personalized experience.',
    featured_image_url: 'https://images.unsplash.com/photo-1555066931-4365d1469c9b?auto=format&fit=crop&w=800&q=60',
    // FIX: Removed invalid `icon` property
    services: [{id: '3', title: 'UI/UX Redesign', slug: 'ui-ux-redesign'}]
  },
];

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
    pageData: mockPageData,
    allProjects: mockProjects,
  },
};