/*
 FINAL VERSION - Key Changes:
 - Consolidated all component imports from '@chakra-ui/react'.
 - Removed incorrect/duplicate imports from the old typography folder.
 - Added explicit type assertions to satisfy the TypeScript compiler.
*/
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  VStack,
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';
import { getFeaturedTestimonials, type HomepageTestimonial } from '@/src/lib/data/testimonials';
import HeroCtaButton from '@/src/components/common/hero-cta-button';

const SLUG = 'about';

// --- Type Definitions ---
interface AboutPageCmsContent {
  hero?: {
    headline?: string;
    subheadline?: string;
    image_url?: string;
    image_alt?: string;
  };
  main_content?: {
    blocks: Array<{ type: string; data: any }>;
  };
  cta_section?: {
    headline?: string;
    subheadline?: string;
    cta_text?: string;
    cta_href?: string;
  };
  [key: string]: any;
}

interface AboutPageProps {
  params: {};
}

// --- Page Component ---
export default async function AboutPage({ params: _params }: AboutPageProps) {
  const [pageCmsData, navigablePages, featuredTestimonials] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages(),
    getFeaturedTestimonials(3),
  ]);

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

  if (!pageCmsData) {
    return (
      <Layout>
        <Section id="about-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">About Page Not Found</Heading>
          <Text>We&apos;re sorry, but the content for this page could not be loaded.</Text>
        </Section>
      </Layout>
    );
  }

  const cmsContent = pageCmsData.content as unknown as AboutPageCmsContent | null;
  const pageTitle = (pageCmsData.title as string) || 'About Us';

  return (
    <Layout>
      <Section
        id={pageCmsData.slug as string}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <VStack spacing={12} alignItems="stretch">
          <Box textAlign="center" maxW="3xl" mx="auto">
            <Heading as="h1" size="3xl" mb={4}>{pageTitle}</Heading>
            {cmsContent?.hero?.subheadline && (
              <Text fontSize="xl" color="muted.foreground">
                {cmsContent.hero.subheadline}
              </Text>
            )}
          </Box>

          {cmsContent?.hero?.image_url && (
            <Image
              src={cmsContent.hero.image_url}
              alt={cmsContent.hero.image_alt || 'About Coriyon’s Studio'}
              borderRadius="lg"
              boxShadow="lg"
              maxH="500px"
              w="full"
              objectFit="cover"
            />
          )}

          {cmsContent?.main_content?.blocks && (
            <Box maxW="container.md" mx="auto" className="prose" sx={{'.prose': { all: 'revert'}}}>
                {cmsContent.main_content.blocks.map((block: {type: string, data: any}, index: number) => {
                    if (block.type === 'header') {
                        const level = `h${block.data.level || 2}` as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6';
                        return <Heading key={index} as={level} size="xl" mt={8} mb={4}>{block.data.text}</Heading>
                    }
                    if (block.type === 'paragraph') {
                        return <Text key={index} fontSize="lg" lineHeight="tall" my={4}>{block.data.text}</Text>
                    }
                    return null;
                })}
            </Box>
          )}

          {featuredTestimonials.length > 0 && (
            <Section variant="subtle" py={{ base: 12, md: 20 }}>
              <Heading as="h2" size="2xl" mb={10} textAlign="center">
                What Our Clients Say
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {featuredTestimonials.map((testimonial) => (
                  <VStack key={testimonial.id} spacing={4} textAlign="center" p={6} bg="background" borderRadius="md" boxShadow="md">
                    <Avatar src={testimonial.avatar_url as string} name={testimonial.name as string} size="xl" />
                    <Text fontStyle="italic" fontSize="lg">&quot;{testimonial.quote}&quot;</Text>
                    <Box>
                        <Text fontWeight="bold">{testimonial.name}</Text>
                        <Text fontSize="sm" color="muted.foreground">{testimonial.role}, {testimonial.company_name}</Text>
                    </Box>
                  </VStack>
                ))}
              </SimpleGrid>
            </Section>
          )}

          {cmsContent?.cta_section && (
            <Section variant="inverse" py={{ base: 16, md: 24 }}>
                <VStack spacing={6} textAlign="center">
                    <Heading as="h2" size="2xl" color="background">{cmsContent.cta_section.headline}</Heading>
                    <Text fontSize="xl" color="background" opacity={0.8} maxW="xl">{cmsContent.cta_section.subheadline}</Text>
                    <HeroCtaButton href={cmsContent.cta_section.cta_href || '#'} colorScheme="gray">{cmsContent.cta_section.cta_text || 'Get In Touch'}</HeroCtaButton>
                </VStack>
            </Section>
          )}

        </VStack>
      </Section>

      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG) as PageRow | null;

  if (!pageData) {
    return { title: "About | Coriyon's Studio" };
  }

  const title = (pageData.title as string) || "About Coriyon's Studio";
  const description = (pageData.meta_description as string) || "Learn more about Coriyon's Studio, our mission, and our process.";
  
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