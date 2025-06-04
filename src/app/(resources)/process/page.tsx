// src/app/(resources)/process/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
  VStack,
  SimpleGrid,
  Box,
  HStack,
} from '@chakra-ui/react';
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
import { getAllProcessSteps, type ProcessStepItem } from '@/src/lib/data/process';
import type { UxProblemCardItem } from '@/src/lib/data/ux_problems';
import type { UxSolutionCardItem } from '@/src/lib/data/ux_solutions';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface ProcessPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedUxProblems?: UxProblemCardItem[];
  relatedUxSolutions?: UxSolutionCardItem[];
  [key: string]: any;
}

interface ProcessPageProps {}

const SLUG = 'process';

// Renders a Lucide icon by name, or fallback HelpCircle if not found
const DynamicLucideIcon: React.FC<{ name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>> = ({ name, ...props }) => {
  if (!name) {
    return <LucideIcons.HelpCircle {...props} />;
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
    console.warn(`Lucide icon "${name}" not found on Process page. Rendering fallback 'HelpCircle'.`);
  }
  return <LucideIcons.HelpCircle {...props} />;
};

export default async function ProcessLandingPage({}: ProcessPageProps) {
  // Cast so TS knows these fields are of expected types
  const pageCmsData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const processSteps = (await getAllProcessSteps()) as ProcessStepItem[];
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

  const cmsContent = (pageCmsData?.content as unknown) as ProcessPageCmsContent | undefined;
  const relatedUxProblems = cmsContent?.relatedUxProblems;
  const relatedUxSolutions = cmsContent?.relatedUxSolutions;

  let introContent: React.ReactNode = null;
  const pageTitle = (pageCmsData?.title as string) || 'Our Design Process';

  if (cmsContent?.intro_text) {
    introContent = (
      <Text fontSize="lg" color="muted.foreground" textAlign="center" mb={10} whiteSpace="pre-line">
        {cmsContent.intro_text}
      </Text>
    );
  } else if (pageCmsData && !cmsContent?.intro_text) {
    introContent = (
      <Text fontSize="lg" color="muted.foreground" textAlign="center" mb={10}>
        Explore the steps involved in our design and development journey.
      </Text>
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
        <VStack spacing={10} alignItems="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={cmsContent?.hero?.headline ? 2 : 6}>
              {cmsContent?.hero?.headline || pageTitle}
            </Heading>
            {introContent}
          </Box>

          {processSteps.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} w="full">
              {processSteps.map((step: ProcessStepItem) => (
                <NextLink
                  key={step.id}
                  href={`/process/${step.slug}`}
                  style={{ textDecoration: 'none', display: 'flex', height: '100%' }}
                  passHref
                >
                  <UICard
                    variant="outline"
                    h="full"
                    display="flex"
                    flexDirection="column"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)', textDecoration: 'none' }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    <UICardHeader>
                      <HStack spacing={3} alignItems="center">
                        {step.icon && step.icon.name && (
                          <DynamicLucideIcon
                            name={step.icon.icon_library === 'lucide-react' ? step.icon.name : undefined}
                            size={24}
                            color="var(--chakra-colors-primary-500)"
                            strokeWidth={2.5}
                          />
                        )}
                        <UICardHeading size="lg" as="h3">
                          {step.title}
                        </UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody flexGrow={1}>
                      <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                        {step.description || 'Learn more about this step.'}
                      </UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <Text fontSize="sm" color="blue.500" fontWeight="medium" as="span">
                        Learn More &rarr;
                      </Text>
                    </UICardFooter>
                  </UICard>
                </NextLink>
              ))}
            </SimpleGrid>
          ) : (
            pageCmsData ? (
              <Text textAlign="center" color="muted.foreground" mt={8}>
                Our process steps will be detailed here soon.
              </Text>
            ) : null
          )}

          {relatedUxProblems && relatedUxProblems.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border" w="full">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                UX Challenges Our Process Addresses
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="container.lg" mx="auto">
                {relatedUxProblems.map((problem: UxProblemCardItem) => (
                  <UICard key={problem.id} variant="outlineFilled" h="full">
                    <UICardHeader>
                      <HStack spacing={3}>
                        {problem.icon && (
                          <DynamicLucideIcon
                            name={problem.icon.name}
                            size={22}
                            color="var(--chakra-colors-orange-500)"
                          />
                        )}
                        <UICardHeading size="md" as="h3">
                          {problem.title}
                        </UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody>
                      <UICardText noOfLines={3}>{problem.description}</UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-problems/${problem.slug}`} variant="ghost" size="sm">
                        View Problem
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {relatedUxSolutions && relatedUxSolutions.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border" w="full">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Key Solutions Embodied in Our Process
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="container.lg" mx="auto">
                {relatedUxSolutions.map((solution: UxSolutionCardItem) => (
                  <UICard key={solution.id} variant="outlineFilled" h="full">
                    <UICardHeader>
                      <HStack spacing={3}>
                        {solution.icon && (
                          <DynamicLucideIcon
                            name={solution.icon.name}
                            size={22}
                            color="var(--chakra-colors-green-500)"
                          />
                        )}
                        <UICardHeading size="md" as="h3">
                          {solution.title}
                        </UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody>
                      <UICardText noOfLines={3}>{solution.description}</UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-solutions/${solution.slug}`} variant="ghost" size="sm">
                        Explore Solution
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageContentBySlug(SLUG);
  const title = (pageCmsData?.title as string) || "Our Design Process | Coriyon's Studio";
  const description =
    (pageCmsData?.meta_description as string) ||
    "Learn about the collaborative and transparent design process at Coriyon's Studio, covering discovery, design, development, and delivery.";
  const ogImage = pageCmsData?.og_image_url as string | undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/process`,
      type: 'website',
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
  };
}
