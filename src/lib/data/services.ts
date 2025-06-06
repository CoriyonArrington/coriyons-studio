// src/lib/data/services.ts
// - Updated ServiceData interface to include relatedTestimonials.
// - Modified getServiceBySlug to fetch associated testimonials via testimonial_services table.

import { createClient } from '@/src/utils/supabase/client';
import { unstable_noStore as noStore } from 'next/cache';
import type { HomepageTestimonial } from './testimonials'; // Import for related testimonials

export interface ServiceContentData {
  price?: string;
  what_you_get?: string;
  turnaround?: string;
  capacity?: string;
  guarantee?: string;
  cta_text?: string;
  cta_link?: string;
  includes_summary?: string;
  perfect_for?: string;
  use_cases?: string[];
  savings_summary?: string;
  value_summary?: string;
  [key: string]: any;
}

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  offering_type: 'INDIVIDUAL' | 'BUNDLE' | null;
  content: ServiceContentData | null;
  featured_image_url: string | null;
  sort_order?: number | null;
  featured?: boolean | null;
  relatedTestimonials?: HomepageTestimonial[] | null; // Added field for related testimonials
}

export async function getFeaturedServices(limit: number = 6): Promise<ServiceData[]> {
  noStore();
  const supabase = await createClient();
  // Query remains the same as it doesn't need related testimonials for featured cards
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, content, featured_image_url, sort_order, featured')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured services:', error.message);
    return [];
  }
  return data ? data.map(service => ({
    ...service,
    content: service.content as ServiceContentData | null
  })) : [];
}

export async function getAllServices(): Promise<ServiceData[]> {
  noStore();
  const supabase = await createClient();
  // Query remains the same
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, content, featured_image_url, sort_order, featured')
    .order('offering_type', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all services:', error.message);
    return [];
  }

  const allServicesWithCastedContent: ServiceData[] = data.map(service => ({
    ...service,
    content: service.content as ServiceContentData | null
  }));

  // Sorting logic remains the same
  allServicesWithCastedContent.sort((a, b) => {
    if (a.offering_type === 'BUNDLE' && b.offering_type !== 'BUNDLE') return -1;
    if (a.offering_type !== 'BUNDLE' && b.offering_type === 'BUNDLE') return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
  return allServicesWithCastedContent;
}

export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      slug,
      title,
      description,
      offering_type,
      content,
      featured_image_url,
      sort_order,
      featured,
      testimonial_services (
        testimonials (
          id,
          quote,
          name,
          role,
          company_name,
          avatar_url,
          sort_order 
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
        console.warn(`Service with slug "${slug}" not found.`);
        return null;
    }
    console.error(`Error fetching service by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) {
    return null;
  }

  // Extract and map related testimonials
  const relatedTestimonials = data.testimonial_services?.map((ts: any) => {
    if (!ts.testimonials) return null;
    return {
      id: ts.testimonials.id,
      quote: ts.testimonials.quote,
      name: ts.testimonials.name,
      role: ts.testimonials.role,
      company_name: ts.testimonials.company_name,
      avatar_url: ts.testimonials.avatar_url,
      sort_order: ts.testimonials.sort_order, 
      // Ensure HomepageTestimonial interface matches these fields
    };
  }).filter(Boolean) as HomepageTestimonial[] || undefined; // Use undefined if empty for optional field

  // Order testimonials by their sort_order if it exists
  if (relatedTestimonials) {
    relatedTestimonials.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  return {
    ...data,
    content: data.content as ServiceContentData | null,
    relatedTestimonials: relatedTestimonials && relatedTestimonials.length > 0 ? relatedTestimonials : undefined,
  } as ServiceData;
}