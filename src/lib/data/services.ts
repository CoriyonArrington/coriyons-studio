// src/lib/data/services.ts
// - Added getServiceBySlug function to fetch a single service's details.
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface ServiceContentData {
  price?: string;
  what_you_get?: string; // For individual services
  turnaround?: string;   // For individual services
  capacity?: string;     // For individual services
  guarantee?: string;    // For individual services
  cta_text?: string;     // For individual services (e.g., "Book this Service")
  cta_link?: string;     // For individual services (e.g., a specific contact or booking link)
  // For bundles:
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
  description: string | null; // This is the short description for cards
  offering_type: 'INDIVIDUAL' | 'BUNDLE' | null;
  content: ServiceContentData | null; // Detailed content from JSONB
  featured_image_url: string | null;
  sort_order?: number | null;
  featured?: boolean | null;
}

export async function getFeaturedServices(limit: number = 6): Promise<ServiceData[]> {
  noStore();
  const supabase = await createClient();
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
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, content, featured_image_url, sort_order, featured')
    .order('offering_type', { ascending: true }) // Bundles first
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all services:', error.message);
    return [];
  }

  const allServicesWithCastedContent: ServiceData[] = data.map(service => ({
    ...service,
    content: service.content as ServiceContentData | null
  }));

  allServicesWithCastedContent.sort((a, b) => {
    if (a.offering_type === 'BUNDLE' && b.offering_type !== 'BUNDLE') return -1;
    if (a.offering_type !== 'BUNDLE' && b.offering_type === 'BUNDLE') return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
  return allServicesWithCastedContent;
}

// New function to get a single service by its slug
export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, content, featured_image_url, sort_order, featured')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching service by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) {
    return null;
  }
  return {
    ...data,
    content: data.content as ServiceContentData | null,
  } as ServiceData;
}