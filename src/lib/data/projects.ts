// src/lib/data/projects.ts
// - Ensures all functions and interfaces are defined and exported only once.
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// For project cards on listing pages
export interface HomepageProject {
  id: string;
  slug: string;
  title: string;
  description: string | null; // Short summary for cards
  featured_image_url: string | null;
  client_name: string | null;
  // Add sort_order if you plan to sort by it on listing pages
  sort_order?: number | null;
}

// Interfaces for the structured project detail content (JSONB)
export interface HeroDetail {
  Role?: string;
  Team?: string;
  Timeline?: string;
  Tools?: string[];
  Contributions?: string[];
}

export interface HeroContent {
  title?: string;
  problem?: string;
  details?: HeroDetail;
  image?: string | null;
}

export interface ActivityLink {
  label: string;
  href: string | null;
}

export interface Pullquote {
  quote: string;
  attribution?: string;
}

export interface ContentVisual {
  alt?: string;
  url?: string;
  caption?: string;
}

export interface SectionContent {
  heading: string;
  body: string;
  pullquote?: Pullquote;
  image?: string | null;
  images?: (string | null)[];
  activities?: ActivityLink[];
}

export interface NextUpProjectInfo {
  title: string;
  description: string;
  image: string | null;
  href: string | null;
}

export interface ProjectDetailContent {
  hero?: HeroContent;
  sections?: SectionContent[];
  nextUp?: {
    heading?: string;
    project?: NextUpProjectInfo;
  };
  [key: string]: any;
}

// Interface for the full project detail
export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  project_date: string | null;
  description: string | null; // Short summary from 'projects' table
  featured_image_url: string | null;
  og_image_url: string | null;
  content: ProjectDetailContent | null;
}


// Function to get featured projects for the homepage
export async function getFeaturedProjects(limit: number = 3): Promise<HomepageProject[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, title, description, featured_image_url, client_name, sort_order')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error.message);
    return [];
  }
  return data || [];
}

// Function to get all projects for the /projects listing page
export async function getAllProjects(): Promise<HomepageProject[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, title, description, featured_image_url, client_name, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all projects:', error.message);
    return [];
  }
  return data || [];
}

// Function to get a single project by its slug for the detail page
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, title, client_name, project_date, description, featured_image_url, og_image_url, content')
    .eq('slug', slug)
    .single();

  if (error) {
    // PGRST116 means "Fetched result not found" for .single()
    if (error.code === 'PGRST116') {
        console.warn(`Project with slug "${slug}" not found.`);
        return null;
    }
    console.error(`Error fetching project by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) {
    return null;
  }
  return {
    ...data,
    content: data.content as ProjectDetailContent | null,
  } as ProjectDetail;
}