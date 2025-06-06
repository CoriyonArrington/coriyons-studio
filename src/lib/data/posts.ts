// src/lib/data/posts.ts
// - Added Tag interface (consistent with projects.ts).
// - Updated PostCardItem and PostDetail interfaces to include tags.
// - Modified getAllPublishedPosts, getFeaturedPosts, and getPostBySlug to fetch associated tags.

import { createClient } from '@/src/utils/supabase/client';
import { unstable_noStore as noStore } from 'next/cache';

// Basic Tag interface (consistent with projects.ts)
// Consider moving to a shared types file if used more broadly.
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostCardItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  tags?: Tag[]; // Added tags
}

export interface PostContentJson {
  blocks?: Array<{ type: string; data: any; [key: string]: any }>;
  body?: string;
  markdownContent?: string;
  [key: string]: any;
}

export interface PostDetail extends PostCardItem { // PostDetail now inherently includes tags via PostCardItem
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
    .select(`
      id,
      slug,
      title,
      excerpt,
      featured_image_url,
      published_at,
      post_tags (
        tags (id, name, slug)
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching all published posts:', error.message);
    return [];
  }
  return data?.map(post => ({
    ...post,
    tags: post.post_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
  })) || [];
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostCardItem[]> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      slug,
      title,
      excerpt,
      featured_image_url,
      published_at,
      post_tags (
        tags (id, name, slug)
      )
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured posts:', error.message);
    return [];
  }
  return data?.map(post => ({
    ...post,
    tags: post.post_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
  })) || [];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      slug,
      title,
      excerpt,
      content,
      featured_image_url,
      og_image_url,
      published_at,
      author_id,
      post_tags (
        tags (id, name, slug)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
        console.warn(`Post with slug "${slug}" not found.`);
        return null;
    }
    console.error(`Error fetching post by slug "${slug}":`, error.message);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    content: data.content as PostContentJson | null,
    tags: data.post_tags.map((pt: any) => pt.tags).filter(Boolean) as Tag[],
  } as PostDetail;
}