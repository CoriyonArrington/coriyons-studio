// ATTEMPT #4: Removing `await` from synchronous function calls.
// Change 1 & 2: The `getIcon` helper function is synchronous and does not return a Promise. Removed the unnecessary `await` keyword from the calls to this function inside `getAllProjects` and `getProjectBySlug` to resolve the `await-thenable` errors.

import { createClient as createServerClient } from '@/src/utils/supabase/server';
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
  featured_image: ProjectImage | null;
  services: ProjectService[] | null;
}

export interface ProjectDetail extends ProjectCardItem {
  content: ProjectContentJson | null;
  testimonial: ProjectTestimonial | null;
  other_images: ProjectImage[] | null;
}

// --- Self-Contained Row & Joined Types ---

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: unknown;
};

type ServiceRow = { id: string; slug: string; title: string; };
type TestimonialRow = { id: string; quote: string; name: string; };
type ImageRow = { id: string; image_url: string; alt_text: string | null; image_type: 'FEATURED' | 'OTHER' };

type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  project_images: ImageRow[];
  project_services: {
    services: {
      id: string;
      slug: string;
      title: string;
      icons: IconData[] | null;
    }[] | null;
  }[];
};

type ProjectWithDetails = ProjectRow & {
  project_images: ImageRow[];
  project_services: { services: (ServiceRow & { icons: IconData[] | null; })[] | null; }[];
  project_testimonials: { testimonials: TestimonialRow | null; }[];
};


// --- Helper Functions ---

function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) {
    return item.icons[0];
  }
  return null;
}

// --- Data Fetching Functions ---

export async function getAllProjects(): Promise<ProjectCardItem[]> {
  noStore();
  const supabase = createServerClient();

  const response = await supabase
    .from('projects')
    .select(`
      id, slug, title, description,
      project_images!project_images_project_id_fkey (id, image_url, alt_text, image_type),
      project_services ( services ( id, slug, title, icons ( name, icon_library )))
    `)
    .order('sort_order', { ascending: true });

  if (response.error) {
    console.error('Error fetching all projects:', response.error.message);
    return [];
  }

  const data = response.data as ProjectCardData[];

  return data.map((project): ProjectCardItem => {
    const featuredImage = project.project_images.find((img) => img.image_type === 'FEATURED') || null;

    const services = project.project_services.flatMap((join) => {
        if (!join.services) return [];
        return join.services.map(service => ({
            id: service.id,
            title: service.title,
            slug: service.slug,
            icon: getIcon(service),
        }));
    });

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      featured_image: featuredImage,
      services: services.length > 0 ? services : null,
    };
  });
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  noStore();
  const supabase = createServerClient();

  const response = await supabase
    .from('projects')
    .select(`
      *,
      project_images (id, image_url, alt_text, image_type),
      project_services ( services ( id, slug, title, icons ( name, icon_library ))),
      project_testimonials ( testimonials ( id, quote, name ))
    `)
    .eq('slug', slug)
    .single();

  if (response.error) {
    console.error(`Error fetching project by slug "${slug}":`, response.error.message);
    return null;
  }

  const typedData = response.data as ProjectWithDetails;
  
  const featuredImage = typedData.project_images.find(img => img.image_type === 'FEATURED') || null;
  const otherImages = typedData.project_images.filter(img => img.image_type === 'OTHER');
  
  const services = typedData.project_services.flatMap(join => {
      if (!join.services) return [];
      return join.services.map(service => ({
          id: service.id,
          slug: service.slug,
          title: service.title,
          icon: getIcon(service),
      }));
  });

  const testimonial = typedData.project_testimonials[0]?.testimonials || null;

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    featured_image: featuredImage,
    services: services.length > 0 ? services : null,
    content: typedData.content as ProjectContentJson | null,
    testimonial: testimonial,
    other_images: otherImages.length > 0 ? otherImages : null,
  };
}