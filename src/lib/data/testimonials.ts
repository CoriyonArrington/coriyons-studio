// src/lib/data/testimonials.ts
// - Added getAllTestimonials function to fetch all testimonials.
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface HomepageTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company_name: string | null;
  avatar_url: string | null;
  // project_id: string | null; // Optional
  // Add sort_order if you want to use it for getAllTestimonials display order
  sort_order?: number | null;
}

export async function getFeaturedTestimonials(limit: number = 3): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('id, quote, name, role, company_name, avatar_url, sort_order')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured testimonials:', error.message);
    return [];
  }
  return data || [];
}

// New function to get all testimonials
export async function getAllTestimonials(): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('id, quote, name, role, company_name, avatar_url, sort_order')
    // No .eq('featured', true) filter, so it fetches all
    .order('sort_order', { ascending: true }); // Order all testimonials by sort_order

  if (error) {
    console.error('Error fetching all testimonials:', error.message);
    return [];
  }
  return data || [];
}