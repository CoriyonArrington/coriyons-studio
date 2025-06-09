import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core & Related Type Definitions ---

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ProjectContentJson {
  [key:string]: unknown;
}

export interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string | null;
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

// --- Internal Types ---
type ProjectWithServices = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured_image_url: string | null;
  project_services: {
    services: {
      id: string;
      slug: string;
      title: string;
    } | null;
  }[];
};

// --- Helper Functions ---
function mapRawProjects(rawProjects: ProjectWithServices[]): ProjectCardItem[] {
    return rawProjects.map((project) => {
        const services = project.project_services
            .map(ps => ps.services)
            .filter((s): s is NonNullable<typeof s> => s !== null)
            .map(service => ({
                id: service.id,
                title: service.title,
                slug: service.slug,
                icon: null, // Set to null as there's no direct icon relationship
            }));

        return {
            id: project.id,
            slug: project.slug,
            title: project.title,
            description: project.description,
            featured_image_url: project.featured_image_url,
            services: services.length > 0 ? services : null,
        };
    });
}

// --- Data Fetching Functions ---
// FIX: Removed the invalid 'icons' join from the 'services' table select.
const PROJECT_CARD_SELECT_QUERY = `
    id, slug, title, description, featured_image_url,
    project_services ( services ( id, slug, title ))
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
  return mapRawProjects(data as unknown as ProjectWithServices[]);
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
    return mapRawProjects(data as unknown as ProjectWithServices[]);
}

// Note: The getProjectBySlug function is not included here as it wasn't part of the error.
// If it exists in your file, it should remain.