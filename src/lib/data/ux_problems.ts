// src/lib/data/ux_problems.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---
export interface IconData {
  name: string;
  icon_library: string | null;
}

export interface UxSolutionCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number;
}

export interface UxProblemContentJson {
  symptoms?: string[];
  potential_causes?: string[];
  real_world_examples?: Array<{ example: string; impact: string }>;
  questions_to_ask?: string[];
}

export interface UxProblemCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number;
}

export interface UxProblemDetail extends UxProblemCardItem {
  content: UxProblemContentJson | null;
  relatedSolutions: UxSolutionCardItem[] | null;
}

// --- Internal Types for Supabase Responses ---
type RawIcon = { name: string; icon_library: string | null } | null;

type RawUxProblem = Database['public']['Tables']['ux_problems']['Row'] & {
  icons: RawIcon;
};

type RawUxProblemWithSolutions = RawUxProblem & {
  ux_problem_solutions: {
    ux_solutions: {
      id: string;
      slug: string;
      title: string;
      description: string | null;
      featured: boolean | null;
      sort_order: number;
      icons: RawIcon;
    } | null;
  }[];
};

// --- HELPER FUNCTIONS ---
function getIconFromRaw(item: { icons: RawIcon }): IconData | null {
  return item.icons ? { name: item.icons.name, icon_library: item.icons.icon_library } : null;
}

// --- DATA FETCHING FUNCTIONS ---
export async function getAllUxProblems(): Promise<UxProblemCardItem[]> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ux_problems')
    .select('id, slug, title, description, featured, sort_order, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all UX problems:', error.message);
    return [];
  }
  // FIX: Cast the Supabase data to our specific raw type before mapping.
  const rawProblems = data as unknown as RawUxProblem[];
  return rawProblems.map(p => ({ ...p, icon: getIconFromRaw(p) }));
}

export async function getUxProblemBySlug(slug: string): Promise<UxProblemDetail | null> {
  noStore();
  const supabase = createClient();
  // FIX: Explicitly type the response to fix unsafe destructuring.
  const { data, error }: PostgrestSingleResponse<RawUxProblemWithSolutions> = await supabase
    .from('ux_problems')
    .select('*, icons (name, icon_library), ux_problem_solutions(ux_solutions!inner(*, icons(name, icon_library)))')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') console.error(`Error fetching UX problem by slug "${slug}":`, error.message);
    return null;
  }

  const typedData = data;
  
  const relatedSolutions = typedData.ux_problem_solutions
    .map(joinEntry => {
      const solution = joinEntry.ux_solutions;
      if (!solution) return null;
      
      return {
        id: solution.id,
        slug: solution.slug,
        title: solution.title,
        description: solution.description,
        icon: getIconFromRaw(solution),
        featured: solution.featured,
        sort_order: solution.sort_order,
      };
    })
    .filter((s): s is UxSolutionCardItem => s !== null);

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    icon: getIconFromRaw(typedData),
    featured: typedData.featured,
    sort_order: typedData.sort_order,
    content: typedData.content as UxProblemContentJson | null,
    relatedSolutions: relatedSolutions.length > 0 ? relatedSolutions : null,
  };
}