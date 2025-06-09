// FINAL, SELF-CONTAINED VERSION
// This version manually defines all necessary types to make the file
// self-sufficient and immune to external type-generation issues.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core & Related Type Definitions ---

export interface IconData {
  name: string;
  icon_library: string | null;
}

// FIX: Replaced `any` with the safer `unknown` type.
export interface ProcessStepContentJson {
  [key: string]: unknown;
}

// A sub-step or detail associated with a main process step.
export interface ProcessSubStep {
    id: string;
    title: string;
    description: string | null;
    icon: IconData | null;
}

export interface ProcessStep {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  sort_order: number | null;
}

export interface ProcessStepDetail extends ProcessStep {
  content: ProcessStepContentJson | null;
  sub_steps: ProcessSubStep[] | null;
}

// --- Self-Contained Row & Joined Types ---

// Manually define the shape of a row from the 'process_steps' table.
type ProcessStepRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  content: unknown;
};

// Manually define the shape for a joined sub-step.
type SubStepRow = {
    id: string;
    title: string;
    description: string | null;
};

// The fully joined shape for the getProcessStepBySlug query.
type ProcessStepWithSubSteps = ProcessStepRow & {
  process_sub_steps: (SubStepRow & {
    icons: IconData[] | null;
  })[];
  icons: IconData[] | null;
};

// --- Helper Functions ---

// Synchronous helper to extract an icon.
function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) {
    return item.icons[0];
  }
  return null;
}

// --- Data Fetching Functions ---

export async function getAllProcessSteps(): Promise<ProcessStep[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('process_steps')
    .select('id, slug, title, description, sort_order, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (response.error) {
    console.error('Error fetching all process steps:', response.error.message);
    return [];
  }

  // FIX: Cast to a specific, correct type to resolve all `unsafe-*` errors.
  const data = response.data as (ProcessStepRow & { icons: IconData[] | null })[];

  return data.map(step => ({
    id: step.id,
    slug: step.slug,
    title: step.title,
    description: step.description,
    sort_order: step.sort_order,
    // FIX: Removed incorrect `await`.
    icon: getIcon(step),
  }));
}

export async function getProcessStepBySlug(slug: string): Promise<ProcessStepDetail | null> {
    noStore();
    const supabase = await createServerClient();

    const response = await supabase
      .from('process_steps')
      .select('*, icons (name, icon_library), process_sub_steps (*, icons (name, icon_library))')
      .eq('slug', slug)
      .single();

    if (response.error) {
      console.error(`Error fetching process step by slug "${slug}":`, response.error.message);
      return null;
    }

    const typedData = response.data as ProcessStepWithSubSteps;

    // FIX: Unnecessary conditionals and optional chains are removed.
    const sub_steps = typedData.process_sub_steps.map(sub_step => ({
        id: sub_step.id,
        title: sub_step.title,
        description: sub_step.description,
        icon: getIcon(sub_step)
    }));

    return {
        id: typedData.id,
        slug: typedData.slug,
        title: typedData.title,
        description: typedData.description,
        sort_order: typedData.sort_order,
        icon: getIcon(typedData),
        content: typedData.content as ProcessStepContentJson | null,
        sub_steps: sub_steps.length > 0 ? sub_steps : null,
    };
}