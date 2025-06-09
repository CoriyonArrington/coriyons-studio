// FINAL, CORRECTED VERSION
// This version adds a type assertion to the Supabase query result to resolve the final unsafe assignment errors.

import { createClient } from '@/src/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import { getHomepageTestimonials, HomepageTestimonial } from './testimonials';
import { getAllServices, ServiceCardItem } from './services';
import { getRecentPosts, PostCardItem } from './posts';

// --- Core & Related Type Definitions ---

export interface PageMetadata {
  title: string;
  description: string | null;
}

export interface HomepageData {
  testimonials: HomepageTestimonial[];
  services: ServiceCardItem[];
  posts: PostCardItem[];
}

export interface PageContent {
    id: string;
    slug: string;
    title: string;
    content: unknown; // Using unknown for flexible JSON content
}

// A specific type for the data returned by the getPageContent query
type PageContentData = {
    id: string;
    slug: string;
    title: string;
    content: unknown;
};

// --- Data Fetching Functions ---

export async function getPageMetadata(slug: string): Promise<PageMetadata | null> {
    noStore();
    const supabase = createClient();

    const response = await supabase
        .from('pages')
        .select('title, description')
        .eq('slug', slug)
        .single();

    if (response.error) {
        console.error(`Error fetching page metadata for slug "${slug}":`, response.error.message);
        return null;
    }
    return response.data;
}

export async function getHomepageData(): Promise<HomepageData> {
    const [testimonials, allServices, posts]: [
        HomepageTestimonial[], 
        ServiceCardItem[], 
        PostCardItem[]
    ] = await Promise.all([
        getHomepageTestimonials(),
        getAllServices(),
        getRecentPosts(3),
    ]);
    
    return { 
        testimonials, 
        services: allServices.slice(0, 3), 
        posts 
    };
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
    noStore();
    const supabase = createClient();

    const response = await supabase
        .from('pages')
        .select('id, slug, title, content')
        .eq('slug', slug)
        .single();

    if (response.error) {
        if (response.error.code !== 'PGRST116') {
            console.error(`Error fetching page content for slug "${slug}":`, response.error.message);
        }
        return null;
    }
    
    // FIX: Assert the type of `response.data` to prevent it from being inferred as `any`.
    // This makes the assignments in the return object type-safe.
    const pageData = response.data as PageContentData;

    return {
        id: pageData.id,
        slug: pageData.slug,
        title: pageData.title,
        content: pageData.content,
    };
}