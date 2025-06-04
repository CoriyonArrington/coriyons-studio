// src/lib/data/pages.ts

import { createClient } from "@/src/utils/supabase/server";

/**
 * ------------------------------------------------------------------------------
 * 1) “pages” table row type exactly as it exists in your SQL seed.
 * ------------------------------------------------------------------------------
 */
export interface PageRow {
  id: string;                         // uuid
  slug: string;                       // text
  title: string;                      // text
  page_type: 'MAIN' | 'RESOURCES' | 'SUPPORT' | 'LEGAL';
  nav_title: string | null;           // text|null
  content: Record<string, unknown>;   // jsonb
  meta_description: string | null;    // text|null
  og_image_url: string | null;        // text|null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at: string | null;        // timestamptz|null
  user_id: string | null;             // uuid|null
  sort_order: number;                 // integer
  created_at: string;                 // timestamptz
  updated_at: string;                 // timestamptz
}

/**
 * ------------------------------------------------------------------------------
 * 2) “Faq” (what lives in the `faqs` table) and its wrapper type.
 *
 * NOTE: Supabase returns “faq_pages” as an array of objects
 * where each object has `faqs: Faq[]` (because of the way many-to-many JSON comes back).
 * ------------------------------------------------------------------------------
 */
export interface Faq {
  id: string;                 // uuid
  question: string;           // text
  answer: string;             // text
  sort_order: number;         // integer
  featured: boolean;          // boolean
  faq_category_id: string;    // uuid
}

/** Wrapper shape Supabase actually returns: { faqs: Faq[] } */
export interface FaqPageJoin {
  faqs: Faq[];
}

/**
 * ------------------------------------------------------------------------------
 * 3) “UxProblem” and its wrapper. Supabase returns each row as { ux_problems: UxProblem[] }.
 * ------------------------------------------------------------------------------
 */
export interface UxProblemIcon {
  name: string;          // text
  icon_library: string;  // text
}

export interface UxProblem {
  id: string;                // uuid
  slug: string;              // text
  title: string;             // text
  description: string;       // text
  icons: UxProblemIcon[];    // array of { name, icon_library }
  featured: boolean;         // boolean
  sort_order: number;        // integer
}

/** Wrapper shape: { ux_problems: UxProblem[] } */
export interface UxProblemPageJoin {
  ux_problems: UxProblem[];
}

/**
 * ------------------------------------------------------------------------------
 * 4) “UxSolution” and its wrapper. Supabase returns each row as { ux_solutions: UxSolution[] }.
 * ------------------------------------------------------------------------------
 */
export interface UxSolutionIcon {
  name: string;          // text
  icon_library: string;  // text
}

export interface UxSolution {
  id: string;                // uuid
  slug: string;              // text
  title: string;             // text
  description: string;       // text
  icons: UxSolutionIcon[];   // array of { name, icon_library }
  featured: boolean;         // boolean
  sort_order: number;        // integer
}

/** Wrapper shape: { ux_solutions: UxSolution[] } */
export interface UxSolutionPageJoin {
  ux_solutions: UxSolution[];
}

/**
 * ------------------------------------------------------------------------------
 * 5) “PageWithRelations” exactly matches the JSON Supabase returns
 *    when you do:
 *      .select(`
 *        …,
 *        faq_pages ( faqs!inner( … ) ),
 *        ux_problem_pages ( ux_problems!inner( … ) ),
 *        ux_solution_pages ( ux_solutions!inner( … ) )
 *      `)
 * ------------------------------------------------------------------------------
 *
 * Notice: each join column is an array of those wrapper objects:
 *   faq_pages:   FaqPageJoin[]
 *   ux_problem_pages:   UxProblemPageJoin[]
 *   ux_solution_pages:   UxSolutionPageJoin[]
 */
export interface PageWithRelations extends PageRow {
  faq_pages: FaqPageJoin[];
  ux_problem_pages: UxProblemPageJoin[];
  ux_solution_pages: UxSolutionPageJoin[];
}

/**
 * ------------------------------------------------------------------------------
 * 6) Footer types: “FooterCategory” matches your page_type values,
 *    “FooterLink” is { title, href }, and “CategorizedFooterPages” groups them.
 * ------------------------------------------------------------------------------
 */
export type FooterCategory = 'MAIN' | 'RESOURCES' | 'SUPPORT' | 'LEGAL';

export interface FooterLink {
  title: string;   // nav_title
  href: string;    // e.g. "/about"
}

/** Groups links by each page_type */
export type CategorizedFooterPages = {
  [K in FooterCategory]: FooterLink[];
};

/**
 * ------------------------------------------------------------------------------
 * 7) “NavigablePageInfo” used by your legal pages (sorted by sort_order).
 *
 * We’ve added `page_type` here (which your legal components were trying to read),
 * so that `{ page.page_type }` doesn’t break.
 * ------------------------------------------------------------------------------
 */
export interface NavigablePageInfo {
  slug: string;
  title: string;
  nav_title: string | null;
  page_type: FooterCategory;
  sort_order: number;
}

/**
 * ------------------------------------------------------------------------------
 * 8) getPageBySlug(slug): fetches one fully-joined PageWithRelations.
 * ------------------------------------------------------------------------------
 */
export async function getPageBySlug(
  slug: string
): Promise<PageWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select(
      `
        id,
        slug,
        title,
        page_type,
        nav_title,
        content,
        meta_description,
        og_image_url,
        status,
        published_at,
        user_id,
        sort_order,
        created_at,
        updated_at,
        faq_pages (
          faqs!inner (
            id,
            question,
            answer,
            sort_order,
            featured,
            faq_category_id
          )
        ),
        ux_problem_pages (
          ux_problems!inner (
            id,
            slug,
            title,
            description,
            icons ( name, icon_library ),
            featured,
            sort_order
          )
        ),
        ux_solution_pages (
          ux_solutions!inner (
            id,
            slug,
            title,
            description,
            icons ( name, icon_library ),
            featured,
            sort_order
          )
        )
      `
    )
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Supabase error in getPageBySlug:', error);
    return null;
  }

  // `data` already matches PageWithRelations, because we declared it above.
  return data as PageWithRelations;
}

/**
 * ------------------------------------------------------------------------------
 * 9) getCategorizedFooterPages(): fetch every page’s (slug, nav_title, page_type),
 *    group them by page_type = FooterCategory. Returns an object with arrays.
 * ------------------------------------------------------------------------------
 */
export async function getCategorizedFooterPages(): Promise<CategorizedFooterPages> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('slug, nav_title, page_type');

  if (error || !data) {
    console.error('Supabase error in getCategorizedFooterPages:', error);
    return {
      MAIN: [],
      RESOURCES: [],
      SUPPORT: [],
      LEGAL: [],
    };
  }

  const categorized: CategorizedFooterPages = {
    MAIN: [],
    RESOURCES: [],
    SUPPORT: [],
    LEGAL: [],
  };

  data.forEach((row) => {
    const page = row as PageRow;
    if (!page.nav_title) return;
    if (
      page.page_type === 'MAIN' ||
      page.page_type === 'RESOURCES' ||
      page.page_type === 'SUPPORT' ||
      page.page_type === 'LEGAL'
    ) {
      categorized[page.page_type].push({
        title: page.nav_title,
        href: `/${page.slug}`,
      });
    }
  });

  return categorized;
}

/**
 * ------------------------------------------------------------------------------
 * 10) getPagesByType(pageType): fetch all PageRow[] with a given page_type.
 *     (Optional, in case you need it elsewhere.)
 * ------------------------------------------------------------------------------
 */
export async function getPagesByType(pageType: FooterCategory): Promise<PageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('page_type', pageType);

  if (error || !data) {
    console.error('Supabase error in getPagesByType:', error);
    return [];
  }

  return data as PageRow[];
}

/**
 * ------------------------------------------------------------------------------
 * 11) getNavigablePages(pageType = 'LEGAL'): returns an array of NavigablePageInfo
 *     (slug, title, nav_title, page_type, sort_order) sorted by sort_order.
 *
 *     We gave it a default argument of 'LEGAL' so that calling it with no args
 *     (e.g. `getNavigablePages()`) won’t cause “Expected 1 arguments, got 0.”
 * ------------------------------------------------------------------------------
 */
export async function getNavigablePages(
  pageType: FooterCategory = 'LEGAL'
): Promise<NavigablePageInfo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('slug, title, nav_title, page_type, sort_order')
    .eq('page_type', pageType)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Supabase error in getNavigablePages:', error);
    return [];
  }

  // Each row already has exactly { slug, title, nav_title, page_type, sort_order }:
  return data.map((row) => row as NavigablePageInfo);
}

/**
 * ------------------------------------------------------------------------------
 * 12) getPageContentBySlug(slug): returns `content` JSON for a given page.
 * ------------------------------------------------------------------------------
 */
export async function getPageContentBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pages')
    .select('content')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Supabase error in getPageContentBySlug:', error);
    return null;
  }

  // `data` is { content: Record<string, unknown> }
  return (data as { content: Record<string, unknown> }).content;
}
