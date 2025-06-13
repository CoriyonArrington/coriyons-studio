// src/lib/data/faqs.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/src/types/supabase';

// --- TYPE DEFINITIONS ---

export interface FAQAnswerBlock {
  id?: string;
  type: string;
  data: {
    text?: string;
    level?: number;
    style?: 'ordered' | 'unordered';
    items?: string[];
  };
}

export interface FAQAnswerContent {
  blocks: FAQAnswerBlock[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: FAQAnswerContent | null;
}

export interface FAQCategoryWithItems {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  faqs: FAQItem[];
}

// Internal type for the raw row returned from Supabase
type FaqCategoryWithFaqsRow = Database['public']['Tables']['faq_categories']['Row'] & {
  faqs: (Database['public']['Tables']['faqs']['Row'])[]
};

// --- DATA FETCHING FUNCTION ---

export async function getFAQsGroupedByCategory(): Promise<FAQCategoryWithItems[]> {
  noStore();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('faq_categories')
    .select(`
      *,
      faqs ( id, question, answer, sort_order )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { referencedTable: 'faqs', ascending: true });

  if (error) {
    console.error('Error fetching FAQs grouped by category:', error.message);
    return [];
  }

  const typedData = data as unknown as FaqCategoryWithFaqsRow[];
  
  // FIX: Perform a safe transformation to match the expected return type
  const processedData: FAQCategoryWithItems[] = typedData
    .filter(category => category.faqs.length > 0) // FIX: Removed redundant `category.faqs &&`
    .map(category => ({
      ...category,
      // FIX: Explicitly cast the `answer` property for each FAQ item
      faqs: category.faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer as FAQAnswerContent | null,
      })),
    }));

  return processedData;
}