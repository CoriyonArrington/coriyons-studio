// src/lib/data/ux_solutions.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { UxProblemCardItem } from './ux_problems'; // Import for related problems

// Re-using IconData interface definition
export interface IconData {
  name: string;
  icon_library: string | null;
}

// Interface for the structured JSONB content of a UX solution
export interface UxSolutionContentJson {
  key_benefits?: string[];
  approach_summary?: string;
  deliverables_summary?: string;
  tools_used?: string[];
  case_study_ids?: string[];
  [key: string]: any;
}

// Interface for UX solution cards
export interface UxSolutionCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number | null;
}

// Interface for the full UX solution detail
export interface UxSolutionDetail extends UxSolutionCardItem {
  content: UxSolutionContentJson | null;
  relatedProblems: UxProblemCardItem[] | null; // Added field for related problems
}

/**
 * Fetches all UX solutions, primarily for listing pages.
 */
export async function getAllUxSolutions(): Promise<UxSolutionCardItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ux_solutions')
    .select(`
      id,
      slug,
      title,
      description,
      featured,
      sort_order,
      icons (
        name,
        icon_library
      )
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all UX solutions:', error.message);
    return [];
  }
  if (!data) return [];
  return data.map(solution => {
    const iconData = solution.icons
      ? { name: (solution.icons as any).name, icon_library: (solution.icons as any).icon_library }
      : null;
    return {
      id: solution.id,
      slug: solution.slug,
      title: solution.title,
      description: solution.description,
      icon: iconData,
      featured: solution.featured,
      sort_order: solution.sort_order,
    };
  });
}

/**
 * Fetches a single UX solution by its slug for the detail page,
 * including related problems.
 */
export async function getUxSolutionBySlug(slug: string): Promise<UxSolutionDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ux_solutions')
    .select(`
      id,
      slug,
      title,
      description,
      content,
      featured,
      sort_order,
      icons (name, icon_library),
      ux_problem_solutions (
        ux_problems (
          id,
          slug,
          title,
          description,
          icons (name, icon_library)
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn(`UX solution with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching UX solution by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;

  const solutionIconData = data.icons
    ? { name: (data.icons as any).name, icon_library: (data.icons as any).icon_library }
    : null;

  // Extract and map related problems
  const relatedProblems = data.ux_problem_solutions?.map((joinEntry: any) => {
    if (!joinEntry.ux_problems) return null;
    const problemIconData = joinEntry.ux_problems.icons
        ? { name: (joinEntry.ux_problems.icons as any).name, icon_library: (joinEntry.ux_problems.icons as any).icon_library }
        : null;
    return {
      id: joinEntry.ux_problems.id,
      slug: joinEntry.ux_problems.slug,
      title: joinEntry.ux_problems.title,
      description: joinEntry.ux_problems.description,
      icon: problemIconData,
      featured: joinEntry.ux_problems.featured || null, 
      sort_order: joinEntry.ux_problems.sort_order || null,
    };
  }).filter(Boolean) as UxProblemCardItem[] || null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    icon: solutionIconData,
    featured: data.featured,
    sort_order: data.sort_order,
    content: data.content as UxSolutionContentJson | null,
    relatedProblems: relatedProblems,
  };
}