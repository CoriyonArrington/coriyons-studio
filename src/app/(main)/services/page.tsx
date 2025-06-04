// src/app/(main)/services/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
  VStack,
  SimpleGrid,
  Image,
  Box,
  Tag as ChakraTag,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  OrderedList,
  ListItem,
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
import { getAllServices, type ServiceData, type ServiceContentData } from '@/src/lib/data/services';
import type { FAQItem, FAQAnswerBlock } from '@/src/lib/data/faqs';
import type { UxProblemCardItem } from '@/src/lib/data/ux_problems';
import type { UxSolutionCardItem } from '@/src/lib/data/ux_solutions';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const SLUG = 'services';

interface ServicesPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedFaqs?: FAQItem[];
  relatedUxProblems?: UxProblemCardItem[];
  relatedUxSolutions?: UxSolutionCardItem[];
  [key: string]: any;
}

interface ServicesPageProps {
  params: {};
}

// DynamicLucideIcon: renders Lucide icon by name or fallback
const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
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
    console.warn(`Lucide icon "${name}" not found. Rendering fallback 'HelpCircle'.`);
  }
  return <LucideIcons.HelpCircle {...props} />;
};

// Renders FAQ answer blocks
const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const level =
        block.data.level && block.data.level >= 1 && block.data.level <= 6 ? `h${block.data.level}` : 'h3';
      return (
        <Heading as={level as any} size={level === 'h3' ? 'md' : 'sm'} my={3}>
          {block.data.text}
        </Heading>
      );
    }
    case 'paragraph':
      return (
        <Text my={2} lineHeight="tall">
          {block.data.text}
        </Text>
      );
    case 'list': {
      const ListComponent = block.data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={1} my={2} pl={5}>
          {Array.isArray(block.data.items) &&
            block.data.items.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
        </ListComponent>
      );
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported FAQ block type on Services page: ${block.type}`, block.data);
        return (
          <Box
            as="pre"
            p={2}
            borderWidth="1px"
            my={1}
            borderRadius="md"
            fontSize="xs"
            bg="gray.50"
          >
            <code>{JSON.stringify(block, null, 2)}</code>
          </Box>
        );
      }
      return null;
  }
};

const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {};

export default async function ServicesPage({ params: _params }: ServicesPageProps) {
  // Cast so TS knows these fields are strings or known types
  const pageCmsData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const allServices = (await getAllServices()) as ServiceData[];
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;
  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageCmsData.slug);
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

  if (!pageCmsData) {
    return (
      <Layout>
        <Section id="error-services" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Page Not Found
          </Heading>
          <Text>
            We&apos;re sorry, but the content for the Services page could not be loaded or found.
          </Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  // Cast JSONB content into our shape
  const cmsContent = (pageCmsData.content as unknown) as ServicesPageCmsContent | null;
  const relatedFaqs = cmsContent?.relatedFaqs as FAQItem[] | undefined;
  const relatedUxProblems = cmsContent?.relatedUxProblems as UxProblemCardItem[] | undefined;
  const relatedUxSolutions = cmsContent?.relatedUxSolutions as UxSolutionCardItem[] | undefined;

  let introContent: React.ReactNode = null;
  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== (pageCmsData.title as string)) {
      parts.push(
        <Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">
          {cmsContent.hero.headline}
        </Heading>
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
        </Text>
      );
    }
    if (parts.length > 0) {
      introContent = <VStack spacing={4} alignItems="center" mt={4}>{parts}</VStack>;
    }
  }

  return (
    <Layout>
      <Section
        id={pageCmsData.slug as string}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <VStack spacing={10}>
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>
              {pageCmsData.title as string}
            </Heading>
            {introContent}
          </Box>

          {allServices.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} w="full">
              {allServices.map((service: ServiceData) => (
                <NextLink
                  key={service.id}
                  href={`/services/${service.slug}`}
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
                    {service.featured_image_url && (
                      <Image
                        src={service.featured_image_url as string}
                        alt={service.title as string}
                        borderTopRadius="md"
                        objectFit="cover"
                        h="200px"
                        w="full"
                      />
                    )}
                    <UICardHeader>
                      <HStack justifyContent="space-between" alignItems="center">
                        <UICardHeading size="lg" as="h3">
                          {service.title as string}
                        </UICardHeading>
                        {service.offering_type === 'BUNDLE' && (
                          <ChakraTag size="sm" colorScheme="purple">
                            Bundle
                          </ChakraTag>
                        )}
                        {service.offering_type === 'INDIVIDUAL' && (
                          <ChakraTag size="sm" colorScheme="teal">
                            Service
                          </ChakraTag>
                        )}
                      </HStack>
                    </UICardHeader>
                    <UICardBody flexGrow={1}>
                      <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                        {service.description as string || 'More details about this service.'}
                      </UICardText>
                      {service.content && (
                        <Box fontSize="sm" mt={2}>
                          {(service.content as ServiceContentData).price && (
                            <Text fontWeight="bold">
                              Price: {(service.content as ServiceContentData).price}
                            </Text>
                          )}
                          {service.offering_type === 'BUNDLE' &&
                            (service.content as ServiceContentData).includes_summary && (
                              <Text mt={1}>
                                <strong>Includes:</strong>{' '}
                                {(service.content as ServiceContentData).includes_summary}
                              </Text>
                            )}
                        </Box>
                      )}
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton
                        href={`/services/${service.slug}`}
                        size="sm"
                        variant="themedSolid"
                        width="full"
                      >
                        Learn More
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                </NextLink>
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="muted.foreground" mt={8}>
              Our services will be detailed here soon. Please check back!
            </Text>
          )}

          {relatedUxProblems && relatedUxProblems.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border" w="full">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Common UX Problems We Address
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
                          {problem.title as string}
                        </UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody>
                      <UICardText noOfLines={3}>{problem.description as string}</UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-problems/${problem.slug as string}`} variant="ghost" size="sm">
                        View Details
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
                Key Solutions We Offer
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
                          {solution.title as string}
                        </UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody>
                      <UICardText noOfLines={3}>{solution.description as string}</UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-solutions/${solution.slug as string}`} variant="ghost" size="sm">
                        Explore Solution
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {relatedFaqs && relatedFaqs.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border" w="full">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Related Questions
              </Heading>
              <Accordion allowMultiple defaultIndex={relatedFaqs.length > 3 ? [] : [0]} maxW="container.md" mx="auto">
                {relatedFaqs.map((faq: FAQItem) => (
                  <AccordionItem key={faq.id} mb={2}>
                    <h2>
                      <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="lg">
                          {faq.question as string}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      pt={4}
                      borderLeftWidth="1px"
                      borderRightWidth="1px"
                      borderBottomWidth="1px"
                      borderColor="border"
                    >
                      {faq.answer?.blocks && Array.isArray(faq.answer.blocks) ? (
                        faq.answer.blocks.map((block: FAQAnswerBlock, index: number) => (
                          <BlockRenderer
                            key={block.id || `faq-${faq.id}-block-${index}`}
                            block={block}
                          />
                        ))
                      ) : faq.answer?.markdown ? (
                        <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                          {faq.answer.markdown as string}
                        </ReactMarkdown>
                      ) : (
                        <Text color="muted.foreground">Answer not available.</Text>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params: _params }: ServicesPageProps): Promise<Metadata> {
  // Cast so TS knows title/description are strings
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  if (!pageData) {
    return { title: 'Services Page Not Found | Coriyon’s Studio' };
  }
  const title = pageData.title as string;
  const description = (pageData.meta_description as string) || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageData.og_image_url ? [{ url: pageData.og_image_url as string }] : undefined,
    },
  };
}
