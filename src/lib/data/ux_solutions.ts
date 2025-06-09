// FINAL VERSION: Applying all learned fixes.
// - Switched to the async `createServerClient` for server-side data fetching.
// - Explicitly typed the data returned from the complex Supabase query to
//   resolve all implicit `any` and `unsafe-*` errors.
// - Used `unknown` for the flexible JSON content type for better safety.
// - Added local definitions for `UxProblemRow` and `UxProblemCardItem` to
//   resolve the "error" type issue.
// - Used explicit type casting (`as`) to enforce strong types on query results.
// - Removed redundant conditional and avoided direct destructuring of Supabase results.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';

export interface IconData {
  name: string;
  icon_library: string | null;
}

export type UxProblemRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured: boolean | null;
  sort_order: number | null;
  icons: IconData[] | null;
};

export interface UxProblemCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number | null;
}

// Defines the exact shape of the data returned by the getAllUxSolutions query
type UxSolutionWithIconList = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured: boolean | null;
  sort_order: number | null;
  icons: IconData[] | null;
};

type UxProblemSolutionJoin = {
  ux_problems: UxProblemRow | null;
};

type UxSolutionWithProblems = Database['public']['Tables']['ux_solutions']['Row'] & {
  ux_problem_solutions: UxProblemSolutionJoin[];
  icons: IconData[] | null;
};

export interface UxSolutionContentJson {
  [key: string]: unknown;
}

export interface UxSolutionCardItem {
  id:string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number | null;
}

export interface UxSolutionDetail extends UxSolutionCardItem {
  content: UxSolutionContentJson | null;
  relatedProblems: UxProblemCardItem[] | null;
}

export async function getAllUxSolutions(): Promise<UxSolutionCardItem[]> {
  noStore();
  const supabase = await createServerClient();
  
  // FIX: Avoid direct destructuring to prevent unsafe-assignment errors.
  const response = await supabase
    .from('ux_solutions')
    .select('id, slug, title, description, featured, sort_order, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (response.error) {
    console.error('Error fetching all UX solutions:', response.error.message);
    return [];
  }
  
  const data = response.data as UxSolutionWithIconList[];
  
  // FIX: Removed unnecessary conditional. An empty array is not falsy.
  return data.map(solution => {
    const iconObject = Array.isArray(solution.icons) && solution.icons.length > 0 ? solution.icons[0] : null;
    const iconData = iconObject ? { name: iconObject.name, icon_library: iconObject.icon_library } : null;
      
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

export async function getUxSolutionBySlug(slug: string): Promise<UxSolutionDetail | null> {
  noStore();
  const supabase = await createServerClient();
  
  // FIX: Avoid direct destructuring to resolve the "unsafe array destructuring" error.
  const response = await supabase
    .from('ux_solutions')
    .select('*, icons (name, icon_library), ux_problem_solutions(ux_problems!inner(*, icons(name, icon_library)))')
    .eq('slug', slug)
    .single();

  if (response.error) {
    if (response.error.code === 'PGRST116') {
      console.warn(`UX solution with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching UX solution by slug "${slug}":`, response.error.message);
    return null;
  }
  if (!response.data) return null;
  
  const typedData = response.data as UxSolutionWithProblems;

  const iconObject = Array.isArray(typedData.icons) && typedData.icons.length > 0 ? typedData.icons[0] : null;
  const solutionIconData = iconObject ? { name: iconObject.name, icon_library: iconObject.icon_library } : null;

  const relatedProblems = typedData.ux_problem_solutions
    .flatMap(joinEntry => joinEntry.ux_problems) 
    .map(problem => {
      if (!problem) return null;

      const problemIconObject = Array.isArray(problem.icons) && problem.icons.length > 0 ? problem.icons[0] : null;
      const problemIconData = problemIconObject ? { name: problemIconObject.name, icon_library: problemIconObject.icon_library } : null;
          
      return {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        description: problem.description,
        icon: problemIconData,
        featured: problem.featured ?? null,
        sort_order: problem.sort_order ?? null,
      };
    })
    .filter((p): p is UxProblemCardItem => p !== null);

  return {
    id: typedData.id,
    slug: typedData.slug,
    title: typedData.title,
    description: typedData.description,
    icon: solutionIconData,
    featured: typedData.featured,
    sort_order: typedData.sort_order,
    content: typedData.content as UxSolutionContentJson | null,
    relatedProblems: relatedProblems.length > 0 ? relatedProblems : null,
  };
}