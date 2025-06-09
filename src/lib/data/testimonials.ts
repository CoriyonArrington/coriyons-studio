// FINAL, SELF-CONTAINED VERSION
// This version uses our established robust pattern to resolve the final data layer errors.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core Type Definitions ---

export interface HomepageTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company_name: string | null;
  avatar_url: string | null;
  sort_order: number | null;
}

// --- Self-Contained Row & Joined Types ---

// Manually define the shape of a row from the 'testimonials' table.
type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company_name: string | null;
  avatar_url: string | null;
  sort_order: number | null;
};

// --- Data Fetching Functions ---

export async function getHomepageTestimonials(): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('testimonials')
    .select('*')
    .eq('on_homepage', true)
    .order('sort_order', { ascending: true });

    if (response.error) {
        console.error('Error fetching homepage testimonials:', response.error.message);
        return [];
    }
  
    // All data is guaranteed to match the shape, so no complex mapping is needed.
    return response.data as TestimonialRow[];
}

export async function getAllTestimonials(): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

    if (response.error) {
        console.error('Error fetching all testimonials:', response.error.message);
        return [];
    }
  
    return response.data as TestimonialRow[];
}