// src/lib/data/process.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---

export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface ContentPoint {
    title: string;
    description?: string;
    items?: string[];
}

export interface ContentVisual {
    url:string;
    alt?: string;
    caption?: string;
}

export interface ProcessStepContentJson {
    main_heading?: string;
    introduction?: string;
    sub_steps?: ContentPoint[];
    insights?: { title?: string; items?: string[] };
    visuals?: ContentVisual[];
    conclusion?: string;
    key_activities?: string;
}

export interface ProcessStepItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: IconData | null;
  sort_order: number;
  featured_image_url: string | null;
  content: ProcessStepContentJson | null;
}

// FIX: Change the empty interface to a type alias.
export type ProcessStepDetail = ProcessStepItem;


// --- Internal Types for Supabase Responses ---

type RawIcon = { name: string; icon_library: string | null } | null;

type RawProcessStep = Database['public']['Tables']['design_process_steps']['Row'] & {
  icons: RawIcon;
};

// --- HELPER FUNCTIONS ---
function processRawStep(step: RawProcessStep): ProcessStepItem {
    const content = step.content as ProcessStepContentJson | null;
    
    return {
      id: step.id,
      slug: step.slug,
      title: step.title,
      description: step.description,
      icon: step.icons,
      sort_order: step.sort_order,
      content: content,
      subtitle: content?.main_heading || null, 
      featured_image_url: content?.visuals?.[0]?.url || null,
    };
}

// --- DATA FETCHING FUNCTIONS ---

export async function getAllProcessSteps(): Promise<ProcessStepItem[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('design_process_steps')
    .select('*, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all process steps:', error.message);
    return [];
  }

  return (data as unknown as RawProcessStep[]).map(processRawStep);
}

export async function getProcessStepBySlug(slug: string): Promise<ProcessStepDetail | null> {
    noStore();
    const supabase = createClient();

    const { data, error }: PostgrestSingleResponse<RawProcessStep> = await supabase
      .from('design_process_steps')
      .select('*, icons (name, icon_library)')
      .eq('slug', slug)
      .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error(`Error fetching process step by slug "${slug}":`, error.message);
        }
        return null;
    }

    return processRawStep(data);
}