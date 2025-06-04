// src/app/(main)/about/page.tsx

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
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import type { FAQItem, FAQAnswerBlock } from '@/src/lib/data/faqs';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface AboutPageCmsContent {
  hero?: { headline?: string };
  bio_section?: { title?: string; text?: string };
  philosophy_section?: { title?: string; text?: string };
  relatedFaqs?: FAQItem[];
  [key: string]: any;
}

const SLUG = 'about';

// Renders individual FAQ answer blocks
const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const level =
        block.data.level && block.data.level >= 1 && block.data.level <= 6
          ? `h${block.data.level}`
          : 'h3';
      return (
        <Heading
          as={level as any}
          size={level === 'h3' ? 'md' : 'sm'}
          my={3}
        >
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
      const ListComponent =
        block.data.style === 'ordered' ? OrderedList : UnorderedList;
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
        console.warn(
          `Unsupported FAQ answer block type on About page: ${block.type}`,
          block.data
        );
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

const MarkdownComponents = {}; // If any markdown-specific overrides are needed

export default async function AboutPage() {
  // Cast the fetched page row so TS knows its fields are strings
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageData) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === pageData.slug
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

  if (!pageData) {
    return (
      <Layout>
        <Section id="error-about" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Page Not Found
          </Heading>
          <Text>The content for the About page could not be loaded.</Text>
        </Section>
        <PrevNextNavigation
          previousPage={previousPageLink}
          nextPage={nextPageLink}
        />
      </Layout>
    );
  }

  // Cast JSONB content to our CMS shape
  const content = pageData.content as AboutPageCmsContent | null;
  const relatedFaqs: FAQItem[] | undefined = content?.relatedFaqs;

  return (
    <Layout>
      <Section
        id={pageData.slug}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <VStack spacing={8} alignItems="stretch" maxW="container.lg" mx="auto">
          <Heading as="h1" size="3xl" mb={6} textAlign="center">
            {content?.hero?.headline || pageData.title}
          </Heading>

          {content?.bio_section && (
            <Box>
              <Heading as="h2" size="xl" mb={3}>
                {content.bio_section.title || 'My Journey'}
              </Heading>
              <Text lineHeight="tall" whiteSpace="pre-line">
                {content.bio_section.text}
              </Text>
            </Box>
          )}

          {content?.philosophy_section && (
            <Box mt={8}>
              <Heading as="h2" size="xl" mb={3}>
                {content.philosophy_section.title || 'Design Philosophy'}
              </Heading>
              <Text lineHeight="tall" whiteSpace="pre-line">
                {content.philosophy_section.text}
              </Text>
            </Box>
          )}

          {relatedFaqs && relatedFaqs.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={6} textAlign="center">
                Frequently Asked Questions
              </Heading>
              <Accordion
                allowMultiple
                defaultIndex={relatedFaqs.length > 1 ? [] : [0]}
                maxW="container.md"
                mx="auto"
              >
                {relatedFaqs.map((faq: FAQItem) => (
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
                          {faq.question}
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
                      {faq.answer?.blocks &&
                      Array.isArray(faq.answer.blocks) ? (
                        faq.answer.blocks.map(
                          (block: FAQAnswerBlock, index: number) => (
                            <BlockRenderer
                              key={block.id || `faq-${faq.id}-block-${index}`}
                              block={block}
                            />
                          )
                        )
                      ) : faq.answer?.markdown ? (
                        <ReactMarkdown
                          components={MarkdownComponents}
                          remarkPlugins={[remarkGfm]}
                        >
                          {faq.answer.markdown}
                        </ReactMarkdown>
                      ) : (
                        <Text color="muted.foreground">
                          Answer not available.
                        </Text>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          )}
        </VStack>
      </Section>

      <PrevNextNavigation
        previousPage={previousPageLink}
        nextPage={nextPageLink}
      />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  // Cast so TS knows title, meta_description, og_image_url are strings
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  if (!pageData) {
    return {
      title: 'About | Coriyon’s Studio',
    };
  }
  const title = pageData.title;
  const description = pageData.meta_description ?? undefined;
  const ogImageUrl = pageData.og_image_url ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}
