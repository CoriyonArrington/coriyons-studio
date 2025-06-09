'use client';

import React from 'react';
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { VStack, SimpleGrid, Box, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import PrevNextNavigation, { type NavLinkInfo } from '@/src/components/common/prev-next-navigation';
import type { ProjectCardItem } from '@/src/lib/data/projects';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface ProjectsViewProps {
  pageData: PageRow | null;
  allProjects: ProjectCardItem[];
  previousPageLink?: NavLinkInfo;
  nextPageLink?: NavLinkInfo;
}

export default function ProjectsView({ pageData, allProjects, previousPageLink, nextPageLink }: ProjectsViewProps) {
  const cmsContent = pageData?.content as { intro_text?: string } | null;
  const pageTitle = pageData?.title || 'Our Work & Case Studies';

  return (
    <Layout>
      <Section id={pageData?.slug ?? 'projects'} py={{ base: 12, md: 20 }}>
        <VStack spacing={8} alignItems="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>{pageTitle}</Heading>
            {cmsContent?.intro_text && (
              <Text fontSize="lg" color="muted.foreground" maxW="2xl" mx="auto">
                {cmsContent.intro_text}
              </Text>
            )}
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {allProjects.map((project) => (
              <PostCard
                key={project.id}
                href={`/projects/${project.slug}`}
                title={project.title}
                description={project.description}
                imageUrl={project.featured_image?.image_url}
                tags={project.services?.map(s => ({id: s.id, name: s.title}))}
                tagColorScheme="blue"
                ctaText="View Project"
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}