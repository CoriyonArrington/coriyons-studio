import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';

// Local type definitions
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
  sort_order: number | null;
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
  sort_order: number | null;
}

export interface UxSolutionDetail extends UxSolutionCardItem {
  content: UxSolutionContentJson | null;
  relatedProblems: UxProblemCardItem[] | null;
}

// Internal types for Supabase queries
type UxSolutionWithIconList = Database['public']['Tables']['ux_solutions']['Row'] & {
  icons: IconData[] | null;
};

type UxSolutionWithProblems = UxSolutionWithIconList & {
  ux_problem_solutions: {
    ux_problems: {
      id: string;
      slug: string;
      title: string;
      description: string | null;
      featured: boolean | null;
      sort_order: number | null;
      icons: IconData[] | null;
    } | null;
  }[];
};

function getIcon(item: { icons: IconData[] | null }): IconData | null {
  if (Array.isArray(item.icons) && item.icons.length > 0) {
    return item.icons[0];
  }
  return null;
}

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
  
  return data.map(s => ({ ...s, icon: getIcon(s as any) }));
}

export async function getUxSolutionBySlug(slug: string): Promise<UxSolutionDetail | null> {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ux_solutions')
    .select('*, icons (name, icon_library), ux_problem_solutions(ux_problems!inner(*, icons(name, icon_library)))')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') console.error(`Error fetching UX solution by slug "${slug}":`, error.message);
    return null;
  }
  
  const typedData = data as unknown as UxSolutionWithProblems;

  const relatedProblems = typedData.ux_problem_solutions
    .map(joinEntry => {
       const problem = joinEntry.ux_problems;
       if (!problem) return null;
       
       return {
            id: problem.id,
            slug: problem.slug,
            title: problem.title,
            description: problem.description,
            icon: getIcon(problem),
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
    icon: getIcon(typedData),
    featured: typedData.featured,
    sort_order: typedData.sort_order,
    content: typedData.content as UxSolutionContentJson | null,
    relatedProblems: relatedProblems.length > 0 ? relatedProblems : null,
  };
}