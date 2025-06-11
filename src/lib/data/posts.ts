// src/lib/data/posts.ts
import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// --- TYPE DEFINITIONS ---
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostContentJson {
  blocks: Array<{
    id?: string;
    type: string;
    data: unknown;
  }>;
}

export interface PostCardItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  tags: Tag[];
}

export interface PostDetail extends PostCardItem {
  content: PostContentJson | null;
  og_image_url: string | null;
  author_id: string | null;
}

// --- Internal Types ---
type RawTag = { id: string; name: string; slug: string; } | null;

type JoinTableRowWithTags = {
  tags: RawTag[];
};

type RawPostShared = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  post_tags: JoinTableRowWithTags[];
};

type RawPostWithTags = RawPostShared & {
  og_image_url: string | null;
  content: unknown;
  author_id: string | null;
};

type RawPostCardData = RawPostShared;

// --- HELPER FUNCTION ---
function processRawPost(post: RawPostCardData | RawPostWithTags): PostCardItem {
    const tags = post.post_tags
        .flatMap(pt => pt.tags)
        // FIX: The `t.slug !== null` check is redundant after `t !== null` is evaluated.
        .filter((t): t is Tag => t !== null);

    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        featured_image_url: post.featured_image_url,
        published_at: post.published_at,
        tags: tags,
    };
}

// --- DATA FETCHING FUNCTIONS ---
export async function getAllPublishedPosts(limit?: number): Promise<PostCardItem[]> {
    noStore();
    const supabase = createClient();
    let query = supabase
        .from('posts')
        .select(`id, slug, title, excerpt, featured_image_url, published_at, post_tags(tags(id, name, slug))`)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching published posts:', error.message);
        return [];
    }
    return (data as unknown as RawPostCardData[]).map(processRawPost);
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostCardItem[]> {
    noStore();
    const supabase = createClient();
    const { data, error } = await supabase
        .from('posts')
        .select(`id, slug, title, excerpt, featured_image_url, published_at, post_tags(tags(id, name, slug))`)
        .eq('status', 'published').eq('featured', true)
        .order('published_at', { ascending: false }).limit(limit);

    if (error) {
        console.error('Error fetching featured posts:', error.message);
        return [];
    }
    return (data as unknown as RawPostCardData[]).map(processRawPost);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
    noStore();
    const supabase = createClient();
    
    const response: PostgrestSingleResponse<unknown> = await supabase
      .from('posts')
      .select(`*, post_tags(tags(id, name, slug))`)
      .eq('slug', slug).eq('status', 'published').single();

    const { data, error } = response;

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`Error fetching post by slug "${slug}":`, error.message);
      }
      return null;
    }
    
    const typedPost = data as RawPostWithTags;
    const processedPost = processRawPost(typedPost);

    return {
        ...processedPost,
        content: typedPost.content as PostContentJson | null,
        og_image_url: typedPost.og_image_url,
        author_id: typedPost.author_id,
    };
}