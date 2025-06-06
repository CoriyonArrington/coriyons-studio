// src/lib/data/ux_problems.ts
import { createClient } from '@/src/utils/supabase/client';
import { unstable_noStore as noStore } from 'next/cache';
import type { UxSolutionCardItem } from './ux_solutions'; // Import for related solutions

// Re-using IconData interface definition
export interface IconData {
  name: string;
  icon_library: string | null;
}

// Interface for the structured JSONB content of a UX problem
export interface UxProblemContentJson {
  symptoms?: string[];
  potential_causes?: string[];
  real_world_examples?: Array<{ example: string; impact: string }>;
  questions_to_ask?: string[];
  [key: string]: any;
}

// Interface for UX problem cards
export interface UxProblemCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number | null;
}

// Interface for the full UX problem detail
export interface UxProblemDetail extends UxProblemCardItem {
  content: UxProblemContentJson | null;
  relatedSolutions: UxSolutionCardItem[] | null; // Added field for related solutions
}

/**
 * Fetches all UX problems, primarily for listing pages.
 */
export async function getAllUxProblems(): Promise<UxProblemCardItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ux_problems')
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
    console.error('Error fetching all UX problems:', error.message);
    return [];
  }
  if (!data) return [];
  return data.map(problem => {
    const iconData = problem.icons
      ? { name: (problem.icons as any).name, icon_library: (problem.icons as any).icon_library }
      : null;
    return {
      id: problem.id,
      slug: problem.slug,
      title: problem.title,
      description: problem.description,
      icon: iconData,
      featured: problem.featured,
      sort_order: problem.sort_order,
    };
  });
}

/**
 * Fetches a single UX problem by its slug for the detail page,
 * including related solutions.
 */
export async function getUxProblemBySlug(slug: string): Promise<UxProblemDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ux_problems')
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
        ux_solutions (
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
      console.warn(`UX problem with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching UX problem by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;

  const problemIconData = data.icons
    ? { name: (data.icons as any).name, icon_library: (data.icons as any).icon_library }
    : null;

  // Extract and map related solutions
  const relatedSolutions = data.ux_problem_solutions?.map((joinEntry: any) => {
    if (!joinEntry.ux_solutions) return null; // Should not happen if data is consistent
    const solutionIconData = joinEntry.ux_solutions.icons
        ? { name: (joinEntry.ux_solutions.icons as any).name, icon_library: (joinEntry.ux_solutions.icons as any).icon_library }
        : null;
    return {
      id: joinEntry.ux_solutions.id,
      slug: joinEntry.ux_solutions.slug,
      title: joinEntry.ux_solutions.title,
      description: joinEntry.ux_solutions.description,
      // Ensure UxSolutionCardItem doesn't strictly require featured/sort_order if not selected here
      // For simplicity, assuming UxSolutionCardItem is flexible or these fields are nullable.
      // If UxSolutionCardItem requires featured and sort_order, you'd need to select them in the sub-query.
      icon: solutionIconData,
      featured: joinEntry.ux_solutions.featured || null, // Add if needed and selected
      sort_order: joinEntry.ux_solutions.sort_order || null, // Add if needed and selected
    };
  }).filter(Boolean) as UxSolutionCardItem[] || null;


  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    icon: problemIconData,
    featured: data.featured,
    sort_order: data.sort_order,
    content: data.content as UxProblemContentJson | null,
    relatedSolutions: relatedSolutions,
  };
}