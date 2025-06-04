// src/app/(legal)/privacy-policy/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading } from '@/src/components/typography';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo
} from '@/src/lib/data/pages';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface LegalPageProps {
  params: {};
}

const SLUG = 'privacy-policy';

export default async function PrivacyPolicyPage({}: LegalPageProps) {
  // Cast the fetched data so TypeScript knows the fields are strings
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageData) {
    const currentIndex = navigablePages.findIndex(
      (p) => p.slug === pageData.slug
    );
    if (currentIndex > 0) {
      const prev = navigablePages[currentIndex - 1];
      previousPageLink = {
        slug: prev.slug,
        title: prev.title,
        categoryLabel: mapPageTypeToCategoryLabel(prev.page_type)
      };
    }
    if (currentIndex < navigablePages.length - 1) {
      const next = navigablePages[currentIndex + 1];
      nextPageLink = {
        slug: next.slug,
        title: next.title,
        categoryLabel: mapPageTypeToCategoryLabel(next.page_type)
      };
    }
  }

  // Narrow down content to a string before passing into ReactMarkdown
  const content = pageData?.content;

  return (
    <Layout>
      <Section
        id={pageData?.slug ?? SLUG}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
      >
        <Heading as="h1" size="3xl" mb={6}>
          {pageData?.title ?? 'Privacy Policy'}
        </Heading>

        {typeof content === 'string' && (
          <ReactMarkdown components={{}} remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </Section>

      <PrevNextNavigation
        previousPage={previousPageLink}
        nextPage={nextPageLink}
      />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const title = pageData?.title ?? "Privacy Policy | Coriyon's Studio";
  const description = pageData?.meta_description ?? undefined;
  const ogImageUrl = pageData?.og_image_url ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title: pageData?.title ?? undefined,
      description,
      url: `/${SLUG}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined
    }
  };
}
