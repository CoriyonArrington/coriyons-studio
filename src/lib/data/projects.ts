// src/lib/data/projects.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ProjectContentJson {
  [key:string]: unknown;
}

export interface ProjectService {
  id: string;
  title: string;
  slug: string;
  icon: IconData | null;
}

export interface ProjectTestimonial {
  id: string;
  quote: string;
  name: string;
}

export interface ProjectCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured_image_url: string | null;
  services: ProjectService[] | null;
}

export interface ProjectDetail extends ProjectCardItem {
  content: ProjectContentJson | null;
  testimonial: ProjectTestimonial | null;
  other_images: { url: string; alt?: string }[] | null;
}

// --- Internal Types for Supabase Responses ---
type RawIcon = { name: string; icon_library: string | null; } | null;
type ServiceRow = { id: string; slug: string; title: string; icons: RawIcon };
type TestimonialRow = { id: string; quote: string; name: string; };

type RawProject = Database['public']['Tables']['projects']['Row'] & {
  project_services: { services: ServiceRow | null; }[];
  testimonials: TestimonialRow[] | null;
  other_images: { url: string; alt?: string }[] | null;
};


// --- HELPER FUNCTIONS ---
function getIconFromRaw(item: { icons: RawIcon }): IconData | null {
  return item.icons ? { name: item.icons.name, icon_library: item.icons.icon_library } : null;
}

function mapRawProjectToCard(project: RawProject): ProjectCardItem {
    const services = project.project_services
        .map((ps) => ps.services)
        .filter((s): s is ServiceRow => s !== null)
        .map((service) => ({
            id: service.id,
            title: service.title,
            slug: service.slug,
            icon: getIconFromRaw(service),
        }));

    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.description,
        featured_image_url: project.featured_image_url,
        services: services.length > 0 ? services : null,
    };
}

// --- DATA FETCHING FUNCTIONS ---
const PROJECT_CARD_SELECT_QUERY = `
    id, slug, title, description, featured_image_url,
    project_services ( services ( id, slug, title, icons ( name, icon_library )))
`;

export async function getAllProjects(): Promise<ProjectCardItem[]> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_CARD_SELECT_QUERY)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all projects:', error.message);
    return [];
  }
  return (data as unknown as RawProject[]).map(mapRawProjectToCard);
}

export async function getFeaturedProjects(limit: number = 3): Promise<ProjectCardItem[]> {
    noStore();
    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_CARD_SELECT_QUERY)
        .eq('featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured projects:', error.message);
        return [];
    }
    return (data as unknown as RawProject[]).map(mapRawProjectToCard);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  noStore();
  const supabase = createClient();

  const { data, error }: PostgrestSingleResponse<RawProject> = await supabase
    .from('projects')
    .select(`
      *,
      project_services ( services ( *, icons ( name, icon_library ) ) ),
      testimonials ( id, quote, name )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
        console.error(`Error fetching project by slug "${slug}":`, error.message);
    }
    return null;
  }
  
  const cardData = mapRawProjectToCard(data);
  const testimonial = data.testimonials?.[0] || null;

  return {
    ...cardData,
    content: data.content as ProjectContentJson | null,
    testimonial: testimonial,
    other_images: data.other_images, 
  };
}