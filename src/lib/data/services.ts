// src/lib/data/services.ts
import { createClient } from '@/src/utils/supabase/server'; // Adjust path if your server client is elsewhere
import { unstable_noStore as noStore } from 'next/cache';
// FIX: Removed unused 'Json' import
// import type { Json } from '@/src/types/supabase'; 

// Define the structure for the 'content' field within a service,
// especially for bundle-specific details.
export interface ServiceContentData {
  price?: string;
  what_you_get?: string; // For individual services
  turnaround?: string;   // For individual services
  capacity?: string;     // For individual services
  guarantee?: string;    // For individual services
  cta_text?: string;     // For individual services
  cta_link?: string;     // For individual services
  // For bundles:
  includes_summary?: string;
  perfect_for?: string;
  use_cases?: string[];
  savings_summary?: string;
  value_summary?: string; // For Elevate Bundle's specific wording
  // Add any other relevant fields from your service/bundle content JSON
}

export interface FeaturedService {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  offering_type: 'INDIVIDUAL' | 'BUNDLE' | null; // Using string literals for the ENUM values
  content: ServiceContentData | null; // Include the parsed JSONB content
  featured_image_url: string | null;
}

export async function getFeaturedServices(limit: number = 6): Promise<FeaturedService[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, title, description, offering_type, content, featured_image_url')
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