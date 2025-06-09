// ATTEMPT 2: Final cleanup.
// - Removed unused 'ServiceData' and 'PageRow' type imports.

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { VStack, SimpleGrid, Box, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import { getPageDataBySlug, getNavigablePages } from '@/src/lib/data/pages';
// FIX: Removed unused 'ServiceData' type import.
import { getAllServices } from '@/src/lib/data/services';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';

const SLUG = 'services';

interface ServicesPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
}

interface ServicesPageProps {
  params: unknown;
}

export default async function ServicesPage({ params: _params }: ServicesPageProps) {
  const pageCmsData = await getPageDataBySlug(SLUG);
  const allServices = await getAllServices();
  const navigablePages = await getNavigablePages();

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageCmsData.slug);
    if (currentPageIndex > 0) {
      const prev = navigablePages[currentPageIndex - 1];
      previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
    }
    if (currentPageIndex < navigablePages.length - 1) {
      const next = navigablePages[currentPageIndex + 1];
      nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
    }
  }

  const cmsContent = pageCmsData?.content as unknown as ServicesPageCmsContent | null;
  const pageTitle = pageCmsData?.title || 'Services';

  return (
    <Layout>
      <Section id={pageCmsData?.slug} py={{ base: 12, md: 20 }}>
        <VStack spacing={10}>
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>{pageTitle}</Heading>
            {cmsContent?.intro_text && (
              <Text fontSize="lg" color="muted.foreground" maxW="2xl" textAlign="center" mx="auto">
                {cmsContent.intro_text}
              </Text>
            )}
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} w="full">
            {allServices.map((service) => (
              <PostCard
                key={service.id}
                href={`/services/${service.slug}`}
                title={service.title}
                description={service.description}
                imageUrl={service.featured_image_url}
                tags={service.offering_type ? [{ id: service.offering_type, name: service.offering_type }] : []}
                tagColorScheme={service.offering_type === 'BUNDLE' ? 'purple' : 'teal'}
                ctaText="Learn More"
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params: _params }: ServicesPageProps): Promise<Metadata> {
  const pageData = await getPageDataBySlug(SLUG);
  const title = pageData?.title || "Services & Case Studies | Coriyon's Studio";
  const description = pageData?.meta_description || 'Explore the UX services offered by Coriyon’s Studio.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageData?.og_image_url ? [{ url: pageData.og_image_url }] : undefined,
    },
  };
}