// src/lib/data/minimal_pages_schema.ts

/**
 * Exactly the columns we select from `pages`.
 */
export interface PageRow {
  id: string;
  slug: string;
  title: string;
  page_type: string;
  nav_title?: string | null;
  content: any;                // We'll cast this to our own `GenericPageContent` in pages.ts
  meta_description: string | null;
  og_image_url: string | null;
  status: string;
  sort_order?: number | null;
}

/**
 * Exactly the columns we select from `faqs`.
 */
export interface FaqRow {
  id: string;
  question: string;
  answer: any;                // JSON column in Supabase; pages.ts will cast to `FAQAnswerContent`
  sort_order: number | null;
  featured: boolean | null;
  faq_category_id?: string | null;
}

/**
 * Exactly the columns we select from `ux_problems`.
 */
export interface UxProblemRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icons: { name: string; icon_library: string | null }[] | null;
  featured: boolean | null;
  sort_order: number | null;
}

/**
 * Exactly the columns we select from `ux_solutions`.
 */
export interface UxSolutionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icons: { name: string; icon_library: string | null }[] | null;
  featured: boolean | null;
  sort_order: number | null;
}

/**
 * Supabase’s “join shape” for faq_pages → faqs.
 * When you do:
 *   .select(` ..., faq_pages ( faqs!inner ( id, question, ... ) ) `)
 * Supabase returns an array of objects whose key is “faqs” (either a single object or array).
 */
export interface FaqPageJoin {
  faqs: FaqRow[] | FaqRow | null;
}

/**
 * Supabase’s “join shape” for ux_problem_pages → ux_problems.
 */
export interface UxProblemPageJoin {
  ux_problems: UxProblemRow[] | UxProblemRow | null;
}

/**
 * Supabase’s “join shape” for ux_solution_pages → ux_solutions.
 */
export interface UxSolutionPageJoin {
  ux_solutions: UxSolutionRow[] | UxSolutionRow | null;
}
