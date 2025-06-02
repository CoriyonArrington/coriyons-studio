// src/app/(legal)/terms-of-service/page.tsx
// - Sets correct SLUG constant.
// - Corrects OpenGraph image typing in generateMetadata.
// - Ensures chakra is imported correctly from @chakra-ui/react.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { 
    VStack, Box, Divider, UnorderedList, OrderedList, ListItem, Code, 
    chakra // Correctly imported
} from '@chakra-ui/react';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next'; // Standard Metadata import
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LegalPageSection {
  heading: string;
  content_md: string;
}
interface LegalPageContent {
  document_title?: string;
  last_updated_date?: string;
  sections?: LegalPageSection[];
  [key: string]: any;
}

const MarkdownComponents = {
  h1: (props: any) => <Heading as="h1" size="xl" my={6} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" my={5} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" my={4} {...props} />,
  p: (props: any) => <Text my={3} lineHeight="tall" {...props} />,
  ul: (props: any) => <UnorderedList spacing={2} my={3} pl={5} {...props} />,
  ol: (props: any) => <OrderedList spacing={2} my={3} pl={5} {...props} />,
  li: (props: any) => <ListItem {...props} />,
  a: (props: any) => <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
  code: (props: any) => { const { children, ...rest } = props; return <Code p={1} fontSize="0.9em" {...rest}>{children}</Code>; },
  pre: (props: any) => <Box as="pre" p={3} borderWidth="1px" my={4} borderRadius="md" overflowX="auto" bg="gray.50" _dark={{bg: "gray.700"}}>{props.children}</Box>
};

interface LegalPageProps {}

const SLUG = 'terms-of-service'; // Correct SLUG for this page

export default async function TermsOfServicePage(props: LegalPageProps) {
  const [pageData, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageData && navigablePages && navigablePages.length > 0) {
    const legalPages = navigablePages
      .filter(p => p.page_type === 'LEGAL')
      .sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));
    const currentPageIndex = legalPages.findIndex(p => p.slug === pageData.slug);
    
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = legalPages[currentPageIndex - 1];
        previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
      }
      if (currentPageIndex < legalPages.length - 1) {
        const next = legalPages[currentPageIndex + 1];
        nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
      }
    }
  }

  if (!pageData || !pageData.content) {
    return (
      <Layout>
        <Section id={`error-${SLUG}`} py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Terms of Service Not Found</Heading>
          <Text>The content for this page could not be loaded.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/legal"/>
      </Layout>
    );
  }

  const content = pageData.content as LegalPageContent | null;
  const pageTitle = content?.document_title || pageData.title;

  return (
    <Layout>
      <Section id={SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <VStack spacing={8} alignItems="stretch" maxW="container.md" mx="auto">
          <Heading as="h1" size="2xl" mb={2} textAlign="center">
            {pageTitle}
          </Heading>
          {content?.last_updated_date && (
            <Text fontSize="sm" color="muted.foreground" textAlign="center" mb={8}>
              Last Updated: {new Date(content.last_updated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          )}

          {content?.sections && content.sections.length > 0 ? (
            content.sections.map((section: LegalPageSection, index: number) => (
              <Box key={index} mb={6}>
                {section.heading && (
                  <Heading as="h2" size="lg" mt={index > 0 ? 8 : 0} mb={3} borderBottomWidth="1px" borderColor="border" pb={1}>
                    {section.heading}
                  </Heading>
                )}
                {section.content_md && (
                  <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {section.content_md}
                  </ReactMarkdown>
                )}
              </Box>
            ))
          ) : (
            <Text>Terms of Service content is not yet available.</Text>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/legal" />
    </Layout>
  );
}

export async function generateMetadata(props: LegalPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) { 
    return { 
      title: 'Terms of Service Not Found | Coriyon’s Studio',
      description: 'The requested page could not be found.'
    }; 
  }
  
  const content = pageData.content as LegalPageContent | null;
  const title = content?.document_title || pageData.title || "Terms of Service | Coriyon's Studio";
  const description = pageData.meta_description || "Read the Terms of Service for Coriyon's Studio.";
  const ogImage = pageData.og_image_url;
  // Use a compatible type for openGraph images array
  const openGraphImages: Array<{ url: string | URL; alt?: string }> = [];
  if (ogImage) { openGraphImages.push({ url: ogImage }); }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: openGraphImages.length > 0 ? openGraphImages : undefined,
    },
  };
}