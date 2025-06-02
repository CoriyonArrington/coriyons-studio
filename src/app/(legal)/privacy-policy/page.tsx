// src/app/(legal)/privacy-policy/page.tsx
// - Corrected 'chakra' import.
// - Ensured LegalPageContent and LegalPageSection interfaces match expected JSON structure.
// - Added null/undefined checks for content properties before rendering.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography'; // chakra removed
import { 
    VStack, Box, Divider, UnorderedList, OrderedList, ListItem, Code, 
    chakra // chakra added here
} from '@chakra-ui/react';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata, ResolvingMetadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define the expected structure for the 'content' JSONB of legal pages
interface LegalPageSection {
  heading: string;
  content_md: string;
}

interface LegalPageContent {
  document_title: string; // Assuming this is always present based on your seed
  last_updated_date: string; // Assuming this is always present
  sections: LegalPageSection[]; // Assuming this is always present and an array
  [key: string]: any; // Allow other properties, though less likely for this structured content
}

// Markdown components for consistent styling
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

const SLUG = 'privacy-policy';

export default async function PrivacyPolicyPage(props: LegalPageProps) {
  const [pageData, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageData && navigablePages) {
    const legalPages = navigablePages.filter(p => p.page_type === 'LEGAL').sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));
    const currentPageIndex = legalPages.findIndex((p: NavigablePageInfo) => p.slug === pageData.slug);
    
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
        <Section id="error-privacy" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Privacy Policy Not Found</Heading>
          <Text>The content for this page could not be loaded.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/legal" />
      </Layout>
    );
  }

  // Explicitly cast and ensure content is not null before accessing properties
  const content = pageData.content as LegalPageContent | null; 
  const pageTitle = content?.document_title || pageData.title; // Use optional chaining

  return (
    <Layout>
      <Section id={SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <VStack spacing={8} alignItems="stretch" maxW="container.md" mx="auto">
          <Heading as="h1" size="2xl" mb={2} textAlign="center">
            {pageTitle}
          </Heading>
          {content?.last_updated_date && ( // Optional chaining
            <Text fontSize="sm" color="muted.foreground" textAlign="center" mb={8}>
              Last Updated: {new Date(content.last_updated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          )}

          {/* Optional chaining for sections array */}
          {content?.sections && content.sections.length > 0 ? (
            content.sections.map((section: LegalPageSection, index: number) => (
              <Box key={index} mb={6}>
                {/* section.heading and section.content_md are required in LegalPageSection, no need for ?. here */}
                <Heading as="h2" size="lg" mt={index > 0 ? 8 : 0} mb={3} borderBottomWidth="1px" borderColor="border" pb={1}>
                  {section.heading}
                </Heading>
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {section.content_md}
                </ReactMarkdown>
              </Box>
            ))
          ) : (
            <Text>Privacy Policy content is not yet available.</Text>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/legal" />
    </Layout>
  );
}

export async function generateMetadata(props: LegalPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) {
    return { 
      title: 'Privacy Policy Not Found | Coriyon’s Studio',
      description: 'The Privacy Policy page was not found.'
    };
  }
  const content = pageData.content as LegalPageContent | null;
  const title = content?.document_title || pageData.title || "Privacy Policy | Coriyon's Studio";
  const description = pageData.meta_description || "Read the Privacy Policy for Coriyon's Studio.";
  const ogImage = pageData.og_image_url;
  const openGraphImages: Array<{ url: string | URL; alt?:string }> = [];
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