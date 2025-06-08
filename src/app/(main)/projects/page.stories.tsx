/*
 FINAL VERSION - Key Changes:
 - Added the `slug` property to the mock `tags` array to match the `Tag` interface,
   resolving the TypeScript error.
*/
import type { Meta, StoryObj } from '@storybook/react';
import ProjectsView from './view';
import type { HomepageProject, Tag } from '@/src/lib/data/projects';

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
  {
    id: '3',
    slug: 'project-three',
    title: 'SaaS Platform UI Kit & Design System',
    description: 'Developed a comprehensive UI kit and design system for a B2B SaaS platform to ensure consistency and speed up development.',
    client_name: 'Innovate Solutions Ltd.',
    featured_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=60',
    tags: [{id: '4', name: 'Design System', slug: 'design-system'}]
  },
];

const mockPageData = {
  title: 'Our Work & Case Studies',
  content: { intro_text: "Browse through a selection of our recent projects and case studies that showcase our approach to creating impactful user experiences." }
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
    pageData: mockPageData as any,
    allProjects: mockProjects,
  },
};