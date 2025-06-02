// src/lib/data/pages.ts
// - Corrected getNavigablePages to sort strictly by the 'sort_order' column
//   from the database for 'MAIN', 'CONTENT_HUB', and 'RESOURCES' page types.
// - Removed the secondary JavaScript sort that was overriding the DB's global sort_order.

import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export type GenericPageContent = { [key: string]: any } | null;

export interface PageContentSectionData {
  headline: string;
  subheadline?: string;
  body_paragraph?: string;
  body_paragraphs?: string[];
  body_intro_paragraph?: string;
  body_intro_paragraphs?: string[];
  body_outro_paragraph?: string;
  cta?: { text: string; href: string };
  ctas?: Array<{ text: string; href?: string }>;
  items?: Array<{ quote: string; author: string } | { summary: string } | { title: string; description: string }>;
  steps?: Array<{ title: string; description: string }>;
  examples?: Array<{ summary: string }>;
  points?: string[];
  [key: string]: any;
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
  [key: string]: unknown;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  page_type: string;
  content: GenericPageContent;
  meta_description: string | null;
  og_image_url: string | null;
  status: string;
  sort_order?: number | null;
}

export async function getPageContentBySlug(slug: string): Promise<PageData | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title, page_type, content, meta_description, og_image_url, status, sort_order')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single();
  if (error) {
    console.error(`Error fetching page content for slug "${slug}":`, error.message);
    return null;
  }
  return data as PageData | null;
}

export interface NavigablePageInfo {
  slug: string;
  title: string;
  page_type: string;
  sort_order?: number | null;
}

export async function getNavigablePages(): Promise<NavigablePageInfo[]> {
  noStore();
  const supabase = await createClient();
  const includedPageTypes = ['MAIN', 'CONTENT_HUB', 'RESOURCES']; // Page types to include in prev/next nav

  const { data, error } = await supabase
    .from('pages')
    .select('slug, title, page_type, sort_order')
    .in('page_type', includedPageTypes)
    .eq('status', 'PUBLISHED')
    .order('sort_order', { ascending: true }); // Rely SOLELY on this database ordering

  if (error) {
    console.error('Error fetching navigable pages:', error.message);
    return [];
  }

  // The data should now be correctly sorted by the database's 'sort_order' globally.
  // No additional JavaScript sorting based on page_type category is needed here.
  return data ? data.map(page => ({
    slug: page.slug,
    title: page.title,
    page_type: page.page_type, // Still needed for the category label display
    sort_order: page.sort_order,
  })) : [];
}