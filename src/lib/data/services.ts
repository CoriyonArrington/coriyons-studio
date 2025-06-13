// src/lib/data/services.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { HomepageTestimonial } from './testimonials';
import type { Database } from '@/src/types/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---
export interface ServiceContentJson {
  [key: string]: unknown;
}

export interface ServiceCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  offering_type: string | null;
  featured_image_url: string | null;
}

export interface ServiceDetail extends ServiceCardItem {
  content: ServiceContentJson | null;
  relatedTestimonials: HomepageTestimonial[] | null;
}

// --- Internal Types for Supabase Responses ---
type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

type RawServiceWithTestimonials = Database['public']['Tables']['services']['Row'] & {
    testimonial_services: {
        testimonials: TestimonialRow | null;
    }[];
};

// --- DATA FETCHING FUNCTIONS ---
export async function getAllServices(): Promise<ServiceCardItem[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, featured_image_url')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all services:', error.message);
    return [];
  }

  return data;
}

export async function getFeaturedServices(limit: number = 3): Promise<ServiceCardItem[]> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, featured_image_url')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured services:', error.message);
    return [];
  }
  return data;
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  noStore();
  const supabase = createClient();

  // FIX: Explicitly type the response to fix unsafe destructuring.
  const { data, error }: PostgrestSingleResponse<RawServiceWithTestimonials> = await supabase
    .from('services')
    .select('*, testimonial_services(testimonials(*))')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
        console.error(`Error fetching service by slug "${slug}":`, error.message);
    }
    return null;
  }
  
  const serviceData = data;

  const relatedTestimonials = serviceData.testimonial_services
    .map(join => join.testimonials)
    .filter((t): t is TestimonialRow => t !== null);

  return {
    id: serviceData.id,
    slug: serviceData.slug,
    title: serviceData.title,
    description: serviceData.description,
    offering_type: serviceData.offering_type,
    featured_image_url: serviceData.featured_image_url,
    content: serviceData.content as ServiceContentJson | null,
    relatedTestimonials: relatedTestimonials.length > 0 ? relatedTestimonials : null,
  };
}