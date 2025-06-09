// ATTEMPT 1: Removing unused component imports from Chakra UI.

'use client';

import React from 'react';
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
// FIX: Removed unused 'VStack' and 'Box' imports.
import { SimpleGrid, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import PrevNextNavigation, { type NavLinkInfo } from '@/src/components/common/prev-next-navigation';
import type { PostCardItem } from '@/src/lib/data/posts';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface BlogViewProps {
  pageData: PageRow | null;
  posts: PostCardItem[];
  previousPageLink?: NavLinkInfo;
  nextPageLink?: NavLinkInfo;
}

export default function BlogView({ pageData, posts, previousPageLink, nextPageLink }: BlogViewProps) {
  const cmsContent = pageData?.content as { intro_text?: string } | null;
  const pageTitle = (pageData?.title) || 'Our Blog';

  return (
    <Layout>
      <Section id={pageData?.slug ?? 'blog'} py={{ base: 12, md: 20 }}>
        <Heading as="h1" size="3xl" mb={6} textAlign="center">{pageTitle}</Heading>
        {cmsContent?.intro_text && (
          <Text fontSize="lg" color="muted.foreground" maxW="2xl" textAlign="center" mx="auto" mb={10}>
            {cmsContent.intro_text}
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {posts.map((post) => (
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