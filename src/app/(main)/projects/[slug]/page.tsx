import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects } from '@/src/lib/data/projects';
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
    VStack,
    HStack,
    Box,
    Heading,
    Text,
    SimpleGrid,
    Tag as ChakraTag,
    Image,
    Link as ChakraLink,
    List,
    ListItem,
    ListIcon,
    UnorderedList,
    Container
} from '@chakra-ui/react';
import { ExternalLinkIcon, CheckCircleIcon } from '@chakra-ui/icons';
import type { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
// FIX: Local types defined here, as they are specific to this component's rendering logic
import type { ProjectService, ProjectContentJson } from '@/src/lib/data/projects';
import PostCard from '@/src/components/common/post-card';
import PrevNextNavigation from '@/src/components/common/prev-next-navigation';

interface ProjectPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Define a more specific type for the 'content' JSON object
interface ProjectPageContent extends ProjectContentJson {
    hero?: {
        title?: string;
        problem?: string;
        details?: {
            Role?: string;
            Timeline?: string;
            Tools?: string[];
            Contributions?: string[];
        };
    };
    sections?: Array<{
        heading: string;
        body: string;
        pullquote?: {
            quote: string;
            attribution?: string;
        };
        image?: string;
        images?: string[];
        activities?: Array<{
            label: string;
            href?: string;
        }>;
    }>
}

// Helper component for rendering an image with a caption
const ContentImage = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <Box as="figure">
    <Image src={src} alt={alt} borderRadius="md" objectFit="cover" w="full" />
    {caption && <Text as="figcaption" mt={2} fontSize="sm" color="muted.foreground" textAlign="center">{caption}</Text>}
  </Box>
);

// Main component for the project detail page
export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);
  const allProjects = await getAllProjects();

  if (!project) {
    notFound();
  }

  const currentProjectIndex = allProjects.findIndex(p => p.slug === params.slug);
  const nextProject = currentProjectIndex !== -1 && currentProjectIndex < allProjects.length - 1
    ? allProjects[currentProjectIndex + 1]
    : null;
    
  // FIX: Cast the unknown content to our specific page content type
  const pageContent = project.content as ProjectPageContent | null;
  const hero = pageContent?.hero;
  const sections = pageContent?.sections || [];
  const relatedServices = project.services || [];

  return (
    <Layout>
      <Box as="header" bg="background.subtle" py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 12 }} alignItems="center">
            <VStack spacing={6} alignItems="flex-start">
              <Heading as="h1" size="3xl" fontWeight="extrabold">{hero?.title || project.title}</Heading>
              {hero?.problem && <Text fontSize="xl" color="muted.foreground">{hero.problem}</Text>}
            </VStack>

            <Box bg="background.default" p={8} borderRadius="lg" shadow="md">
              <VStack spacing={6} align="stretch">
                {hero?.details?.Role && <HStack><Text fontWeight="bold" minW="80px">Role:</Text><Text>{hero.details.Role}</Text></HStack>}
                {hero?.details?.Timeline && <HStack><Text fontWeight="bold" minW="80px">Timeline:</Text><Text>{hero.details.Timeline}</Text></HStack>}
                {hero?.details?.Tools && (
                  <HStack align="start">
                    <Text fontWeight="bold" minW="80px" mt={1}>Tools:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {hero.details.Tools.map((tool: string) => <ChakraTag key={tool} variant="solid" colorScheme="blue">{tool}</ChakraTag>)}
                    </HStack>
                  </HStack>
                )}
                {hero?.details?.Contributions && (
                  <VStack align="stretch" spacing={3}>
                    <Text fontWeight="bold">My Contributions:</Text>
                    <List spacing={2}>
                      {hero.details.Contributions.map((item: string) => (
                        <ListItem key={item} display="flex" alignItems="center">
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                )}
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Section id="project-details" py={{ base: 16, md: 24 }}>
        <VStack spacing={{ base: 16, md: 24 }} maxW="container.md" mx="auto">
          {sections.map((section, i: number) => (
            <VStack key={`section-${String(i)}`} spacing={6} align="stretch" w="full">
              <Heading as="h2" size="xl">{section.heading}</Heading>
              <Text whiteSpace="pre-wrap" lineHeight="tall">{section.body}</Text>

              {section.pullquote && (
                <Box as="blockquote" borderLeft="4px" borderColor="blue.500" pl={6} py={2} my={6}>
                  <Text fontSize="xl" fontStyle="italic">&quot;{section.pullquote.quote}&quot;</Text>
                  {section.pullquote.attribution && <Text mt={2} textAlign="right" color="muted.foreground">— {section.pullquote.attribution}</Text>}
                </Box>
              )}

              {section.image && <ContentImage src={section.image} alt={`${section.heading} main visual`} />}
              
              {section.images && section.images.length > 0 && (
                <SimpleGrid columns={section.images.length > 1 ? 2 : 1} spacing={4} mt={6}>
                  {section.images.map((image: string, index: number) => (
                    image && <ContentImage key={`img-${String(index)}`} src={image} alt={`${section.heading} visual ${String(index + 1)}`} />
                  ))}
                </SimpleGrid>
              )}

              {section.activities && (
                <Box>
                  <Text fontWeight="bold" mb={3}>Key Activities & Links:</Text>
                  <UnorderedList spacing={2}>
                    {section.activities.map((activity: {label: string, href?: string}) => (
                      <ListItem key={activity.label}>
                        {activity.href ? (
                          <ChakraLink href={activity.href} isExternal color="blue.500">
                            {activity.label} <ExternalLinkIcon mx="2px" />
                          </ChakraLink>
                        ) : (
                          activity.label
                        )}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              )}
            </VStack>
          ))}
        </VStack>
      </Section>
      
      {relatedServices.length > 0 && (
        <Section id="related-services" py={{ base: 16, md: 24 }} variant="subtle">
          <Heading as="h2" size="2xl" textAlign="center" mb={12}>Services Used in This Project</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: Math.min(3, relatedServices.length) }} spacing={{ base: 6, md: 8 }}>
            {relatedServices.map((service: ProjectService) => (
              <PostCard
                key={service.id}
                href={`/services/${service.slug}`}
                title={service.title}
                description={null}
                tags={service.icon ? [{ id: service.id, name: 'Service' }] : []}
                tagColorScheme={'teal'}
              />
            ))}
          </SimpleGrid>
        </Section>
      )}

      {nextProject && (
          <Section id="next-up" py={{ base: 16, md: 24 }}>
              <VStack spacing={8} alignItems="center">
                  <Heading as="h3" size="lg" color="muted.foreground" fontWeight="medium">Next Up</Heading>
                  <Box textAlign="center">
                      <Heading as="h2" size="2xl">{nextProject.title}</Heading>
                      <Text mt={4} maxW="lg">{nextProject.description}</Text>
                  </Box>
                  <Box w="full" maxW="container.md">
                    <PostCard
                      href={`/projects/${nextProject.slug}`}
                      title={nextProject.title}
                      description={nextProject.description}
                      imageUrl={nextProject.featured_image?.image_url}
                      tags={[]}
                      tagColorScheme="blue"
                      ctaText="View Next Project"
                    />
                  </Box>
              </VStack>
          </Section>
      )}

      <PrevNextNavigation previousPage={undefined} nextPage={nextProject ? { slug: nextProject.slug, title: nextProject.title, categoryLabel: 'Project' } : undefined} />
    </Layout>
  );
}

export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: "The project you are looking for does not exist.",
    };
  }

  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];
  
  const title = `${project.title} | Case Study`;
  const description = project.description || 'Explore this detailed UX design and development case study from Coriyon\'s Studio.';
  const ogImage = project.featured_image?.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/projects/${project.slug}`,
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  };
}