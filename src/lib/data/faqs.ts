import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// A single block of content within an answer
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

// The structure of the 'answer' JSONB field
export interface FAQAnswerContent {
  blocks: FAQAnswerBlock[];
}

// A single FAQ item
export interface FAQItem {
  id: string;
  question: string;
  answer: FAQAnswerContent | null;
}

// A category containing its associated FAQ items
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
  const supabase = createClient();

  const { data, error } = await supabase
    .from('faq_categories')
    .select(`
      *,
      faqs ( * )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { foreignTable: 'faqs', ascending: true });

  if (error) {
    console.error('Error fetching FAQs grouped by category:', error.message);
    return [];
  }

  // Filter out any categories that might not have FAQs associated with them
  return (data as any[]).filter(category => category.faqs && category.faqs.length > 0) as FAQCategoryWithItems[];
}