// src/lib/data/posts.ts
// - Added getFeaturedPosts function for the homepage blog section.
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface PostCardItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
}

export interface PostContentJson {
  blocks?: Array<{ type: string; data: any; [key: string]: any }>; // For block-based content
  body?: string; // For markdown if stored directly
  markdownContent?: string; // Alternative for markdown
  [key: string]: any;
}

export interface PostDetail extends PostCardItem {
  content: PostContentJson | null;
  og_image_url?: string | null;
  author_id?: string | null;
}

export async function getAllPublishedPosts(
  limit: number = 10,
  offset: number = 0
): Promise<PostCardItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, featured_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error('Error fetching all published posts:', error.message);
    return [];
  }
  return data || [];
}

// New function to get featured posts for the homepage
export async function getFeaturedPosts(limit: number = 3): Promise<PostCardItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, featured_image_url, published_at')
    .eq('status', 'published')
    .eq('featured', true) // Assuming 'featured' column exists on 'posts' table
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured posts:', error.message);
    return [];
  }
  return data || [];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, content, featured_image_url, og_image_url, published_at, author_id')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) {
    console.error(`Error fetching post by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;
  return {
    ...data,
    content: data.content as PostContentJson | null,
  } as PostDetail;
}