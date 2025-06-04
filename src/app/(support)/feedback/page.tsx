// src/app/(support)/feedback/page.tsx
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, Box } from '@chakra-ui/react';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import FeedbackForm from '@/src/components/forms/feedback-form';

interface FeedbackPageCmsContent {
  hero?: { headline?: unknown };
  intro_text?: unknown;
  meta_description?: unknown;
  og_image_url?: unknown;
  slug?: unknown;
  title?: unknown;
  [key: string]: unknown;
}

const SLUG = 'feedback';

export default async function FeedbackPage() {
  const [pageCmsDataRaw, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages(),
  ]);

  const pageCmsData = pageCmsDataRaw ?? null;

  // Determine previous/next links
  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (
    pageCmsData &&
    typeof pageCmsData.slug === 'string'
  ) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === pageCmsData.slug
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

  const cmsContent = (pageCmsData?.content as FeedbackPageCmsContent | null) ?? null;

  // Ensure title is a string
  const pageTitle =
    typeof pageCmsData?.title === 'string'
      ? pageCmsData.title
      : 'Submit Your Feedback';

  // Ensure intro_text is a string, with fallback
  const introText =
    typeof cmsContent?.intro_text === 'string'
      ? cmsContent.intro_text
      : "We value your input! Please share your thoughts, suggestions, or any issues you've encountered. Your feedback helps us improve.";

  // Determine hero headline if provided and a string
  const heroHeadline =
    typeof cmsContent?.hero?.headline === 'string'
      ? cmsContent.hero.headline
      : null;

  // Determine section id as a string
  const sectionId =
    typeof pageCmsData?.slug === 'string'
      ? pageCmsData.slug
      : SLUG;

  return (
    <Layout>
      <Section id={sectionId} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <VStack spacing={8} alignItems="center" textAlign="center">
          <Heading as="h1" size="3xl">
            {pageTitle}
          </Heading>

          {heroHeadline && heroHeadline !== pageTitle && (
            <Heading as="h2" size="xl" mt={4} fontWeight="medium" color="muted.foreground">
              {heroHeadline}
            </Heading>
          )}

          <Text fontSize="lg" maxW="xl" color="muted.foreground">
            {introText}
          </Text>

          <Box pt={6} w="full" display="flex" justifyContent="center">
            <FeedbackForm />
          </Box>
        </VStack>
      </Section>

      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsDataRaw = await getPageContentBySlug(SLUG);
  const pageCmsData = pageCmsDataRaw ?? null;

  // Ensure title and description are strings with fallbacks
  const title =
    typeof pageCmsData?.title === 'string'
      ? pageCmsData.title
      : "Submit Feedback | Coriyon's Studio";
  const description =
    typeof pageCmsData?.meta_description === 'string'
      ? pageCmsData.meta_description
      : "Share your feedback to help us improve Coriyon's Studio services and website experience.";

  // Ensure og_image_url is a string before using it
  const ogImageUrl =
    typeof pageCmsData?.og_image_url === 'string'
      ? pageCmsData.og_image_url
      : null;

  // Build Open Graph images array with correct types
  const openGraphImages: Array<{ url: string | URL; alt?: string }> = [];
  if (ogImageUrl) {
    openGraphImages.push({ url: ogImageUrl });
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/feedback`,
      images: openGraphImages.length > 0 ? openGraphImages : undefined,
    },
  };
}
