// src/lib/data/process.ts
// - Ensuring ProcessStepDetailContent includes all expected fields.
// - Corrected icon data mapping from Supabase join.
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ProcessStepItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  icon: IconData | null;
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

// Ensure this matches the structure used in [slug]/page.tsx and your JSONB data
export interface ProcessStepDetailContent {
  main_heading?: string;
  introduction?: string;
  sub_steps?: ContentPoint[];
  key_outputs?: { title?: string; items: string[] };
  insights?: { title?: string; items: string[] };
  visuals?: ContentVisual[];
  conclusion?: string;
  [key: string]: any; // For any other dynamic fields
}

export interface ProcessStepDetail extends Omit<ProcessStepItem, 'icon'|'description'> { // description is part of content too
  description: string | null; // Short description from top-level
  content: ProcessStepDetailContent | null;
  icon: IconData | null;
}

export async function getAllProcessSteps(): Promise<ProcessStepItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('design_process_steps')
    .select('id, slug, title, description, sort_order, icons (id, name, icon_library)') // Select icon id too for safety
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all design process steps:', error.message);
    return [];
  }

  return data?.map(step => {
    const iconData = step.icons 
      ? { name: (step.icons as any).name, icon_library: (step.icons as any).icon_library } 
      : null;
    return {
      id: step.id,
      slug: step.slug,
      title: step.title,
      description: step.description,
      sort_order: step.sort_order,
      icon: iconData,
    };
  }) || [];
}

export async function getProcessStepBySlug(slug: string): Promise<ProcessStepDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('design_process_steps')
    .select('id, slug, title, description, content, sort_order, icons (id, name, icon_library)') // Select icon id
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error(`Error fetching process step by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;

  const iconData = data.icons 
    ? { name: (data.icons as any).name, icon_library: (data.icons as any).icon_library } 
    : null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description, // Top-level short description
    content: data.content as ProcessStepDetailContent | null,
    sort_order: data.sort_order,
    icon: iconData,
  };
}