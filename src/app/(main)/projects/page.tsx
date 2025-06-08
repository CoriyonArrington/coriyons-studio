/*
 FINAL VERSION - Key Changes:
 - The custom card implementation has been replaced with the new, unified <PostCard /> component.
 - Data from the `project` object is now mapped to the props of <PostCard />, ensuring
   a consistent look and feel with other cards on the site.
*/
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { VStack, SimpleGrid, Box, Heading, Text } from '@chakra-ui/react';
import PostCard from '@/src/components/common/post-card';
import { getPageContentBySlug, getNavigablePages, type NavigablePageInfo } from '@/src/lib/data/pages';
import { getAllProjects, type HomepageProject } from '@/src/lib/data/projects';
import type { FAQItem } from '@/src/lib/data/faqs';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface ProjectsPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedFaqs?: FAQItem[];
}

interface ProjectsPageProps {
  params: {};
}

const SLUG = 'projects';

export default async function ProjectsPage({ params: _params }: ProjectsPageProps) {
  const pageCmsData = await getPageContentBySlug(SLUG) as PageRow | null;
  const allProjects = await getAllProjects() as HomepageProject[];
  const navigablePages = await getNavigablePages();

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageCmsData.slug);
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

  const cmsContent = pageCmsData?.content as unknown as ProjectsPageCmsContent | null;
  const pageTitle = (pageCmsData?.title as string) || 'Our Work & Case Studies';

  return (
    <Layout>
      <Section id={SLUG} py={{ base: 12, md: 20 }}>
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
                imageUrl={project.featured_image_url}
                tags={project.tags}
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

export async function generateMetadata({ params: _params }: ProjectsPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  const title = (pageData?.title as string) || "Projects & Case Studies | Coriyon's Studio";
  const description = (pageData?.meta_description as string) || "Explore the portfolio of UX design projects and case studies by Coriyon's Studio.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageData?.og_image_url ? [{ url: pageData.og_image_url as string }] : undefined,
    },
  };
}