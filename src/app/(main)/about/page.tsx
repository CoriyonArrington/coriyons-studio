// src/app/(main)/about/page.tsx
// - Removed local mapPageTypeToCategoryLabel function.
// - Imported mapPageTypeToCategoryLabel from @/src/lib/utils.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, Box } from '@chakra-ui/react';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils'; // Import centralized helper
import type { Metadata } from 'next';

interface AboutPageContent {
  hero?: { headline?: string };
  bio_section?: { title?: string; text?: string };
  philosophy_section?: { title?: string; text?: string };
  [key: string]: any;
}

interface AboutPageProps {
  params: {};
}

const SLUG = 'about';

// Local mapPageTypeToCategoryLabel function REMOVED

export default async function AboutPage({ params }: AboutPageProps) {
  const [pageData, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageData) {
    const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === pageData.slug);
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = navigablePages[currentPageIndex - 1];
        previousPageLink = {
          slug: prev.slug,
          title: prev.title,
          categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) // Uses imported helper
        };
      }
      if (currentPageIndex < navigablePages.length - 1) {
        const next = navigablePages[currentPageIndex + 1];
        nextPageLink = {
          slug: next.slug,
          title: next.title,
          categoryLabel: mapPageTypeToCategoryLabel(next.page_type) // Uses imported helper
        };
      }
    }
  }

  if (!pageData) {
    return (
      <Layout>
        <Section id="error-about" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Not Found</Heading>
          <Text>We&apos;re sorry, but the content for the About page could not be loaded or found.</Text>
        </Section>
         <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  const content = pageData.content as AboutPageContent | null;
  let descriptiveContent: React.ReactNode = <Text mt={4}>Learn more about us soon!</Text>;

  if (content) {
    const parts = [];
    if (content.hero?.headline && content.hero.headline !== pageData.title) {
        parts.push(<Heading key="hero-headline" as="h2" size="xl" mt={4}>{content.hero.headline}</Heading>);
    }
    if (content.bio_section) {
        parts.push(
            <Box key="bio-section" mt={4}>
                <Heading as="h3" size="lg" mb={2}>{content.bio_section.title}</Heading>
                <Text>{content.bio_section.text}</Text>
            </Box>
        );
    }
    if (content.philosophy_section) {
        parts.push(
            <Box key="philosophy-section" mt={4}>
                <Heading as="h3" size="lg" mb={2}>{content.philosophy_section.title}</Heading>
                <Text>{content.philosophy_section.text}</Text>
            </Box>
        );
    }
    if (parts.length > 0) {
        descriptiveContent = <VStack spacing={6} alignItems="flex-start" mt={4}>{parts}</VStack>;
    } else if (content && Object.keys(content).length === 0) {
        descriptiveContent = <Text mt={4}>Content for this page is being updated.</Text>;
    }
  }

  return (
    <Layout>
      <Section id={pageData.slug} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={8} textAlign="center">
          {pageData.title}
        </Heading>
        {descriptiveContent}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) { return { title: 'About Page Not Found | Coriyon’s Studio' }; }
  return {
    title: pageData.title,
    description: pageData.meta_description,
    openGraph: {
      title: pageData.title,
      description: pageData.meta_description || undefined,
      url: `/${SLUG}`,
      images: pageData.og_image_url ? [{ url: pageData.og_image_url }] : undefined,
    },
  };
}