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
type ServiceRow = { id: string; slug: string; title: string; icons: IconData[] | null };
type TestimonialRow = { id: string; quote: string; name: string; };

type ProjectWithDetails = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured_image_url: string | null;
  content: unknown;
  project_services: { services: ServiceRow | null; }[];
  project_testimonials: { testimonials: TestimonialRow | null; }[];
  other_images: { url: string; alt?: string }[] | null;
};

// --- Helper Functions ---
function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) return item.icons[0];
  return null;
}

function mapRawProjects(rawProjects: any[]): ProjectCardItem[] {
    return rawProjects.map((project): ProjectCardItem => {
        const services = project.project_services
            // FIX: Added explicit type to the 'ps' parameter to resolve implicit any error.
            .map((ps: { services: ServiceRow | null }) => ps.services)
            .filter((s: ServiceRow | null): s is ServiceRow => s !== null)
            .map((service: ServiceRow) => ({
                id: service.id,
                title: service.title,
                slug: service.slug,
                icon: getIcon(service),
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
  return mapRawProjects(data);
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
    return mapRawProjects(data);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_services ( services ( *, icons ( name, icon_library ) ) ),
      project_testimonials ( testimonials ( id, quote, name ) )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
        console.error(`Error fetching project by slug "${slug}":`, error.message);
    }
    return null;
  }

  const typedData = data as ProjectWithDetails;
  
  const services = typedData.project_services
    .map(ps => ps.services)
    .filter((s): s is ServiceRow => s !== null)
    .map(service => ({
        id: service.id,
        slug: service.slug,
        title: service.title,
        icon: getIcon(service),
    }));

  const testimonial = typedData.project_testimonials[0]?.testimonials || null;

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    featured_image_url: typedData.featured_image_url,
    services: services.length > 0 ? services : null,
    content: typedData.content as ProjectContentJson | null,
    testimonial: testimonial,
    other_images: typedData.other_images, 
  };
}