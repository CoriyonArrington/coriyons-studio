// src/lib/data/pages.ts (COMPLETE - Addressing no-explicit-any)
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
// Assuming you have a general Json type, if not, you might need to define one or rely on unknown
// import type { Json } from '@/src/types/supabase'; 

export interface PageContentSectionData {
  headline: string;
  subheadline?: string;
  body_paragraph?: string;
  body_paragraphs?: string[];
  body_intro_paragraph?: string;
  body_intro_paragraphs?: string[];
  body_outro_paragraph?: string;
  cta?: { text: string; href: string };
  ctas?: Array<{ text: string; href: string }>;
  items?: Array<{ quote: string; author: string } | { summary: string } | { title: string; description: string }>;
  core_services_headline?: string;
  core_services_list_markdown?: string;
  core_services_note?: string;
  bundles_headline?: string;
  bundles_list_markdown?: string;
  steps?: Array<{ title: string; description: string }>;
  examples?: Array<{ summary: string }>;
  points?: string[];
  document_title?: string;
  last_updated_date?: string;
  sections?: Array<{heading: string; content_md: string}>;
  form_intro?: string;
  contact_details?: {email: string; phone: string};
  intro_text?: string;
  services_display_config?: {layout: string};
  projects_display_config?: {layout: string; filter_by_tag: boolean};
}

export interface HomePageDbContentType {
  hero_section?: PageContentSectionData;
  why_our_studio_section?: PageContentSectionData;
  testimonials_section?: PageContentSectionData;
  services_section?: PageContentSectionData;
  process_section?: PageContentSectionData;
  case_studies_section?: PageContentSectionData;
  about_section?: PageContentSectionData;
  final_cta_section?: PageContentSectionData;
  // FIX: Changed 'any' to 'unknown' for the index signature
  // This allows for dynamic keys but is safer than 'any'.
  // You'll need type assertions or checks when accessing these dynamic keys.
  [key: string]: unknown; 
}

export interface PageData {
  id: string;
  slug: string;
  title: string; 
  page_type: string; 
  content: HomePageDbContentType | null; 
  meta_description: string | null;
  og_image_url: string | null;
  status: string; 
}

export async function getPageContentBySlug(slug: string): Promise<PageData | null> {
  noStore(); 
  const supabase = await createClient(); 
  
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title, page_type, content, meta_description, og_image_url, status')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single();

  if (error) {
    console.error(`Error fetching page content for slug "${slug}":`, error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    // Type assertion for content is still appropriate.
    // If data.content is truly unknown beyond HomePageDbContentType's known fields,
    // this cast might hide issues if the unknown parts are accessed without checks.
    // However, HomePageDbContentType with [key: string]: unknown already signals this.
    content: data.content as HomePageDbContentType 
  } as PageData;
}