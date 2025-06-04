// src/app/(resources)/ux-problems/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, HStack } from '@chakra-ui/react';
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
import { getAllUxProblems, type UxProblemCardItem } from '@/src/lib/data/ux_problems';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface UxProblemsPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

const SLUG = 'ux-problems';

const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
  if (!name) {
    return <LucideIcons.AlertTriangle {...props} />;
  }
  const IconComponent = (LucideIcons as any)[name];
  if (
    IconComponent &&
    (typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' && IconComponent.$$typeof === Symbol.for('react.forward_ref')))
  ) {
    return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `Lucide icon "${name}" not found or invalid in ux-problems/page.tsx. Rendering fallback 'AlertTriangle'.`,
    );
  }
  return <LucideIcons.AlertTriangle {...props} />;
};

export default async function UxProblemsLandingPage() {
  // Cast to ensure TS knows slug is string
  const pageCmsData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const uxProblems = (await getAllUxProblems()) as UxProblemCardItem[];
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

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

  const cmsContent = (pageCmsData?.content as unknown) as UxProblemsPageCmsContent | null;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (
      cmsContent.hero?.headline &&
      cmsContent.hero.headline !== (pageCmsData?.title as string)
    ) {
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

  const pageTitle = (pageCmsData?.title as string) || 'Common UX Problems';

  if (!pageCmsData && (!uxProblems || uxProblems.length === 0)) {
    return (
      <Layout>
        <Section id="ux-problems-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            UX Problems Not Available
          </Heading>
          <Text>
            We&apos;re sorry, but UX problem information could not be loaded at this time.
          </Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
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

        {uxProblems && uxProblems.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {uxProblems.map((problem: UxProblemCardItem) => (
              <UICard
                key={problem.id}
                variant="outline"
                h="full"
                display="flex"
                flexDirection="column"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <UICardHeader>
                  <HStack spacing={3} alignItems="center">
                    {problem.icon && problem.icon.name && (
                      <DynamicLucideIcon
                        name={
                          problem.icon.icon_library === 'lucide-react'
                            ? problem.icon.name
                            : undefined
                        }
                        size={24}
                        color="var(--chakra-colors-primary-500)"
                        strokeWidth={2.5}
                      />
                    )}
                    <UICardHeading size="lg" as="h3">
                      {problem.title as string}
                    </UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                    {problem.description as string || 'More details about this UX problem.'}
                  </UICardText>
                </UICardBody>
                <UICardFooter>
                  <HeroCtaButton
                    href={`/ux-problems/${problem.slug as string}`}
                    size="sm"
                    variant="themedSolid"
                    width="full"
                  >
                    Learn More
                  </HeroCtaButton>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No UX problems to display at the moment. Please check back soon!
          </Text>
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageContentBySlug(SLUG);
  const title = (pageCmsData?.title as string) || "Common UX Problems | Coriyon's Studio";
  const description =
    (pageCmsData?.meta_description as string) ||
    "Explore common user experience problems and learn how Coriyon's Studio can help identify and solve them.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageCmsData?.og_image_url ? [{ url: pageCmsData.og_image_url as string }] : undefined,
    },
  };
}
