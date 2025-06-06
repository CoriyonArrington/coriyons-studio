// ATTEMPT #17: RESTORE PUBLIC DATA FETCHING
// Change: Switched all data-fetching functions in this file to use the new 'createPublicServerClient'.
// This makes an anonymous request to fetch public page data, bypassing the RLS issue for logged-in users.

import { createPublicServerClient } from "@/src/utils/supabase/server";

// ... (All of your interfaces like PageRow, Faq, etc. remain unchanged here) ...

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  page_type: 'MAIN' | 'RESOURCES' | 'SUPPORT' | 'LEGAL';
  nav_title: string | null;
  content: Record<string, unknown>;
  meta_description: string | null;
  og_image_url: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at: string | null;
  user_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  featured: boolean;
  faq_category_id: string;
}
export interface FaqPageJoin {
  faqs: Faq[];
}
export interface UxProblemIcon {
  name: string;
  icon_library: string;
}
export interface UxProblem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icons: UxProblemIcon[];
  featured: boolean;
  sort_order: number;
}
export interface UxProblemPageJoin {
  ux_problems: UxProblem[];
}
export interface UxSolutionIcon {
  name: string;
  icon_library: string;
}
export interface UxSolution {
  id: string;
  slug: string;
  title: string;
  description: string;
  icons: UxSolutionIcon[];
  featured: boolean;
  sort_order: number;
}
export interface UxSolutionPageJoin {
  ux_solutions: UxSolution[];
}
export interface PageWithRelations extends PageRow {
  faq_pages: FaqPageJoin[];
  ux_problem_pages: UxProblemPageJoin[];
  ux_solution_pages: UxSolutionPageJoin[];
}
export type FooterCategory = 'MAIN' | 'RESOURCES' | 'SUPPORT' | 'LEGAL';
export interface FooterLink {
  title: string;
  href: string;
}
export type CategorizedFooterPages = {
  [K in FooterCategory]: FooterLink[];
};
export interface NavigablePageInfo {
  slug: string;
  title: string;
  nav_title: string | null;
  page_type: FooterCategory;
  sort_order: number;
}


export async function getPageBySlug(
  slug: string
): Promise<PageWithRelations | null> {
  const supabase = createPublicServerClient(); // <-- Use the public client
  const { data, error } = await supabase
    .from("pages")
    .select( `*, faq_pages(*, faqs!inner(*)), ux_problem_pages(*, ux_problems!inner(*)), ux_solution_pages(*, ux_solutions!inner(*))` )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase error in getPageBySlug:", error);
    return null;
  }
  return data as PageWithRelations;
}

export async function getCategorizedFooterPages(): Promise<CategorizedFooterPages> {
  const supabase = createPublicServerClient(); // <-- Use the public client
  const { data, error } = await supabase
    .from("pages")
    .select("slug, nav_title, page_type");

  if (error || !data) {
    console.error("Supabase error in getCategorizedFooterPages:", error);
    return { MAIN: [], RESOURCES: [], SUPPORT: [], LEGAL: [] };
  }

  const categorized: CategorizedFooterPages = { MAIN: [], RESOURCES: [], SUPPORT: [], LEGAL: [] };
  data.forEach((row) => {
    const page = row as PageRow;
    if (page.nav_title && categorized[page.page_type as FooterCategory]) {
      categorized[page.page_type as FooterCategory].push({
        title: page.nav_title,
        href: `/${page.slug}`,
      });
    }
  });
  return categorized;
}


export async function getPagesByType(
  pageType: FooterCategory
): Promise<PageRow[]> {
  const supabase = createPublicServerClient(); // <-- Use the public client
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("page_type", pageType);

  if (error) {
    console.error("Supabase error in getPagesByType:", error);
    return [];
  }
  return data as PageRow[];
}


export async function getNavigablePages(
  pageType: FooterCategory = "LEGAL"
): Promise<NavigablePageInfo[]> {
  const supabase = createPublicServerClient(); // <-- Use the public client
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, nav_title, page_type, sort_order")
    .eq("page_type", pageType)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase error in getNavigablePages:", error);
    return [];
  }
  return data.map((row) => row as NavigablePageInfo);
}


export async function getPageContentBySlug(
  slug: string
): Promise<Record<string, unknown> | null> {
  const supabase = createPublicServerClient(); // <-- Use the public client
  const { data, error } = await supabase
    .from("pages")
    .select("content")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase error in getPageContentBySlug:", error);
    return null;
  }
  return (data as { content: Record<string, unknown> }).content;
}