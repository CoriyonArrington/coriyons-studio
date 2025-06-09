// FINAL VERSION: Applying all learned fixes for the new file.
// - Removed explicit `any` and replaced with `unknown`.
// - Correctly handled async/await, removing `await` from non-promise values.
// - Implemented a robust data fetching pattern with explicit casting to resolve
//   all implicit `any` and `unsafe-*` errors from Supabase.
// - Cleaned up all unnecessary conditional checks (`!data`, `??`, `?.`).
// - Added a local definition for `UxSolutionRow` to fix the import error.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
// FIX: Removed `UxSolutionRow` from the import as it's not exported from the module.
import type { UxSolutionCardItem } from './ux_solutions';
import type { Database } from '@/src/types/supabase';

export interface IconData {
  name: string;
  icon_library: string | null;
}

// FIX: Added a local definition for `UxSolutionRow` to resolve the root error.
export type UxSolutionRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured: boolean | null;
  sort_order: number | null;
  icons: IconData[] | null;
};

export interface UxProblemContentJson {
  [key: string]: unknown;
}

export interface UxProblemCardItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: IconData | null;
  featured: boolean | null;
  sort_order: number | null;
}

export interface UxProblemDetail extends UxProblemCardItem {
  content: UxProblemContentJson | null;
  relatedSolutions: UxSolutionCardItem[] | null;
}

type UxProblemWithIconList = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured: boolean | null;
  sort_order: number | null;
  icons: IconData[] | null;
};

type UxProblemSolutionJoin = {
  // This type now correctly references the local `UxSolutionRow`.
  ux_solutions: UxSolutionRow | null;
};

type UxProblemWithSolutions = Database['public']['Tables']['ux_problems']['Row'] & {
  ux_problem_solutions: UxProblemSolutionJoin[];
  icons: IconData[] | null;
};

function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) {
    return item.icons[0];
  }
  return null;
}

export async function getAllUxProblems(): Promise<UxProblemCardItem[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('ux_problems')
    .select('id, slug, title, description, featured, sort_order, icons (name, icon_library)')
    .order('sort_order', { ascending: true });

  if (response.error) {
    console.error('Error fetching all UX problems:', response.error.message);
    return [];
  }

  const data = response.data as UxProblemWithIconList[];

  return data.map(problem => {
    const iconData = getIcon(problem);

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

export async function getUxProblemBySlug(slug: string): Promise<UxProblemDetail | null> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('ux_problems')
    .select('*, icons (name, icon_library), ux_problem_solutions(ux_solutions!inner(*, icons(name, icon_library)))')
    .eq('slug', slug)
    .single();

  if (response.error) {
    if (response.error.code === 'PGRST116') {
      console.warn(`UX problem with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching UX problem by slug "${slug}":`, response.error.message);
    return null;
  }

  if (!response.data) {
    return null;
  }

  const typedData = response.data as UxProblemWithSolutions;
  
  const problemIconData = getIcon(typedData);

  // With `UxSolutionRow` now correctly typed, all `unsafe-*` errors are resolved.
  const relatedSolutions = typedData.ux_problem_solutions
    .map(joinEntry => {
      const solution = joinEntry.ux_solutions;
      if (!solution) return null;

      const solutionIcon = getIcon(solution);

      return {
        id: solution.id,
        slug: solution.slug,
        title: solution.title,
        description: solution.description,
        icon: solutionIcon,
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
    icon: problemIconData,
    featured: typedData.featured,
    sort_order: typedData.sort_order,
    content: typedData.content as UxProblemContentJson | null,
    relatedSolutions: relatedSolutions.length > 0 ? relatedSolutions : null,
  };
}