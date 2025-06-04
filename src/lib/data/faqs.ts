// src/lib/data/faqs.ts
// - Fetches FAQ categories and their questions/answers.
// - Defines types for FAQ data, including the block-based answer structure.

import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface FAQAnswerBlock {
  type: string;
  data: { text?: string; [key: string]: any }; // Assuming 'text' is a common data key
  id?: string;
}

export interface FAQAnswerContent {
  blocks?: FAQAnswerBlock[];
  [key: string]: any;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: FAQAnswerContent | null;
  sort_order: number | null;
  featured?: boolean | null;
}

export interface FAQCategoryWithItems {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  faqs: FAQItem[];
}

export async function getFAQsGroupedByCategory(): Promise<FAQCategoryWithItems[]> {
  noStore();
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('faq_categories')
    .select(`
      id,
      name,
      slug,
      description,
      sort_order,
      faqs (
        id,
        question,
        answer,
        sort_order,
        featured
      )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { foreignTable: 'faqs', ascending: true });

  if (error) {
    console.error('Error fetching FAQs grouped by category:', error.message);
    return [];
  }

  if (!categories) {
    return [];
  }

  return categories.map(category => ({
    ...category,
    faqs: category.faqs.map((faq: any) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer as FAQAnswerContent | null,
      sort_order: faq.sort_order,
      featured: faq.featured,
    })),
  }));
}