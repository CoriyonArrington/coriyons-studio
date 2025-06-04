// src/lib/data/projects.ts
// - Added RelatedServiceInfo interface.
// - Updated ProjectDetail interface to include relatedServices.
// - Modified getProjectBySlug to fetch associated services via project_services table.

import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// Basic Tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// Interface for basic service info to be displayed on project page
export interface RelatedServiceInfo {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  offering_type: 'INDIVIDUAL' | 'BUNDLE' | null; // From services.ts
}

// For project cards on listing pages
export interface HomepageProject {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured_image_url: string | null;
  client_name: string | null;
  sort_order?: number | null;
  tags?: Tag[];
}

// ... (HeroDetail, HeroContent, ActivityLink, Pullquote, ContentVisual, SectionContent, NextUpProjectInfo, ProjectDetailContent interfaces remain the same)
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
  tags?: Tag[];
  relatedServices?: RelatedServiceInfo[]; // Added field for related services
}


// Function to get featured projects for the homepage
export async function getFeaturedProjects(limit: number = 3): Promise<HomepageProject[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      slug,
      title,
      description,
      featured_image_url,
      client_name,
      sort_order,
      project_tags (
        tags (id, name, slug)
      )
    `)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error.message);
    return [];
  }
  return data?.map(project => ({
    ...project,
    tags: project.project_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
  })) || [];
}

// Function to get all projects for the /projects listing page
export async function getAllProjects(): Promise<HomepageProject[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      slug,
      title,
      description,
      featured_image_url,
      client_name,
      sort_order,
      project_tags (
        tags (id, name, slug)
      )
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all projects:', error.message);
    return [];
  }
  return data?.map(project => ({
    ...project,
    tags: project.project_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
  })) || [];
}

// Function to get a single project by its slug for the detail page
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      slug,
      title,
      client_name,
      project_date,
      description,
      featured_image_url,
      og_image_url,
      content,
      project_tags (
        tags (id, name, slug)
      ),
      project_services (
        services (
          id,
          slug,
          title,
          description,
          offering_type 
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
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

  const relatedServices = data.project_services?.map((ps: any) => {
    if (!ps.services) return null;
    return {
      id: ps.services.id,
      slug: ps.services.slug,
      title: ps.services.title,
      description: ps.services.description,
      offering_type: ps.services.offering_type,
    };
  }).filter(Boolean) as RelatedServiceInfo[] || undefined; // Use undefined if empty for optional field

  return {
    ...data,
    content: data.content as ProjectDetailContent | null,
    tags: data.project_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
    relatedServices: relatedServices && relatedServices.length > 0 ? relatedServices : undefined,
  } as ProjectDetail;
}