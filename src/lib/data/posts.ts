import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// --- Core & Related Type Definitions ---

export interface Tag {
  id: string;
  name: string;
  slug: string; // Made slug required to match database query
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
  published_at: string;
  tags: Tag[];
}

export interface PostDetail extends PostCardItem {
  content: PostContentJson | null;
  og_image_url: string | null;
  author_id: string | null;
}

// --- Self-Contained Row & Joined Types ---

type RawTag = {
    id: string;
    name: string;
    slug: string;
} | null;

type PostWithTags = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  og_image_url: string | null;
  published_at: string;
  content: unknown;
  author_id: string | null;
  post_tags: {
    tags: RawTag;
  }[];
};

function processRawPosts(rawPosts: PostWithTags[]): PostDetail[] {
    if (!rawPosts) return [];
    return rawPosts.map(post => {
        const tags = post.post_tags
            .map(pt => pt.tags)
            .filter((t): t is Tag => t !== null); // This type guard correctly filters out nulls

        return {
            ...post,
            content: post.content as PostContentJson | null,
            tags: tags,
        };
    });
}


// --- Data Fetching Functions ---

export async function getAllPublishedPosts(limit?: number): Promise<PostCardItem[]> {
    noStore();
    const supabase = createClient();
    
    let query = supabase
        .from('posts')
        .select(`
            id, slug, title, excerpt, featured_image_url, published_at,
            post_tags ( tags ( id, name, slug ) )
        `)
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

    return processRawPosts(data as unknown as PostWithTags[]);
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostCardItem[]> {
    noStore();
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, slug, title, excerpt, featured_image_url, published_at,
            post_tags ( tags ( id, name, slug ) )
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured posts:', error.message);
        return [];
    }

    return processRawPosts(data as unknown as PostWithTags[]);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
    noStore();
    const supabase = createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_tags ( tags ( id, name, slug ) )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`Error fetching post by slug "${slug}":`, error.message);
      }
      return null;
    }
    
    const processedPosts = processRawPosts([data as unknown as PostWithTags]);
    return processedPosts[0] || null;
}