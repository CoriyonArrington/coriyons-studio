// src/app/(resources)/blog/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, Image, Box, HStack, Tag as ChakraTag } from '@chakra-ui/react';
import {
  UICard,
  UICardHeader,
  UICardBody,
  UICardHeading,
  UICardText,
  UICardFooter,
} from '@/src/components/ui/card';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getAllPublishedPosts, type PostCardItem, type Tag } from '@/src/lib/data/posts';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import React from 'react';

interface BlogPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

const SLUG = 'blog';

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Date not available';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default async function BlogLandingPage() {
  const [pageCmsData, posts, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllPublishedPosts(),
    getNavigablePages(),
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === (pageCmsData.slug as string),
    );
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = navigablePages[currentPageIndex - 1];
        previousPageLink = {
          slug: prev.slug,
          title: prev.title,
          categoryLabel: mapPageTypeToCategoryLabel(prev.page_type),
        };
      }
      if (currentPageIndex < navigablePages.length - 1) {
        const next = navigablePages[currentPageIndex + 1];
        nextPageLink = {
          slug: next.slug,
          title: next.title,
          categoryLabel: mapPageTypeToCategoryLabel(next.page_type),
        };
      }
    }
  }

  const cmsContent = pageCmsData?.content as BlogPageCmsContent | null;
  let introContent: React.ReactNode = null;
  const pageTitle = (pageCmsData?.title as string) || 'Our Blog';

  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageTitle) {
      parts.push(
        <Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">
          {cmsContent.hero.headline}
        </Heading>,
      );
    }
    if (cmsContent.intro_text) {
      parts.push(
        <Text
          key="intro-text"
          fontSize="lg"
          color="muted.foreground"
          maxW="2xl"
          textAlign="center"
          mx="auto"
          mb={10}
        >
          {cmsContent.intro_text}
        </Text>,
      );
    }
    if (parts.length > 0) {
      introContent = (
        <VStack spacing={4} alignItems="center" mt={4}>
          {parts}
        </VStack>
      );
    }
  }

  if (!pageCmsData && (!posts || posts.length === 0)) {
    return (
      <Layout>
        <Section id="blog-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Blog Not Available
          </Heading>
          <Text>We&apos;re sorry, but blog content could not be loaded at this time.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Section
        id={(pageCmsData?.slug as string) || SLUG}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageTitle}
        </Heading>
        {introContent}

        {posts && posts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {posts.map((post: PostCardItem) => (
              <NextLink
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'flex', height: '100%' }}
              >
                <UICard
                  variant="outline"
                  h="full"
                  display="flex"
                  flexDirection="column"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  {post.featured_image_url && (
                    <Image
                      src={post.featured_image_url as string}
                      alt={post.title as string}
                      borderTopRadius="md"
                      objectFit="cover"
                      h="200px"
                      w="full"
                    />
                  )}
                  <UICardHeader>
                    <UICardHeading size="lg" as="h3" noOfLines={2}>
                      {post.title as string}
                    </UICardHeading>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    {post.published_at && (
                      <Text fontSize="xs" color="muted.foreground" mb={2}>
                        {formatDate(post.published_at)}
                      </Text>
                    )}
                    <UICardText color="muted.foreground" mb={3} noOfLines={3}>
                      {post.excerpt || 'Continue reading...'}
                    </UICardText>
                    {post.tags && post.tags.length > 0 && (
                      <Box>
                        <HStack spacing={2} wrap="wrap">
                          {post.tags.map((tag: Tag) => (
                            <ChakraTag key={tag.id} size="sm" variant="subtle" colorScheme="purple" mb={1}>
                              {tag.name}
                            </ChakraTag>
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </UICardBody>
                  <UICardFooter>
                    <HeroCtaButton href={`/blog/${post.slug}`} size="sm" variant="themedOutline" width="full">
                      Read More
                    </HeroCtaButton>
                  </UICardFooter>
                </UICard>
              </NextLink>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No blog posts available yet. Please check back soon!
          </Text>
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageContentBySlug(SLUG);
  const title = (pageCmsData?.title as string) || "Blog | Coriyon's Studio";
  const description =
    (pageCmsData?.meta_description as string) || "Read the latest articles and insights from Coriyon's Studio.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/blog`,
      images: pageCmsData?.og_image_url ? [{ url: pageCmsData.og_image_url as string }] : undefined,
    },
  };
}
