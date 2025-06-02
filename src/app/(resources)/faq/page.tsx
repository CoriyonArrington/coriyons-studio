// src/app/(resources)/faq/page.tsx
// - Removed problematic import for 'ImageObject'.
// - Used a compatible array type for 'openGraphImages' in generateMetadata.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
    VStack, Box, Accordion, AccordionItem, AccordionButton,
    AccordionPanel, AccordionIcon, chakra,
    UnorderedList, OrderedList, ListItem, Code // Added missing imports
} from '@chakra-ui/react';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getFAQsGroupedByCategory, type FAQCategoryWithItems, type FAQItem, type FAQAnswerBlock } from '@/src/lib/data/faqs';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next'; // Standard Metadata import
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// BlockRenderer for FAQ Answers
const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header':
      const level = block.data.level && block.data.level >= 1 && block.data.level <= 6
                    ? `h${block.data.level}`
                    : 'h3';
      return <Heading as={level as any} size={level === 'h3' ? 'md' : 'sm'} my={3}>{block.data.text}</Heading>;
    case 'paragraph':
      return <Text my={2} lineHeight="tall">{block.data.text}</Text>;
    case 'list':
      const ListComponent = block.data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={1} my={2} pl={5}>
          {block.data.items && Array.isArray(block.data.items) && block.data.items.map((item: string, index: number) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </ListComponent>
      );
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported FAQ answer block type: ${block.type}`, block.data);
        return <Box as="pre" p={2} borderWidth="1px" my={1} borderRadius="md" fontSize="xs" bg="gray.50"><code>{JSON.stringify(block, null, 2)}</code></Box>;
      }
      return null;
  }
};

// MarkdownComponents (if any answer blocks were of type 'markdown')
const MarkdownComponents = {
    p: (props: any) => <Text my={2} lineHeight="tall" {...props} />,
    ul: (props: any) => <UnorderedList spacing={1} my={2} pl={5} {...props} />,
    ol: (props: any) => <OrderedList spacing={1} my={2} pl={5} {...props} />,
    li: (props: any) => <ListItem {...props} />,
    a: (props: any) => <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
};


interface FAQPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

interface FAQPageProps { }

const SLUG = 'faq';

export default async function FAQPage({ }: FAQPageProps) {
  const [pageCmsData, faqCategories, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getFAQsGroupedByCategory(),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === pageCmsData.slug);
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = navigablePages[currentPageIndex - 1];
        previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
      }
      if (currentPageIndex < navigablePages.length - 1) {
        const next = navigablePages[currentPageIndex + 1];
        nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
      }
    }
  }

  if (!pageCmsData && (!faqCategories || faqCategories.length === 0)) {
    return ( /* Error UI */ <Layout><Section id="faq-error"><Heading>FAQ Not Available</Heading></Section><PrevNextNavigation/></Layout> );
  }

  const cmsContent = pageCmsData?.content as FAQPageCmsContent | undefined;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageCmsData?.title) {
      parts.push(<Heading key="hero-headline" as="h2" size="xl" mt={4} mb={6} textAlign="center">{cmsContent.hero.headline}</Heading>);
    }
    if (cmsContent.intro_text) {
      parts.push(<Text key="intro-text" fontSize="lg" color="muted.foreground" maxW="2xl" textAlign="center" mx="auto" mb={10}>{cmsContent.intro_text}</Text>);
    }
    if (parts.length > 0) {
      introContent = <VStack spacing={4} alignItems="center" mt={4}>{parts}</VStack>;
    }
  }

  return (
    <Layout>
      <Section id={pageCmsData?.slug || SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageCmsData?.title || "Frequently Asked Questions"}
        </Heading>
        {introContent}

        {faqCategories && faqCategories.length > 0 ? (
          <VStack spacing={10} alignItems="stretch" mt={8} maxW="container.lg" mx="auto">
            {faqCategories.map((category: FAQCategoryWithItems) => (
              <Box key={category.id} w="full">
                <Heading as="h2" size="xl" mb={6} borderBottomWidth="2px" borderColor="primary.500" pb={2}>
                  {category.name}
                </Heading>
                {category.description && <Text color="muted.foreground" mb={4}>{category.description}</Text>}
                {category.faqs && category.faqs.length > 0 ? (
                  <Accordion allowMultiple defaultIndex={[0]}>
                    {category.faqs.map((faq: FAQItem) => (
                      <AccordionItem key={faq.id} mb={2}>
                        <h2>
                          <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                            <Box as="span" flex='1' textAlign='left' fontWeight="semibold" fontSize="lg">
                              {faq.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} pt={4} borderLeftWidth="1px" borderRightWidth="1px" borderBottomWidth="1px" borderColor="border">
                          {faq.answer?.blocks && Array.isArray(faq.answer.blocks) ? (
                             faq.answer.blocks.map((block: FAQAnswerBlock, index: number) => (
                               <BlockRenderer key={block.id || `faq-${faq.id}-block-${index}`} block={block} />
                             ))
                          ) : faq.answer?.markdown ? ( // Fallback to render markdown if present
                            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                                {faq.answer.markdown}
                            </ReactMarkdown>
                          ) : (
                            <Text color="muted.foreground">Answer not available.</Text>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Text>No FAQs in this category yet.</Text>
                )}
              </Box>
            ))}
          </VStack>
        ) : (
          pageCmsData ? 
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No FAQs available at the moment. Please check back soon!
          </Text> : null
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/resources" />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageContentBySlug(SLUG);
  const title = pageCmsData?.title || "FAQ | Coriyon's Studio";
  const description = pageCmsData?.meta_description || "Find answers to frequently asked questions about Coriyon's Studio services, process, and more.";
  const ogImage = pageCmsData?.og_image_url;
  
  // Define openGraphImages with a type compatible with Metadata['openGraph']['images']
  const openGraphImages: Array<{ url: string | URL; alt?: string }> = [];
  if (ogImage) { 
    openGraphImages.push({ url: ogImage }); 
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