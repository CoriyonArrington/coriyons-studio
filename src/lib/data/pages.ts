import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { PageRow, FaqPageJoin, UxProblemPageJoin, UxSolutionPageJoin } from './minimal_pages_schema';

export interface NavigablePageInfo {
  slug: string;
  title: string;
  page_type: string;
}

export type PageWithRelations = PageRow & FaqPageJoin & UxProblemPageJoin & UxSolutionPageJoin;

export async function getPageBySlug(slug: string): Promise<PageWithRelations | null> {
    noStore();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select(`
        *,
        faq_pages ( faqs ( * ) ),
        ux_problem_pages ( ux_problems ( *, icons ( name, icon_library ) ) ),
        ux_solution_pages ( ux_solutions ( *, icons ( name, icon_library ) ) )
      `)
      .eq('slug', slug)
      .single();
  
    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`Error fetching page by slug "${slug}":`, error.message);
      }
      return null;
    }
    return data as PageWithRelations;
}

export async function getNavigablePages(): Promise<NavigablePageInfo[]> {
    noStore();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, page_type')
      .in('status', ['PUBLISHED'])
      .not('page_type', 'in', '("LEGAL","OTHER","STANDARD")')
      .order('sort_order', { ascending: true });
  
    if (error) {
      console.error('Error fetching navigable pages:', error.message);
      return [];
    }
    return data;
}

export async function getCategorizedFooterPages() {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('title, slug, page_type, sort_order')
    .in('status', ['PUBLISHED'])
    .in('page_type', ['MAIN', 'RESOURCES', 'SUPPORT', 'LEGAL']);

  if (error) {
    console.error('Error fetching footer pages:', error);
    return { MAIN: [], RESOURCES: [], SUPPORT: [], LEGAL: [] };
  }

  const categorized: Record<string, { title: string; href: string }[]> = {
    MAIN: [],
    RESOURCES: [],
    SUPPORT: [],
    LEGAL: [],
  };

  data.forEach(page => {
    const category = page.page_type as keyof typeof categorized;
    if (categorized[category]) {
      categorized[category].push({ title: page.title, href: `/${page.slug}` });
    }
  });
  
  Object.values(categorized).forEach(arr => arr.sort((a, b) => a.title.localeCompare(b.title)));

  return categorized;
}