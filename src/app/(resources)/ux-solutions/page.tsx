// src/app/(resources)/ux-solutions/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, /* Box, */ HStack } from '@chakra-ui/react'; // Box removed
import {
  UICard,
  UICardHeader,
  UICardBody,
  UICardHeading,
  UICardText,
  UICardFooter
} from '@/src/components/ui/card';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo
} from '@/src/lib/data/pages';
import { getAllUxSolutions, type UxSolutionCardItem } from '@/src/lib/data/ux_solutions';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface UxSolutionsPageCmsContent {
  title?: unknown;
  hero?: { headline?: unknown };
  intro_text?: unknown;
  meta_description?: unknown;
  og_image_url?: unknown;
  [key: string]: unknown;
}

const SLUG = 'ux-solutions';

const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
  if (!name) {
    return <LucideIcons.AlertTriangle {...props} />;
  }

  if (Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    const IconComponent = (LucideIcons as any)[name];
    if (
      IconComponent &&
      (typeof IconComponent === 'function' ||
        (typeof IconComponent === 'object' &&
          IconComponent.$$typeof === Symbol.for('react.forward_ref')))
    ) {
      return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `Lucide icon "${name}" not found or invalid in ux-solutions/page.tsx. Rendering fallback 'AlertTriangle'.`
    );
  }

  return <LucideIcons.AlertTriangle {...props} />;
};

export default async function UxSolutionsLandingPage() {
  const [pageCmsDataRaw, uxSolutions, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllUxSolutions(),
    getNavigablePages()
  ]);

  const pageCmsData = (pageCmsDataRaw ?? {}) as UxSolutionsPageCmsContent;

  // Calculate previous/next page links based on the known SLUG constant
  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === SLUG);
  if (currentPageIndex !== -1) {
    if (currentPageIndex > 0) {
      const prev = navigablePages[currentPageIndex - 1];
      previousPageLink = {
        slug: prev.slug,
        title: prev.title,
        categoryLabel: mapPageTypeToCategoryLabel(prev.page_type)
      };
    }
    if (currentPageIndex < navigablePages.length - 1) {
      const next = navigablePages[currentPageIndex + 1];
      nextPageLink = {
        slug: next.slug,
        title: next.title,
        categoryLabel: mapPageTypeToCategoryLabel(next.page_type)
      };
    }
  }

  // Extract CMS content safely
  const cmsContent = pageCmsData;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    const heroHeadline =
      cmsContent.hero && typeof cmsContent.hero.headline === 'string'
        ? cmsContent.hero.headline
        : null;
    const introText = typeof cmsContent.intro_text === 'string' ? cmsContent.intro_text : null;

    if (
      heroHeadline &&
      heroHeadline !== (typeof pageCmsData.title === 'string' ? pageCmsData.title : '')
    ) {
      parts.push(
        <Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">
          {heroHeadline}
        </Heading>
      );
    }

    if (introText) {
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
          {introText}
        </Text>
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

  const pageTitle =
    typeof pageCmsData.title === 'string' ? pageCmsData.title : 'Effective UX Solutions';

  // If neither CMS data nor any solutions are available, show the error state
  if (!pageCmsDataRaw && (!uxSolutions || uxSolutions.length === 0)) {
    return (
      <Layout>
        <Section id="ux-solutions-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            UX Solutions Not Available
          </Heading>
          <Text>We&apos;re sorry, but UX solution information could not be loaded at this time.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Section id={SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageTitle}
        </Heading>
        {introContent}

        {uxSolutions && uxSolutions.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {uxSolutions.map((solution: UxSolutionCardItem) => (
              <UICard
                key={solution.id}
                variant="outline"
                h="full"
                display="flex"
                flexDirection="column"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <UICardHeader>
                  <HStack spacing={3} alignItems="center">
                    {solution.icon &&
                      typeof solution.icon.name === 'string' &&
                      solution.icon.icon_library === 'lucide-react' && (
                        <DynamicLucideIcon
                          name={solution.icon.name}
                          size={24}
                          color="var(--chakra-colors-primary-500)"
                          strokeWidth={2.5}
                        />
                      )}
                    <UICardHeading size="lg" as="h3">
                      {solution.title}
                    </UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                    {typeof solution.description === 'string'
                      ? solution.description
                      : 'More details about this UX solution.'}
                  </UICardText>
                </UICardBody>
                <UICardFooter>
                  <HeroCtaButton
                    href={`/ux-solutions/${solution.slug}`}
                    size="sm"
                    variant="themedSolid"
                    width="full"
                  >
                    Explore Solution
                  </HeroCtaButton>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No UX solutions to display at the moment. Please check back soon!
          </Text>
        )}
      </Section>

      <PrevNextNavigation
        previousPage={previousPageLink}
        nextPage={nextPageLink}
        basePath="/resources"
      />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsDataRaw = await getPageContentBySlug(SLUG);
  const pageCmsData = (pageCmsDataRaw ?? {}) as UxSolutionsPageCmsContent;

  const titleText =
    typeof pageCmsData.title === 'string'
      ? pageCmsData.title
      : "Effective UX Solutions | Coriyon's Studio";

  const descriptionText =
    typeof pageCmsData.meta_description === 'string'
      ? pageCmsData.meta_description
      : "Discover effective UX solutions offered by Coriyon's Studio to address common user experience challenges and enhance your digital products.";

  const ogImageUrl =
    typeof pageCmsData.og_image_url === 'string'
      ? pageCmsData.og_image_url
      : null;

  const metadata: Metadata = {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: `/${SLUG}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined
    }
  };

  return metadata;
}
