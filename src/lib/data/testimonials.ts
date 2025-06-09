import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface HomepageTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company_name: string | null;
  avatar_url: string | null;
  sort_order: number | null;
}

type TestimonialRow = HomepageTestimonial;

export async function getFeaturedTestimonials(limit: number = 3): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

    if (error) {
        console.error('Error fetching featured testimonials:', error.message);
        return [];
    }
  
    return data as TestimonialRow[];
}

export async function getAllTestimonials(): Promise<HomepageTestimonial[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching all testimonials:', error.message);
        return [];
    }
  
    return data as TestimonialRow[];
}