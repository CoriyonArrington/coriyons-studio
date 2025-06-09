// FINAL, SELF-CONTAINED VERSION
// This version manually defines all necessary types to make the file
// self-sufficient and immune to external type-generation issues.

import { createServerClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core & Related Type Definitions ---

export interface Author {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface Category {
    id: string;
    name: string | null;
    slug: string | null;
}

// FIX: Replaced `any` with the safer `unknown` type.
export interface PostContentJson {
  [key: string]: unknown;
}

export interface PostCardItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author: Author | null;
  category: Category | null;
  published_at: string;
}

export interface PostDetail extends PostCardItem {
  content: PostContentJson | null;
}

// --- Self-Contained Row & Joined Types ---

// Manually define the shape of a row from the 'posts' table.
type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  content: unknown;
  published_at: string;
  author_id: string;
  category_id: string;
};

// Manually define shapes for joined tables.
type AuthorRow = { id: string; name: string | null; avatar_url: string | null; };
type CategoryRow = { id: string; name: string | null; slug: string | null; };

// The fully joined shape for the queries.
type PostWithDetails = PostRow & {
  authors: AuthorRow | null;
  categories: CategoryRow | null;
};

// --- Data Fetching Functions ---

export async function getRecentPosts(limit: number = 3): Promise<PostCardItem[]> {
    noStore();
    const supabase = await createServerClient();
    
    const response = await supabase
        .from('posts')
        .select('*, authors(*), categories(*)')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (response.error) {
        console.error('Error fetching recent posts:', response.error.message);
        return [];
    }

    const data = response.data as PostWithDetails[];

    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        featured_image_url: post.featured_image_url,
        author: post.authors,
        category: post.categories,
        published_at: post.published_at
    }));
}

export async function getAllPosts(): Promise<PostCardItem[]> {
  noStore();
  const supabase = await createServerClient();

  const response = await supabase
    .from('posts')
    .select('*, authors(*), categories(*)')
    .order('published_at', { ascending: false });

  if (response.error) {
    console.error('Error fetching all posts:', response.error.message);
    return [];
  }

  const data = response.data as PostWithDetails[];
  
  return data.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featured_image_url: post.featured_image_url,
    author: post.authors,
    category: post.categories,
    published_at: post.published_at
  }));
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
    noStore();
    const supabase = await createServerClient();

    const response = await supabase
      .from('posts')
      .select('*, authors(*), categories(*)')
      .eq('slug', slug)
      .single();

    if (response.error) {
      console.error(`Error fetching post by slug "${slug}":`, response.error.message);
      return null;
    }

    const typedData = response.data as PostWithDetails;

    return {
        id: typedData.id,
        slug: typedData.slug,
        title: typedData.title,
        excerpt: typedData.excerpt,
        featured_image_url: typedData.featured_image_url,
        author: typedData.authors,
        category: typedData.categories,
        published_at: typedData.published_at,
        content: typedData.content as PostContentJson | null,
    };
}