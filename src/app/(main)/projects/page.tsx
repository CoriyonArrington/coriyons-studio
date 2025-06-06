// src/app/(main)/projects/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
  VStack,
  SimpleGrid,
  Image,
  HStack,
  Tag as ChakraTag,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import {
  UICard,
  UICardHeader,
  UICardBody,
  UICardHeading,
  UICardText,
  UICardFooter,
} from '@/src/components/ui/card';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getAllProjects, type HomepageProject, type Tag } from '@/src/lib/data/projects';
import type { FAQItem, FAQAnswerBlock } from '@/src/lib/data/faqs';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

interface ProjectsPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedFaqs?: FAQItem[];
  [key: string]: any;
}

interface ProjectsPageProps {
  params: {};
}

const SLUG = 'projects';

// Renders FAQ answer blocks
const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const level =
        block.data.level && block.data.level >= 1 && block.data.level <= 6
          ? `h${block.data.level}`
          : 'h3';
      return (
        <Heading as={level as any} size={level === 'h3' ? 'md' : 'sm'} my={3}>
          {block.data.text}
        </Heading>
      );
    }
    case 'paragraph':
      return (
        <Text my={2} lineHeight="tall">
          {block.data.text}
        </Text>
      );
    case 'list': {
      const ListComponent = block.data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={1} my={2} pl={5}>
          {Array.isArray(block.data.items) &&
            block.data.items.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
        </ListComponent>
      );
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported FAQ block type on Projects page: ${block.type}`, block.data);
        return (
          <Box
            as="pre"
            p={2}
            borderWidth="1px"
            my={1}
            borderRadius="md"
            fontSize="xs"
            bg="gray.50"
          >
            <code>{JSON.stringify(block, null, 2)}</code>
          </Box>
        );
      }
      return null;
  }
};

const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {};

export default async function ProjectsPage({ params: _params }: ProjectsPageProps) {
  const pageCmsData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const allProjects = (await getAllProjects()) as HomepageProject[];
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === pageCmsData.slug,
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

  const cmsContent = pageCmsData?.content as ProjectsPageCmsContent | null;
  const relatedFaqs: FAQItem[] | undefined = cmsContent?.relatedFaqs;
  const pageTitle = (pageCmsData?.title as string) || 'Our Work & Case Studies';

  let introContent: React.ReactNode = null;
  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== pageTitle) {
      parts.push(
        <Heading
          key="hero-headline"
          as="h2"
          size="2xl"
          mt={4}
          mb={4}
          textAlign="center"
        >
          {cmsContent.hero.headline}
        </Heading>
      );
    }
    if (cmsContent.intro_text) {
      parts.push(
        <Text
          key="intro-text"
          fontSize="lg"
          color="muted.foreground"
          maxW="2xl"
          textAlign="center"
          mx="auto"
          mb={10}
        >
          {cmsContent.intro_text}
        </Text>
      );
    }
    if (parts.length > 0) {
      introContent = (
        <VStack spacing={4} alignItems="center" mt={4}>
          {parts}
        </VStack>
      );
    }
  }

  if (!pageCmsData && (!allProjects || allProjects.length === 0)) {
    return (
      <Layout>
        <Section id="error-projects" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Projects Page Content Not Found
          </Heading>
          <Text>
            We&apos;re sorry, but the main content for the Projects page could not be
            loaded.
          </Text>
        </Section>
        <PrevNextNavigation
          previousPage={previousPageLink}
          nextPage={nextPageLink}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Section
        id={(pageCmsData?.slug as string) ?? SLUG}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <VStack spacing={8} alignItems="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>
              {pageTitle}
            </Heading>
            {introContent}
          </Box>

          {allProjects && allProjects.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 6, md: 8 }}
              mt={introContent ? 0 : 8}
            >
              {allProjects.map((project: HomepageProject) => (
                <UICard
                  key={project.id}
                  variant="outline"
                  h="full"
                  display="flex"
                  flexDirection="column"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  {project.featured_image_url && (
                    <Image
                      src={project.featured_image_url}
                      alt={project.title}
                      borderTopRadius="md"
                      objectFit="cover"
                      h="200px"
                      w="full"
                    />
                  )}

                  <UICardHeader>
                    <UICardHeading size="lg" as="h3">
                      {project.title}
                    </UICardHeading>
                    {project.client_name && (
                      <Text fontSize="sm" color="muted.foreground" mt={1}>
                        Client: {project.client_name}
                      </Text>
                    )}
                  </UICardHeader>

                  <UICardBody flexGrow={1}>
                    <UICardText color="muted.foreground" mb={3} noOfLines={4}>
                      {project.description || 'Read more about this project.'}
                    </UICardText>
                    {project.tags && project.tags.length > 0 && (
                      <Box>
                        <HStack spacing={2} wrap="wrap">
                          {project.tags.map((tag: Tag) => (
                            <ChakraTag
                              key={tag.id}
                              size="sm"
                              variant="subtle"
                              colorScheme="blue"
                              mb={1}
                            >
                              {tag.name}
                            </ChakraTag>
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </UICardBody>

                  <UICardFooter>
                    <HeroCtaButton
                      href={`/projects/${project.slug}`}
                      size="sm"
                      variant="themedSolid"
                      width="full"
                    >
                      View Project Details
                    </HeroCtaButton>
                  </UICardFooter>
                </UICard>
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="muted.foreground" mt={8}>
              No projects to display at the moment. Please check back soon!
            </Text>
          )}

          {/* Related FAQs Section */}
          {relatedFaqs && relatedFaqs.length > 0 ? (
            <Box mt={16} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Related Questions
              </Heading>
              <Accordion
                allowMultiple
                defaultIndex={relatedFaqs.length > 3 ? [] : [0]}
                maxW="container.md"
                mx="auto"
              >
                {relatedFaqs.map((faq: FAQItem) => (
                  <AccordionItem key={faq.id} mb={2}>
                    <h2>
                      <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                        <Box
                          as="span"
                          flex="1"
                          textAlign="left"
                          fontWeight="semibold"
                          fontSize="lg"
                        >
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      pt={4}
                      borderLeftWidth="1px"
                      borderRightWidth="1px"
                      borderBottomWidth="1px"
                      borderColor="border"
                    >
                      {faq.answer?.blocks && Array.isArray(faq.answer.blocks) ? (
                        faq.answer.blocks.map((block: FAQAnswerBlock, index: number) => (
                          <BlockRenderer
                            key={block.id || `faq-${faq.id}-block-${index}`}
                            block={block}
                          />
                        ))
                      ) : faq.answer?.markdown ? (
                        <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                          {faq.answer.markdown}
                        </ReactMarkdown>
                      ) : (
                        <Text color="muted.foreground">Answer not available.</Text>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          ) : null}
        </VStack>
      </Section>

      <PrevNextNavigation
        previousPage={previousPageLink}
        nextPage={nextPageLink}
      />
    </Layout>
  );
}

export async function generateMetadata({
  params: _params,
}: ProjectsPageProps): Promise<Metadata> {
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const title = (pageData?.title as string) || "Projects & Case Studies | Coriyon's Studio";
  const description =
    (pageData?.meta_description as string) ||
    "Explore the portfolio of UX design projects and case studies by Coriyon's Studio.";

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
