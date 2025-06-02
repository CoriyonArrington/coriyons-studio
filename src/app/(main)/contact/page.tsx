// src/app/(main)/contact/page.tsx
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

interface ContactPageContent {
  hero?: { headline?: string };
  form_intro?: string;
  contact_details?: { email?: string; phone?: string };
  [key: string]: any;
}

interface ContactPageProps {
  params: {};
}

const SLUG = 'contact';

// Local mapPageTypeToCategoryLabel function REMOVED

export default async function ContactPage({ params }: ContactPageProps) {
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
        <Section id="error-contact" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Not Found</Heading>
          <Text>We&apos;re sorry, but the content for the Contact page could not be loaded or found.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  const content = pageData.content as ContactPageContent | null;
  let descriptiveContent: React.ReactNode = <Text mt={4}>Contact information will be available soon.</Text>;

  if (content) {
    const parts = [];
    if (content.hero?.headline && content.hero.headline !== pageData.title) {
        parts.push(<Heading key="hero-headline" as="h2" size="xl" mt={4}>{content.hero.headline}</Heading>);
    }
    if (content.form_intro) {
        parts.push(<Text key="form-intro" mt={4}>{content.form_intro}</Text>);
    }
    if (content.contact_details) {
        parts.push(
            <Box key="contact-details" mt={4}>
                <Heading as="h3" size="md" mb={2}>Contact Details:</Heading>
                {content.contact_details.email && <Text>Email: {content.contact_details.email}</Text>}
                {content.contact_details.phone && <Text>Phone: {content.contact_details.phone}</Text>}
            </Box>
        );
    }
    if (parts.length > 0) {
        descriptiveContent = <VStack spacing={4} alignItems="flex-start" mt={4}>{parts}</VStack>;
    } else if (content && Object.keys(content).length === 0) {
        descriptiveContent = <Text mt={4}>Please reach out to us via the main channels.</Text>;
    }
  }

  return (
    <Layout>
      <Section id={pageData.slug} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={8} textAlign="center">
          {pageData.title}
        </Heading>
        {descriptiveContent}
        {/* TODO: Consider adding a Contact Form component here */}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) { return { title: 'Contact Page Not Found | Coriyon’s Studio' }; }
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