// src/lib/data/ux_solutions.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---
export interface IconData {
  name: string;
  icon_library: string | null;
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

export interface UxSolutionContentJson {
    key_benefits?: string[];
    approach_summary?: string;
    deliverables_summary?: string;
    tools_used?: string[];
}

export interface UxSolutionCardItem {
  id:string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number;
}

export interface UxSolutionDetail extends UxSolutionCardItem {
  content: UxSolutionContentJson | null;
  relatedProblems: UxProblemCardItem[] | null;
}

// --- Internal Types for Supabase Responses ---
type RawIcon = { name: string; icon_library: string | null; } | null;

type RawUxSolution = Database['public']['Tables']['ux_solutions']['Row'] & {
  icons: RawIcon;
};

type RawUxSolutionWithProblems = RawUxSolution & {
  ux_problem_solutions: {
    ux_problems: {
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
export async function getAllUxSolutions(): Promise<UxSolutionCardItem[]> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ux_solutions')
    .select('id, slug, title, description, featured, sort_order, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all UX solutions:', error.message);
    return [];
  }
  
  // FIX: Cast the Supabase data to our specific raw type before mapping.
  const rawSolutions = data as unknown as RawUxSolution[];
  return rawSolutions.map(s => ({ ...s, icon: getIconFromRaw(s) }));
}

export async function getUxSolutionBySlug(slug: string): Promise<UxSolutionDetail | null> {
  noStore();
  const supabase = createClient();
  // FIX: Explicitly type the response to fix unsafe destructuring.
  const { data, error }: PostgrestSingleResponse<RawUxSolutionWithProblems> = await supabase
    .from('ux_solutions')
    .select('*, icons (name, icon_library), ux_problem_solutions(ux_problems!inner(*, icons(name, icon_library)))')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') console.error(`Error fetching UX solution by slug "${slug}":`, error.message);
    return null;
  }
  
  const typedData = data;

  const relatedProblems = typedData.ux_problem_solutions
    .map(joinEntry => {
       const problem = joinEntry.ux_problems;
       if (!problem) return null;
       
       return {
            id: problem.id,
            slug: problem.slug,
            title: problem.title,
            description: problem.description,
            icon: getIconFromRaw(problem),
            featured: problem.featured,
            sort_order: problem.sort_order,
       };
    })
    .filter((p): p is UxProblemCardItem => p !== null);

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    icon: getIconFromRaw(typedData),
    featured: typedData.featured,
    sort_order: typedData.sort_order,
    content: typedData.content as UxSolutionContentJson | null,
    relatedProblems: relatedProblems.length > 0 ? relatedProblems : null,
  };
}