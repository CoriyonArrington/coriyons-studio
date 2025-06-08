/*
 FINAL VERSION - Key Changes:
 - Corrected the logic for handling the 'icons' relationship. Supabase returns this as an array,
   so the code now correctly checks if the array exists and accesses the first element (`icons[0]`)
   to retrieve the icon data. This resolves all TypeScript errors.
*/
import { createClient } from '@/src/utils/supabase/client';
import { unstable_noStore as noStore } from 'next/cache';

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ProcessStepItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  featured_image_url: string | null;
  sort_order: number | null;
  icon: IconData | null;
  content: ProcessStepDetailContent | null;
}

export interface ContentPoint {
  title?: string;
  description: string;
  items?: string[];
}

export interface ContentVisual {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProcessStepDetailContent {
  main_heading?: string;
  introduction?: string;
  sub_steps?: ContentPoint[];
  key_outputs?: { title?: string; items: string[] };
  insights?: { title?: string; items: string[] };
  visuals?: ContentVisual[];
  conclusion?: string;
  key_activities?: string;
  [key: string]: any;
}

export interface ProcessStepDetail extends ProcessStepItem {}

export async function getAllProcessSteps(): Promise<ProcessStepItem[]> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('design_process_steps')
    .select('id, slug, title, subtitle, description, featured_image_url, content, sort_order, icons (id, name, icon_library)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all design process steps:', error.message);
    return [];
  }

  return data?.map(step => {
    // FIX: Check if icons is an array and has length, then access the first element.
    const iconObject = Array.isArray(step.icons) && step.icons.length > 0 ? step.icons[0] : null;
    const iconData = iconObject
      ? { name: iconObject.name, icon_library: iconObject.icon_library }
      : null;
      
    return {
      ...step,
      icon: iconData,
    } as ProcessStepItem;
  }) || [];
}

export async function getProcessStepBySlug(slug: string): Promise<ProcessStepDetail | null> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('design_process_steps')
    .select('id, slug, title, subtitle, description, featured_image_url, content, sort_order, icons (id, name, icon_library)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error(`Error fetching process step by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;

  // FIX: Check if icons is an array and has length, then access the first element.
  const iconObject = Array.isArray(data.icons) && data.icons.length > 0 ? data.icons[0] : null;
  const iconData = iconObject
    ? { name: iconObject.name, icon_library: iconObject.icon_library }
    : null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    featured_image_url: data.featured_image_url,
    content: data.content as ProcessStepDetailContent | null,
    sort_order: data.sort_order,
    icon: iconData,
  };
}