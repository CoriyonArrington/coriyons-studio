// src/app/(main)/projects/[slug]/page.tsx
// - Corrected imports for content types from @/src/lib/data/projects.
// - Added explicit types for map callback parameters.
// - Used optional chaining for accessing 'detailContent.hero.details'.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
    Box, VStack, Image, SimpleGrid, Divider, UnorderedList,
    ListItem, HStack, Tag, Flex,
    Link as ChakraLink, Icon // Added Icon import
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
    getProjectBySlug,
    getAllProjects,
    type ProjectDetail,
    type HomepageProject,
    type ProjectDetailContent, // Main content type
    type HeroContent,          // For hero section
    type SectionContent,       // For sections array
    type ActivityLink,         // For activities
    type ContentVisual,        // For visuals
    type NextUpProjectInfo,    // For nextUp
    type HeroDetail            // For hero.details
} from '@/src/lib/data/projects';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import NextLink from 'next/link';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';

interface ProjectDetailPageProps {
  params: { slug: string };
}

// Helper function to render project details from the hero.details object
const renderHeroDetails = (details: HeroDetail | undefined) => { // Changed type to HeroDetail | undefined
  if (!details) return null;
  const detailItems = [
    { label: 'Role', value: details.Role },
    { label: 'Team', value: details.Team },
    { label: 'Timeline', value: details.Timeline },
  ];
  const validDetailItemsCount = detailItems.filter(d => d.value).length;

  return (
    <SimpleGrid columns={{ base: 1, sm: validDetailItemsCount > 1 ? validDetailItemsCount : 1 }} spacingX={8} spacingY={2} mt={4} mb={6} w="full" maxW="2xl" mx="auto">
      {detailItems.map(item => item.value ? (
        <Box key={item.label}>
          <Text fontWeight="semibold" as="span" color="muted.foreground">{item.label}: </Text>
          <Text as="span">{item.value}</Text>
        </Box>
      ) : null)}
      {details.Tools && details.Tools.length > 0 && (
        <Box gridColumn={{sm: `span ${validDetailItemsCount > 0 ? validDetailItemsCount : 1}`}}>
          <Text fontWeight="semibold" as="span" color="muted.foreground">Tools: </Text>
          {/* Added types for tool and index */}
          {details.Tools.map((tool: string, index: number) => (
            <Tag key={index} size="sm" variant="subtle" colorScheme="cyan" mr={1} mb={1}>{tool}</Tag>
          ))}
        </Box>
      )}
      {details.Contributions && details.Contributions.length > 0 && (
         <Box gridColumn={{sm: `span ${validDetailItemsCount > 0 ? validDetailItemsCount : 1}`}} mt={2}>
          <Text fontWeight="semibold" mb={1} color="muted.foreground">Contributions:</Text>
          <UnorderedList stylePosition="inside" spacing={0} ml={0}>
            {/* Added types for contrib and index */}
            {details.Contributions.map((contrib: string, index: number) => (
              <ListItem key={index} fontSize="sm">{contrib}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </SimpleGrid>
  );
};

// Helper function to render activity links
const renderActivityLinks = (activities: ActivityLink[] | undefined) => {
  if (!activities || activities.length === 0) return null;
  return (
    <VStack alignItems="flex-start" spacing={2} mt={4}>
      <Heading as="h4" size="sm" color="muted.foreground">Activities & Outputs:</Heading>
      {activities.map((activity: ActivityLink, index: number) => ( // Typed activity
        activity.href ? (
          <ChakraLink as={NextLink} key={index} href={activity.href} color="blue.500" _hover={{ textDecoration: 'underline' }} fontSize="sm" isExternal={activity.href.startsWith('http')} target={activity.href.startsWith('http') ? "_blank" : undefined} rel={activity.href.startsWith('http') ? "noopener noreferrer" : undefined}>
            {activity.label}
            {activity.href.startsWith('http') && <Icon as={ArrowForwardIcon} boxSize={3} verticalAlign="middle" ml={1}/>}
          </ChakraLink>
        ) : (
          <Text key={index} fontSize="sm">{activity.label}</Text>
        )
      ))}
    </VStack>
  );
};

function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch (e) { return dateString; }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params;
  const [project, allProjectsForNav] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects()
  ]);

  if (!project) {
    notFound();
  }

  let previousProjectLink: PrevNextNavLinkInfo | undefined;
  let nextProjectLink: PrevNextNavLinkInfo | undefined;

  if (allProjectsForNav && allProjectsForNav.length > 0) {
    const currentIndex = allProjectsForNav.findIndex(p => p.slug === project.slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        const prevProject = allProjectsForNav[currentIndex - 1];
        previousProjectLink = { slug: prevProject.slug, title: prevProject.title, categoryLabel: "Previous Project" };
      }
      if (currentIndex < allProjectsForNav.length - 1) {
        const nextProject = allProjectsForNav[currentIndex + 1];
        nextProjectLink = { slug: nextProject.slug, title: nextProject.title, categoryLabel: "Next Project" };
      }
    }
  }

  const { title: projectTableTitle, content } = project;
  const detailContent = content; // Already typed as ProjectDetailContent | null

  return (
    <Layout>
      {detailContent?.hero && (
        <Section id="project-hero" py={{ base: 12, md: 20 }} textAlign="center" bg="gray.50" _dark={{ bg: "gray.800" }}>
          <VStack spacing={4} maxW="3xl" mx="auto">
            <Heading as="h1" size="2xl" color="foreground">
              {detailContent.hero.title || projectTableTitle}
            </Heading>
            {detailContent.hero.problem && <Text fontSize="lg" color="muted.foreground" px={{base: 2, md: 0}}>{detailContent.hero.problem}</Text>}
            {/* Used optional chaining for hero.details */}
            {renderHeroDetails(detailContent.hero?.details)}
            {detailContent.hero.image && (
              <Image src={detailContent.hero.image} alt={detailContent.hero.title || projectTableTitle} mt={8} borderRadius="md" maxH="400px" objectFit="contain" boxShadow="lg" />
            )}
          </VStack>
        </Section>
      )}

      <Section id="project-details" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={12} alignItems="stretch" maxW="container.md" mx="auto">
          {/* Ensure section is typed as SectionContent */}
          {detailContent?.sections?.map((section: SectionContent, index: number) => (
            <Box key={index} as="article">
              <Heading as="h2" size="xl" mb={4} borderBottomWidth="2px" borderColor="primary.500" pb={2}>
                {section.heading}
              </Heading>
              <Text fontSize="lg" lineHeight="tall" whiteSpace="pre-line" mb={section.pullquote || section.image || (section.images && section.images.length > 0) ? 6 : 0}>
                {section.body}
              </Text>

              {section.pullquote && (
                <Box borderLeftWidth="4px" borderColor="blue.500" pl={4} py={2} my={6} fontStyle="italic" bg="blue.50" _dark={{bg: "blue.900"}} rounded="md">
                  <Text fontSize="lg">&quot;{section.pullquote.quote}&quot;</Text>
                  {section.pullquote.attribution && (
                    <Text fontSize="sm" color="muted.foreground" mt={1} textAlign="right">— {section.pullquote.attribution}</Text>
                  )}
                </Box>
              )}

              {section.image && (
                <Image src={section.image} alt={section.heading} borderRadius="md" my={6} maxH="500px" objectFit="contain" mx="auto" boxShadow="md" />
              )}

              {section.images && section.images.length > 0 && (
                <SimpleGrid columns={{ base: 1, md: section.images.length > 1 ? 2 : 1 }} spacing={4} my={6}>
                  {/* Added types for imgUrl and imgIdx */}
                  {section.images.map((imgUrl: string | null, imgIdx: number) => imgUrl ? (
                    <Image key={imgIdx} src={imgUrl} alt={`${section.heading} visual ${imgIdx + 1}`} borderRadius="md" objectFit="cover" boxShadow="sm" />
                  ) : null)}
                </SimpleGrid>
              )}
              {renderActivityLinks(section.activities)}
              {index < (detailContent.sections?.length || 0) -1 && <Divider my={10} />}
            </Box>
          ))}
        </VStack>
      </Section>

      {detailContent?.nextUp?.project?.href && detailContent?.nextUp?.project?.title && (
        <Section id="next-up" py={{ base: 10, md: 16 }} variant="subtle">
          <VStack spacing={4} maxW="container.md" mx="auto" textAlign="center">
            <Heading as="h2" size="xl">{detailContent.nextUp.heading || "Next Up"}</Heading>
            <NextLink href={detailContent.nextUp.project.href.startsWith('/') ? detailContent.nextUp.project.href : `/projects/${detailContent.nextUp.project.href}`} passHref>
              <Box as="a" display="block" p={6} borderWidth="1px" borderRadius="lg" _hover={{shadow: 'md', textDecoration: 'none'}} borderColor="border" w="full" maxW="lg">
                {detailContent.nextUp.project.image && (
                  <Image src={detailContent.nextUp.project.image} alt={detailContent.nextUp.project.title} borderRadius="md" mb={4} maxH="250px" w="full" objectFit="cover" />
                )}
                <Heading as="h3" size="lg" mb={2}>{detailContent.nextUp.project.title}</Heading>
                <Text color="muted.foreground" fontSize="md">{detailContent.nextUp.project.description}</Text>
              </Box>
            </NextLink>
          </VStack>
        </Section>
      )}

      <PrevNextNavigation previousPage={previousProjectLink} nextPage={nextProjectLink} basePath="/projects" />
    </Layout>
  );
}

export async function generateMetadata( { params }: ProjectDetailPageProps, parent: ResolvingMetadata ): Promise<Metadata> {
  const slug = params.slug;
  const project = await getProjectBySlug(slug);
  if (!project) { return { title: 'Project Not Found' }; }

  const pageTitle = project.content?.hero?.title || project.title;
  const description = project.content?.hero?.problem || project.description || `Case study for ${pageTitle}.`;
  const ogImage = project.og_image_url || project.content?.hero?.image || project.featured_image_url;

  return {
    title: `${pageTitle} | Projects | Coriyon's Studio`,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'article',
    },
  };
}