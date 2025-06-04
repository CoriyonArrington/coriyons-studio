// src/app/(support)/faq/page.tsx
// - Removed problematic import for 'ImageObject'.
// - Used type guards to ensure all values passed to props match their expected types.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
  VStack,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  chakra,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import {
  getFAQsGroupedByCategory,
  type FAQCategoryWithItems,
  type FAQItem,
  type FAQAnswerBlock,
} from '@/src/lib/data/faqs';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Renders a single answer block according to its type
const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header':
      // Determine header level between h1 and h6; default to h3
      const levelTag =
        typeof block.data.level === 'number' &&
        block.data.level >= 1 &&
        block.data.level <= 6
          ? `h${block.data.level}`
          : 'h3';
      return (
        <Heading
          as={levelTag as any}
          size={levelTag === 'h3' ? 'md' : 'sm'}
          my={3}
        >
          {block.data.text}
        </Heading>
      );

    case 'paragraph':
      return (
        <Text my={2} lineHeight="tall">
          {block.data.text}
        </Text>
      );

    case 'list':
      // Choose ordered vs unordered based on style
      const ListComponent =
        block.data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={1} my={2} pl={5}>
          {Array.isArray(block.data.items)
            ? block.data.items.map((item: string, index: number) => (
                <ListItem key={index}>{item}</ListItem>
              ))
            : null}
        </ListComponent>
      );

    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported FAQ answer block type: ${block.type}`, block.data);
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

// Custom components for rendering Markdown inside FAQ answers
const MarkdownComponents = {
  p: (props: any) => <Text my={2} lineHeight="tall" {...props} />,
  ul: (props: any) => (
    <UnorderedList spacing={1} my={2} pl={5} {...props} />
  ),
  ol: (props: any) => <OrderedList spacing={1} my={2} pl={5} {...props} />,
  li: (props: any) => <ListItem {...props} />,
  a: (props: any) => (
    <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />
  ),
};

interface FAQPageCmsContent {
  hero?: { headline?: unknown };
  intro_text?: unknown;
  meta_description?: unknown;
  og_image_url?: unknown;
  slug?: unknown;
  title?: unknown;
  [key: string]: unknown;
}

const SLUG = 'faq';

export default async function FAQPage() {
  const [pageCmsDataRaw, faqCategories, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getFAQsGroupedByCategory(),
    getNavigablePages(),
  ]);

  // Normalize fetched data
  const pageCmsData = pageCmsDataRaw ?? null;
  // Ensure slug is a string
  const pageSlug =
    typeof pageCmsData?.slug === 'string' ? pageCmsData.slug : SLUG;
  // Ensure title is a string
  const pageTitle =
    typeof pageCmsData?.title === 'string'
      ? pageCmsData.title
      : 'Frequently Asked Questions';

  // Compute previous/next page links
  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData && typeof pageCmsData.slug === 'string') {
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

  // If neither CMS data nor FAQ items exist, show an error state
  if (!pageCmsData && (!faqCategories || faqCategories.length === 0)) {
    return (
      <Layout>
        <Section id="faq-error">
          <Heading>FAQ Not Available</Heading>
        </Section>
        <PrevNextNavigation
          previousPage={previousPageLink}
          nextPage={nextPageLink}
        />
      </Layout>
    );
  }

  // Safely extract CMS content fields
  const cmsContent = (pageCmsData?.content ?? null) as FAQPageCmsContent | null;
  // Hero headline from CMS, if provided as a string
  const heroHeadline =
    typeof cmsContent?.hero?.headline === 'string'
      ? cmsContent.hero.headline
      : null;
  // Intro text from CMS, if provided as a string
  const introText =
    typeof cmsContent?.intro_text === 'string' ? cmsContent.intro_text : null;

  // Build introContent if any parts exist
  let introContent: React.ReactNode = null;
  const parts: React.ReactNode[] = [];

  if (heroHeadline && heroHeadline !== pageTitle) {
    parts.push(
      <Heading
        key="hero-headline"
        as="h2"
        size="xl"
        mt={4}
        mb={6}
        textAlign="center"
      >
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

  return (
    <Layout>
      <Section
        id={pageSlug}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageTitle}
        </Heading>
        {introContent}

        {faqCategories && faqCategories.length > 0 ? (
          <VStack
            spacing={10}
            alignItems="stretch"
            mt={8}
            maxW="container.lg"
            mx="auto"
          >
            {faqCategories.map(
              (category: FAQCategoryWithItems) => {
                // Category name and optional description
                const categoryName =
                  typeof category.name === 'string'
                    ? category.name
                    : '';
                const categoryDescription =
                  typeof category.description === 'string'
                    ? category.description
                    : null;

                return (
                  <Box key={category.id} w="full">
                    <Heading
                      as="h2"
                      size="xl"
                      mb={6}
                      borderBottomWidth="2px"
                      borderColor="primary.500"
                      pb={2}
                    >
                      {categoryName}
                    </Heading>
                    {categoryDescription && (
                      <Text color="muted.foreground" mb={4}>
                        {categoryDescription}
                      </Text>
                    )}
                    {Array.isArray(category.faqs) &&
                    category.faqs.length > 0 ? (
                      <Accordion allowMultiple defaultIndex={[0]}>
                        {category.faqs.map((faq: FAQItem) => {
                          // Ensure question is a string
                          const question =
                            typeof faq.question === 'string'
                              ? faq.question
                              : '';
                          // The answer may have blocks or markdown
                          const answerBlocks = Array.isArray(
                            faq.answer?.blocks
                          )
                            ? faq.answer.blocks
                            : null;
                          const answerMarkdown =
                            typeof faq.answer?.markdown === 'string'
                              ? faq.answer.markdown
                              : null;

                          return (
                            <AccordionItem key={faq.id} mb={2}>
                              <h2>
                                <AccordionButton
                                  _expanded={{ bg: 'blue.600', color: 'white' }}
                                >
                                  <Box
                                    as="span"
                                    flex="1"
                                    textAlign="left"
                                    fontWeight="semibold"
                                    fontSize="lg"
                                  >
                                    {question}
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
                                {answerBlocks ? (
                                  answerBlocks.map(
                                    (block: FAQAnswerBlock, index: number) => (
                                      <BlockRenderer
                                        key={
                                          block.id ||
                                          `faq-${faq.id}-block-${index}`
                                        }
                                        block={block}
                                      />
                                    )
                                  )
                                ) : answerMarkdown ? (
                                  <ReactMarkdown
                                    components={MarkdownComponents}
                                    remarkPlugins={[remarkGfm]}
                                  >
                                    {answerMarkdown}
                                  </ReactMarkdown>
                                ) : (
                                  <Text color="muted.foreground">
                                    Answer not available.
                                  </Text>
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    ) : (
                      <Text>No FAQs in this category yet.</Text>
                    )}
                  </Box>
                );
              }
            )}
          </VStack>
        ) : (
          // If CMS data exists but no categories
          pageCmsData && (
            <Text textAlign="center" color="muted.foreground" mt={8}>
              No FAQs available at the moment. Please check back soon!
            </Text>
          )
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
  const pageCmsData = pageCmsDataRaw ?? null;

  // Safely extract title and description as strings
  const title =
    typeof pageCmsData?.title === 'string'
      ? pageCmsData.title
      : "FAQ | Coriyon's Studio";
  const description =
    typeof pageCmsData?.meta_description === 'string'
      ? pageCmsData.meta_description
      : 'Find answers to frequently asked questions about Coriyon’s Studio services, process, and more.';

  // Safely extract og_image_url if it's a string
  const ogImageUrl =
    typeof pageCmsData?.og_image_url === 'string'
      ? pageCmsData.og_image_url
      : null;

  // Build openGraph images array with correct types
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
      url: `/faq`,
      images: openGraphImages.length > 0 ? openGraphImages : undefined,
    },
  };
}
