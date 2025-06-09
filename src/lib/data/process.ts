import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core & Related Type Definitions ---

export interface IconData {
  name: string;
  icon_library: string | null;
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

export interface ContentPoint {
    title: string;
    description?: string;
    items?: string[];
}

export interface ContentVisual {
    url: string;
    alt?: string;
    caption?: string;
}

export interface ProcessStepItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string | null;
  icon: IconData | null;
  sort_order: number | null;
  featured_image_url?: string | null;
  content?: ProcessStepContentJson | null;
}

export interface ProcessStepDetail extends ProcessStepItem {
  sub_steps: ProcessSubStep[] | null;
}

export interface ProcessSubStep {
    id: string;
    title: string;
    description: string | null;
    icon: IconData | null;
}

// --- Self-Contained Row & Joined Types ---
type ProcessStepRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  content: unknown;
  featured_image_url?: string | null;
  subtitle?: string | null;
  icons: IconData[] | null;
};

// --- Data Fetching Functions ---

export async function getAllProcessSteps(): Promise<ProcessStepItem[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('design_process_steps')
    .select('id, slug, title, description, sort_order, content, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all process steps:', error.message);
    return [];
  }

  return data.map(step => ({
    ...step,
    icon: Array.isArray(step.icons) && step.icons.length > 0 ? step.icons[0] : null,
    content: step.content as ProcessStepContentJson | null,
  }));
}

export async function getProcessStepBySlug(slug: string): Promise<ProcessStepDetail | null> {
    noStore();
    const supabase = createClient();

    const { data, error } = await supabase
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

    const stepData = data as unknown as ProcessStepItem & { sub_steps: ProcessSubStep[] | null };

    return {
        ...stepData,
        icon: Array.isArray(data.icons) && data.icons.length > 0 ? data.icons[0] : null,
        content: data.content as ProcessStepContentJson | null,
        sub_steps: null, // This would require another join; simplifying for now.
    };
}