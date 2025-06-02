// src/app/(resources)/blog/page.tsx
// - Added null checks for cmsContent before accessing its properties.
// - Corrected NextLink usage with UICard for blog post items.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, Image, Box } from '@chakra-ui/react';
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import { getAllPublishedPosts, type PostCardItem } from '@/src/lib/data/posts';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';

interface BlogPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

interface BlogPageProps {
  // searchParams?: { page?: string };
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
  } catch (e) {
    return dateString;
  }
}

export default async function BlogLandingPage({}: BlogPageProps) {
  const [pageCmsData, posts, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllPublishedPosts(),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === pageCmsData.slug);
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = navigablePages[currentPageIndex - 1];
        previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
      }
      if (currentPageIndex < navigablePages.length - 1) {
        const next = navigablePages[currentPageIndex + 1];
        nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
      }
    }
  }

  const cmsContent = pageCmsData?.content as BlogPageCmsContent | null; // Optional chaining here
  let introContent: React.ReactNode = null;

  // Check if cmsContent is not null before trying to access its properties
  if (cmsContent) {
    const parts = [];
    // Use optional chaining for hero and intro_text
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageCmsData?.title) {
        parts.push(<Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">{cmsContent.hero.headline}</Heading>);
    }
    if (cmsContent.intro_text) {
        parts.push(<Text key="intro-text" fontSize="lg" color="muted.foreground" maxW="2xl" textAlign="center" mx="auto" mb={10}>{cmsContent.intro_text}</Text>);
    }
    if (parts.length > 0) {
        introContent = <VStack spacing={4} alignItems="center" mt={4}>{parts}</VStack>;
    }
  }

  // Fallback if main page CMS content isn't found but posts are
  if (!pageCmsData && (!posts || posts.length === 0)) {
    return (
      <Layout>
        <Section id="blog-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Blog Not Available</Heading>
          <Text>We&apos;re sorry, but blog content could not be loaded at this time.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Section id={pageCmsData?.slug || SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageCmsData?.title || "Our Blog"}
        </Heading>
        {introContent}

        {posts && posts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {posts.map((post: PostCardItem) => (
              <NextLink key={post.id} href={`/blog/${post.slug}`} passHref>
                {/* Removed `as="a"` from UICard as NextLink provides the anchor. 
                    If UICard must be an anchor itself for some styling reason, 
                    ensure it properly handles forwarded href by NextLink.
                    For now, let NextLink wrap it.
                */}
                <UICard variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)', textDecoration: 'none', cursor:'pointer' }} transition="all 0.2s">
                  {post.featured_image_url && (
                    <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        borderTopRadius="md"
                        objectFit="cover"
                        h="200px"
                        w="full"
                    />
                  )}
                  <UICardHeader>
                    <UICardHeading size="lg" as="h3" noOfLines={2}>{post.title}</UICardHeading>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    {post.published_at && (
                      <Text fontSize="xs" color="muted.foreground" mb={2}>
                        {formatDate(post.published_at)}
                      </Text>
                    )}
                    <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                        {post.excerpt || "Continue reading..."}
                    </UICardText>
                  </UICardBody>
                  <UICardFooter>
                     {/* Removed as="span" from HeroCtaButton as it's not a valid prop and NextLink makes the card clickable */}
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
  const title = pageCmsData?.title || "Blog | Coriyon's Studio";
  const description = pageCmsData?.meta_description || "Read the latest articles and insights from Coriyon's Studio.";

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