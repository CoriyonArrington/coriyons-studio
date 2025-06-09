// src/app/(resources)/ux-solutions/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  VStack,
  SimpleGrid,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  CardFooter,
} from '@chakra-ui/react';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
  getPageDataBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getAllUxSolutions, type UxSolutionCardItem } from '@/src/lib/data/ux_solutions';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface UxSolutionsPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: unknown;
}

const SLUG = 'ux-solutions';

const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
  if (name && Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    // This is a controlled escape hatch. The lucide-react library's types do not
    // support this dynamic lookup cleanly. We use 'any' and disable the related
    // ESLint rules for this single operation to resolve all type and lint errors.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const IconComponent = (LucideIcons as any)[name];
    if (typeof IconComponent === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return React.createElement(IconComponent, props);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`Lucide icon "${name ?? '??'}" not found or invalid. Rendering fallback 'CheckCircle'.`);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const FallbackIcon = (LucideIcons as any)['CheckCircle'];
  if (typeof FallbackIcon === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return React.createElement(FallbackIcon, props);
  }

  return null;
};

export default async function UxSolutionsLandingPage() {
  const [pageCmsData, uxSolutions, navigablePages] = await Promise.all([
    getPageDataBySlug(SLUG),
    getAllUxSolutions(),
    getNavigablePages(),
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === pageCmsData.slug,
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

  const cmsContent = pageCmsData?.content as unknown as UxSolutionsPageCmsContent | null;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageCmsData?.title) {
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

  const pageTitle = pageCmsData?.title || 'Key UX Solutions';

  if (!pageCmsData && uxSolutions.length === 0) {
    return (
      <Layout>
        <Section id="ux-solutions-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            UX Solutions Not Available
          </Heading>
          <Text>
            We&apos;re sorry, but UX solution information could not be loaded at this time.
          </Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
      </Layout>
    );
  }

  return (
    <Layout>
      <Section
        id={pageCmsData?.slug || SLUG}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageTitle}
        </Heading>
        {introContent}

        {uxSolutions.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {uxSolutions.map((solution: UxSolutionCardItem) => (
              <Card
                key={solution.id}
                variant="outline"
                h="full"
                display="flex"
                flexDirection="column"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <HStack spacing={3} alignItems="center">
                    {solution.icon?.name && (
                      <DynamicLucideIcon
                        name={solution.icon.name}
                        size={24}
                        color="var(--chakra-colors-green-500)"
                        strokeWidth={2.5}
                      />
                    )}
                    <Heading size="lg" as="h3">
                      {solution.title}
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody flexGrow={1}>
                  <Text color="muted.foreground" mb={4} noOfLines={4}>
                    {solution.description || 'More details about this UX solution.'}
                  </Text>
                </CardBody>
                <CardFooter>
                  <HeroCtaButton
                    href={`/ux-solutions/${solution.slug}`}
                    size="sm"
                    variant="solid"
                    width="full"
                  >
                    Explore Solution
                  </HeroCtaButton>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No UX solutions to display at the moment. Please check back soon!
          </Text>
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageDataBySlug(SLUG);
  const title = pageCmsData?.title || "Key UX Solutions | Coriyon's Studio";
  const description =
    pageCmsData?.meta_description ||
    "Explore key user experience solutions and learn how Coriyon's Studio can help implement them.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageCmsData?.og_image_url ? [{ url: pageCmsData.og_image_url }] : undefined,
    },
  };
}