// FINAL VERSION
import type { Json } from '@/src/types/supabase';

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  page_type: string;
  nav_title?: string | null;
  content: Json | null;
  meta_description: string | null;
  og_image_url: string | null;
  status: string;
  sort_order?: number | null;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: Json;
  sort_order: number | null;
  featured: boolean | null;
  faq_category_id?: string | null;
}

export interface UxProblemRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icons: { name: string; icon_library: string | null }[] | null;
  featured: boolean | null;
  sort_order: number | null;
}

export interface UxSolutionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icons: { name: string; icon_library: string | null }[] | null;
  featured: boolean | null;
  sort_order: number | null;
}

export interface FaqPageJoin {
  faqs: FaqRow[] | FaqRow | null;
}

export interface UxProblemPageJoin {
  ux_problems: UxProblemRow[] | UxProblemRow | null;
}

export interface UxSolutionPageJoin {
  ux_solutions: UxSolutionRow[] | UxSolutionRow | null;
}