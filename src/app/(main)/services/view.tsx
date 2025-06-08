// src/app/(main)/services/view.tsx
'use client';

import React from 'react';
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { VStack, SimpleGrid, Box, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import PrevNextNavigation, { type NavLinkInfo } from '@/src/components/common/prev-next-navigation';
import type { ServiceData } from '@/src/lib/data/services';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface ServicesViewProps {
  pageData: PageRow | null;
  allServices: ServiceData[];
  previousPageLink?: NavLinkInfo;
  nextPageLink?: NavLinkInfo;
}

export default function ServicesView({ pageData, allServices, previousPageLink, nextPageLink }: ServicesViewProps) {
  const cmsContent = pageData?.content as { intro_text?: string } | null;
  const pageTitle = (pageData?.title as string) || 'Services';

  return (
    <Layout>
      <Section id={pageData?.slug ?? 'services'} py={{ base: 12, md: 20 }}>
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