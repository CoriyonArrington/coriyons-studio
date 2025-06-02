// src/app/(main)/services/page.tsx
// - Removed local mapPageTypeToCategoryLabel function.
// - Imported mapPageTypeToCategoryLabel from @/src/lib/utils.
// - Fetches and displays all services.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, Image, Box, Tag as ChakraTag, HStack } from '@chakra-ui/react';
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import { getAllServices, type ServiceData, type ServiceContentData } from '@/src/lib/data/services';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils'; // Import centralized helper
import type { Metadata } from 'next';

interface ServicesPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  services_display_config?: { layout?: string };
  [key: string]: any;
}

interface ServicesPageProps {
  params: {};
}

const SLUG = 'services';

// Local mapPageTypeToCategoryLabel function REMOVED

export default async function ServicesPage({ params }: ServicesPageProps) {
  const [pageCmsData, allServices, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllServices(),
    getNavigablePages()
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === pageCmsData.slug);
    if (currentPageIndex !== -1) {
      if (currentPageIndex > 0) {
        const prev = navigablePages[currentPageIndex - 1];
        previousPageLink = {
          slug: prev.slug,
          title: prev.title,
          categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) // Uses imported helper
        };
      }
      if (currentPageIndex < navigablePages.length - 1) {
        const next = navigablePages[currentPageIndex + 1];
        nextPageLink = {
          slug: next.slug,
          title: next.title,
          categoryLabel: mapPageTypeToCategoryLabel(next.page_type) // Uses imported helper
        };
      }
    }
  }

  if (!pageCmsData) {
    return (
      <Layout>
        <Section id="error-services" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Not Found</Heading>
          <Text>We&apos;re sorry, but the content for the Services page could not be loaded or found.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  const cmsContent = pageCmsData.content as ServicesPageCmsContent | null;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageCmsData.title) {
        parts.push(<Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">{cmsContent.hero.headline}</Heading>);
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
      <Section id={pageCmsData.slug} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {pageCmsData.title}
        </Heading>
        {introContent}

        {allServices && allServices.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {allServices.map((service: ServiceData) => (
              <UICard key={service.id} variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                {service.featured_image_url && (
                  <Image
                      src={service.featured_image_url}
                      alt={service.title}
                      borderTopRadius="md"
                      objectFit="cover"
                      h="200px"
                      w="full"
                  />
                )}
                <UICardHeader>
                  <HStack justifyContent="space-between" alignItems="center">
                    <UICardHeading size="lg" as="h3">{service.title}</UICardHeading>
                    {service.offering_type === 'BUNDLE' && <ChakraTag size="sm" colorScheme="purple">Bundle</ChakraTag>}
                    {service.offering_type === 'INDIVIDUAL' && <ChakraTag size="sm" colorScheme="teal">Service</ChakraTag>}
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                      {service.description || "More details about this service."}
                  </UICardText>
                  {service.content && (
                    <Box fontSize="sm" mt={2}>
                      {(service.content as ServiceContentData).price && <Text fontWeight="bold">Price: {(service.content as ServiceContentData).price}</Text>}
                      {service.offering_type === 'BUNDLE' && (service.content as ServiceContentData).includes_summary && <Text mt={1}><strong>Includes:</strong> {(service.content as ServiceContentData).includes_summary}</Text>}
                    </Box>
                  )}
                </UICardBody>
                <UICardFooter>
                   <HeroCtaButton href={`/services/${service.slug}`} size="sm" variant="themedSolid" width="full">
                     Learn More
                   </HeroCtaButton>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            Our services will be detailed here soon. Please check back!
          </Text>
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) { return { title: 'Services Page Not Found | Coriyon’s Studio' }; }
  return {
    title: pageData.title,
    description: pageData.meta_description,
    openGraph: {
      title: pageData.title,
      description: pageData.meta_description || undefined,
      url: `/${SLUG}`,
      images: pageData.og_image_url ? [{ url: pageData.og_image_url }] : undefined,
    },
  };
}