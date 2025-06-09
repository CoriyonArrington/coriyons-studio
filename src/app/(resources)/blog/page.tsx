// src/app/(resources)/blog/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { SimpleGrid, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import { getPageDataBySlug, getNavigablePages } from '@/src/lib/data/pages';
import { getAllPublishedPosts, type PostCardItem } from '@/src/lib/data/posts';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const SLUG = 'blog';

interface BlogPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
}

export default async function BlogLandingPage() {
  const [pageCmsData, posts, navigablePages] = await Promise.all([
    getPageDataBySlug(SLUG), // Using the correctly named and typed function
    getAllPublishedPosts(),
    getNavigablePages(),
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageCmsData.slug);
    if (currentPageIndex > 0) {
      const prev = navigablePages[currentPageIndex - 1];
      previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
    }
    if (currentPageIndex < navigablePages.length - 1) {
      const next = navigablePages[currentPageIndex + 1];
      nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
    }
  }

  // The 'as' cast is still appropriate for the JSON 'content' field.
  const cmsContent = pageCmsData?.content as BlogPageCmsContent | null;
  const pageTitle = pageCmsData?.title || 'Our Blog'; // No 'as string' assertion needed

  return (
    <Layout>
      <Section id={pageCmsData?.slug || SLUG} py={{ base: 12, md: 20 }}>
        <Heading as="h1" size="3xl" mb={6} textAlign="center">{pageTitle}</Heading>
        {cmsContent?.intro_text && (
          <Text fontSize="lg" color="muted.foreground" maxW="2xl" textAlign="center" mx="auto" mb={10}>
            {cmsContent.intro_text}
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {posts.map((post: PostCardItem) => (
            <PostCard
              key={post.id}
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.excerpt}
              imageUrl={post.featured_image_url}
              tags={post.tags}
              tagColorScheme="purple"
              ctaText="Read More"
            />
          ))}
        </SimpleGrid>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData: PageRow | null = await getPageDataBySlug(SLUG);
  
  // No assertions are needed as pageCmsData is now correctly typed from the data function.
  const title = pageCmsData?.title || "Blog | Coriyon's Studio";
  const description =
    pageCmsData?.meta_description || "Read the latest articles and insights from Coriyon's Studio.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/blog`,
      images: pageCmsData?.og_image_url ? [{ url: pageCmsData.og_image_url }] : undefined,
    },
  };
}