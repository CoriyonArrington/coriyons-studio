// src/app/(main)/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { Heading, Text, type TextAsValues } from '@/src/components/typography';
import {
  UICard,
  UICardHeader,
  UICardBody,
  UICardHeading,
  UICardText,
  UICardFooter,
} from '@/src/components/ui/card';
import {
  VStack,
  SimpleGrid,
  HStack,
  Box,
  Tag as ChakraTag,
  Image,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import { getFeaturedServices, type ServiceData, type ServiceContentData } from '@/src/lib/data/services';
import { getFeaturedProjects, type HomepageProject } from '@/src/lib/data/projects';
import { getFeaturedTestimonials, type HomepageTestimonial } from '@/src/lib/data/testimonials';
import { getFeaturedPosts, type PostCardItem, type Tag as PostTag } from '@/src/lib/data/posts';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import type { FAQItem, FAQAnswerBlock } from '@/src/lib/data/faqs';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { PageRow } from '@/src/lib/data/minimal_pages_schema';

const SLUG = 'home';

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

interface ProcessStepItemHomePage {
  title: string;
  description: string;
  [key: string]: any;
}

interface FinalCtaItemHomePage {
  text: string;
  href?: string;
  [key: string]: any;
}

interface MappedContentSectionProps {
  headline: string;
  body?: string;
  cta?: string;
  href?: string;
  subheadline?: string;
}

const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
  if (!name) {
    return <LucideIcons.HelpCircle {...props} />;
  }
  const IconComponent = (LucideIcons as any)[name];
  if (
    IconComponent &&
    (typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' && IconComponent.$$typeof === Symbol.for('react.forward_ref')))
  ) {
    return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Lucide icon "${name}" not found for homepage. Rendering fallback 'HelpCircle'.`);
  }
  return <LucideIcons.HelpCircle {...props} />;
};

const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const level =
        block.data.level && block.data.level >= 1 && block.data.level <= 6 ? `h${block.data.level}` : 'h3';
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
        console.warn(`Unsupported FAQ answer block type on Home page: ${block.type}`, block.data);
      }
      return null;
  }
};

const MarkdownComponentsForFAQ = {};

export default async function HomePage() {
  // Cast the fetched page row so TypeScript knows its fields are strings/known types
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  const navigablePages = (await getNavigablePages()) as NavigablePageInfo[];

  const [
    featuredServicesResult,
    featuredProjectsResult,
    featuredTestimonialsResult,
    featuredPostsResult,
  ] = await Promise.all([
    getFeaturedServices(6)
      .then((res) => ({ data: res, error: null }))
      .catch(() => ({ data: [] as ServiceData[], error: 'Error fetching services.' })),
    getFeaturedProjects(3)
      .then((res) => ({ data: res, error: null }))
      .catch(() => ({ data: [] as HomepageProject[], error: 'Error fetching projects.' })),
    getFeaturedTestimonials(6)
      .then((res) => ({ data: res, error: null }))
      .catch(() => ({ data: [] as HomepageTestimonial[], error: 'Error fetching testimonials.' })),
    getFeaturedPosts(3)
      .then((res) => ({ data: res, error: null }))
      .catch(() => ({ data: [] as PostCardItem[], error: 'Error fetching posts.' })),
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;
  if (pageData && navigablePages) {
    const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageData.slug);
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

  if (!pageData || !pageData.content) {
    return (
      <Layout>
        <Section id="error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Page Content Not Found
          </Heading>
          <Text>We&apos;re sorry, but the content for the homepage could not be loaded.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  // Cast content into a generic object since specific types were not provided
  const homeContent = pageData.content as any;

  const relatedUxProblem = homeContent.relatedUxProblems?.[0] ?? null;
  const relatedUxSolution = homeContent.relatedUxSolutions?.[0] ?? null;
  const relatedFaqs: FAQItem[] | undefined = homeContent.relatedFaqs;

  const featuredServices: ServiceData[] = featuredServicesResult.data || [];
  const serviceFetchError: string | null = featuredServicesResult.error;
  const featuredProjects: HomepageProject[] = featuredProjectsResult.data || [];
  const projectFetchError: string | null = featuredProjectsResult.error;
  const featuredTestimonials: HomepageTestimonial[] = featuredTestimonialsResult.data || [];
  const testimonialFetchError: string | null = featuredTestimonialsResult.error;
  const featuredPosts: PostCardItem[] = featuredPostsResult.data || [];
  const postFetchError: string | null = featuredPostsResult.error;

  const getContentSectionProps = (
    sectionData: any | undefined
  ): MappedContentSectionProps => {
    if (!sectionData) {
      return {
        headline: '',
        body: undefined,
        cta: undefined,
        href: undefined,
        subheadline: undefined,
      };
    }
    return {
      headline: sectionData.headline || '',
      body:
        sectionData.body_paragraphs?.join('\n\n') ||
        sectionData.body_paragraph ||
        undefined,
      cta: sectionData.cta?.text,
      href: sectionData.cta?.href,
      subheadline: sectionData.subheadline,
    };
  };

  const pageContentJSX = (
    <>
      {/* Hero Section */}
      {homeContent.hero_section && (
        <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
          <VStack spacing={6} maxW="2xl" mx="auto">
            {homeContent.hero_section.headline && (
              <Heading as="h1" size="3xl" fontWeight="extrabold" color="foreground">
                {homeContent.hero_section.headline}
              </Heading>
            )}
            {homeContent.hero_section.subheadline && (
              <Text fontSize="xl" color="muted.foreground" maxW="xl">
                {homeContent.hero_section.subheadline}
              </Text>
            )}
            {homeContent.hero_section.cta?.text && homeContent.hero_section.cta.href && (
              <HeroCtaButton href={homeContent.hero_section.cta.href}>
                {homeContent.hero_section.cta.text}
              </HeroCtaButton>
            )}
          </VStack>
        </Section>
      )}

      {/* Why Our Studio Section */}
      {homeContent.why_our_studio_section && (
        <ContentSection
          id="why_ux_studio"
          {...getContentSectionProps(homeContent.why_our_studio_section)}
          variant="subtle"
          ctaRightIcon={true}
        />
      )}

      {/* Spotlight UX Problem & Solution Section */}
      {(relatedUxProblem || relatedUxSolution) && (
        <Section id="ux-spotlight" py={{ base: 12, md: 20 }} variant="default">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">
              Addressing Key UX Challenges
            </Heading>
            <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
              Understanding common pitfalls and effective strategies is key to great user
              experience.
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: relatedUxProblem && relatedUxSolution ? 2 : 1 }}
            spacing={8}
            maxW="container.lg"
            mx="auto"
          >
            {relatedUxProblem && (
              <UICard variant="outlineFilled" h="full" display="flex" flexDirection="column">
                <UICardHeader>
                  <HStack spacing={3}>
                    {relatedUxProblem.icon && (
                      <DynamicLucideIcon
                        name={relatedUxProblem.icon.name}
                        size={24}
                        color="var(--chakra-colors-orange-500)"
                      />
                    )}
                    <UICardHeading size="lg" as="h3">
                      {relatedUxProblem.title}
                    </UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <Text color="muted.foreground" mb={4} noOfLines={3}>
                    {relatedUxProblem.description}
                  </Text>
                </UICardBody>
                <UICardFooter>
                  <HeroCtaButton
                    href={`/ux-problems/${relatedUxProblem.slug}`}
                    variant="outline"
                    size="sm"
                    width="full"
                  >
                    Learn More
                  </HeroCtaButton>
                </UICardFooter>
              </UICard>
            )}
            {relatedUxSolution && (
              <UICard variant="outlineFilled" h="full" display="flex" flexDirection="column">
                <UICardHeader>
                  <HStack spacing={3}>
                    {relatedUxSolution.icon && (
                      <DynamicLucideIcon
                        name={relatedUxSolution.icon.name}
                        size={24}
                        color="var(--chakra-colors-green-500)"
                      />
                    )}
                    <UICardHeading size="lg" as="h3">
                      {relatedUxSolution.title}
                    </UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <Text color="muted.foreground" mb={4} noOfLines={3}>
                    {relatedUxSolution.description}
                  </Text>
                </UICardBody>
                <UICardFooter>
                  <HeroCtaButton
                    href={`/ux-solutions/${relatedUxSolution.slug}`}
                    variant="outline"
                    size="sm"
                    width="full"
                  >
                    Explore Solution
                  </HeroCtaButton>
                </UICardFooter>
              </UICard>
            )}
          </SimpleGrid>
        </Section>
      )}

      {/* Featured Services Section */}
      {homeContent.services_section && (
        <Section id="dynamic-services" py={{ base: 12, md: 20 }} variant="subtle">
          <VStack spacing={4} mb={12} textAlign="center">
            {homeContent.services_section.headline && (
              <Heading as="h2" size="2xl" color="foreground">
                {homeContent.services_section.headline}
              </Heading>
            )}
            {homeContent.services_section.body_intro_paragraphs?.map(
              (paragraph: string, index: number) => (
                <Text key={index} fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
                  {paragraph}
                </Text>
              )
            )}
          </VStack>
          {serviceFetchError ? (
            <Text textAlign="center" color="red.500">
              {serviceFetchError}
            </Text>
          ) : featuredServices.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
              {featuredServices.map((item: ServiceData) => (
                <NextLink key={item.id} href={`/services/${item.slug}`} passHref legacyBehavior>
                  <UICard
                    as="a"
                    variant="outline"
                    h="full"
                    display="flex"
                    flexDirection="column"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    {item.featured_image_url && (
                      <Image
                        src={item.featured_image_url}
                        alt={item.title}
                        borderTopRadius="md"
                        objectFit="cover"
                        h="200px"
                        w="full"
                      />
                    )}
                    <UICardHeader>
                      <HStack justifyContent="space-between" alignItems="center">
                        <UICardHeading size="lg" as="h3">
                          {item.title}
                        </UICardHeading>
                        {item.offering_type === 'BUNDLE' && (
                          <ChakraTag size="sm" colorScheme="purple">
                            Bundle
                          </ChakraTag>
                        )}
                        {item.offering_type === 'INDIVIDUAL' && (
                          <ChakraTag size="sm" colorScheme="teal">
                            Service
                          </ChakraTag>
                        )}
                      </HStack>
                    </UICardHeader>
                    <UICardBody flexGrow={1}>
                      <UICardText color="muted.foreground" mb={4}>
                        {item.description || 'More details coming soon.'}
                      </UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton
                        href={`/services/${item.slug}`}
                        size="sm"
                        variant="themedOutline"
                        width="full"
                      >
                        {(item.content as ServiceContentData)?.cta_text || 'Learn More'}
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                </NextLink>
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="muted.foreground">
              Our services and packages will be listed here soon.
            </Text>
          )}
          {homeContent.services_section.cta?.text && homeContent.services_section.cta.href && (
            <VStack mt={12}>
              <HeroCtaButton href={homeContent.services_section.cta.href} colorScheme="blue" showIcon={true}>
                {homeContent.services_section.cta.text}
              </HeroCtaButton>
            </VStack>
          )}
        </Section>
      )}

      {/* Featured Projects Section */}
      {homeContent.case_studies_section && (
        <Section id="featured-projects" py={{ base: 12, md: 20 }} variant="default">
          <VStack spacing={4} mb={12} textAlign="center">
            {homeContent.case_studies_section.headline && (
              <Heading as="h2" size="2xl" color="foreground">
                {homeContent.case_studies_section.headline}
              </Heading>
            )}
            {homeContent.case_studies_section.body_intro_paragraph && (
              <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
                {homeContent.case_studies_section.body_intro_paragraph}
              </Text>
            )}
          </VStack>
          {projectFetchError ? (
            <Text textAlign="center" color="red.500">
              {projectFetchError}
            </Text>
          ) : featuredProjects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
              {featuredProjects.map((project: HomepageProject) => (
                <NextLink key={project.id} href={`/projects/${project.slug}`} passHref legacyBehavior>
                  <UICard
                    as="a"
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
                      <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                        {project.description || 'Read more about this project.'}
                      </UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/projects/${project.slug}`} size="sm" variant="themedSolid" width="full">
                        View Project
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                </NextLink>
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="muted.foreground">
              Our latest projects will be showcased here soon.
            </Text>
          )}
          {homeContent.case_studies_section.cta?.text && homeContent.case_studies_section.cta.href && (
            <VStack mt={12}>
              <HeroCtaButton href={homeContent.case_studies_section.cta.href} colorScheme="blue" showIcon={true}>
                {homeContent.case_studies_section.cta.text}
              </HeroCtaButton>
            </VStack>
          )}
        </Section>
      )}

      {/* Testimonials Section */}
      {homeContent.testimonials_section && (
        <ContentSection id="testimonials" {...getContentSectionProps(homeContent.testimonials_section)}>
          {testimonialFetchError ? (
            <Text textAlign="center" color="red.500" mt={8}>
              {testimonialFetchError}
            </Text>
          ) : featuredTestimonials.length > 0 ? (
            <>
              <VStack spacing={8} mt={8} alignItems="stretch">
                {featuredTestimonials.map((testimonial: HomepageTestimonial) => (
                  <UICard key={testimonial.id} variant="outlineFilled" w="full" maxW="container.md" mx="auto">
                    <UICardBody>
                      {testimonial.avatar_url && (
                        <Avatar name={testimonial.name} src={testimonial.avatar_url} mb={3} size="md" />
                      )}
                      <UICardText fontSize="lg" fontStyle="italic" color="foreground">
                        &quot;{testimonial.quote}&quot;
                      </UICardText>
                      <VStack alignItems="flex-end" mt={4} spacing={0}>
                        <Text fontWeight="semibold" color="foreground">
                          — {testimonial.name}
                        </Text>
                        {(testimonial.role || testimonial.company_name) && (
                          <Text fontSize="sm" color="muted.foreground">
                            {testimonial.role}
                            {testimonial.role && testimonial.company_name && ', '}
                            {testimonial.company_name}
                          </Text>
                        )}
                      </VStack>
                    </UICardBody>
                  </UICard>
                ))}
              </VStack>
              <VStack mt={10}>
                <HeroCtaButton href="/testimonials" variant="outline" colorScheme="gray">
                  View All Testimonials
                </HeroCtaButton>
              </VStack>
            </>
          ) : (
            <Text textAlign="center" color="muted.foreground" mt={8}>
              Client testimonials will be shared here soon.
            </Text>
          )}
        </ContentSection>
      )}

      {/* Featured Blog Posts Section */}
      <Section id="featured-blog-posts" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">
            From Our Blog
          </Heading>
          <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
            Latest articles and insights on UX design and digital health.
          </Text>
        </VStack>
        {postFetchError ? (
          <Text textAlign="center" color="red.500">
            {postFetchError}
          </Text>
        ) : featuredPosts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredPosts.map((post: PostCardItem) => (
              <NextLink key={post.id} href={`/blog/${post.slug}`} passHref legacyBehavior>
                <UICard
                  as="a"
                  variant="outline"
                  h="full"
                  display="flex"
                  flexDirection="column"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)', textDecoration: 'none' }}
                  transition="all 0.2s"
                >
                  {post.featured_image_url && (
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      borderTopRadius="md"
                      objectFit="cover"
                      h="200px"
                      w="full"
                    />
                  )}
                  <UICardHeader>
                    <UICardHeading size="md" as="h3" noOfLines={2}>
                      {post.title}
                    </UICardHeading>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    {post.published_at && (
                      <Text fontSize="xs" color="muted.foreground" mb={2}>
                        {formatDate(post.published_at)}
                      </Text>
                    )}
                    <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                      {post.excerpt || 'Continue reading...'}
                    </UICardText>
                    {post.tags && post.tags.length > 0 && (
                      <HStack spacing={1.5} wrap="wrap" mt={2}>
                        {post.tags.slice(0, 3).map((tag: PostTag) => (
                          <ChakraTag key={tag.id} size="xs" variant="solid" colorScheme="purple">
                            {tag.name}
                          </ChakraTag>
                        ))}
                      </HStack>
                    )}
                  </UICardBody>
                  <UICardFooter>
                    <Text fontSize="sm" color="blue.500" fontWeight="medium">
                      Read More &rarr;
                    </Text>
                  </UICardFooter>
                </UICard>
              </NextLink>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground">
            No featured blog posts available yet.
          </Text>
        )}
        <VStack mt={12}>
          <HeroCtaButton href="/blog" colorScheme="blue" variant="ghost">
            View All Posts
          </HeroCtaButton>
        </VStack>
      </Section>

      {/* Process Section */}
      {homeContent.process_section && (
        <ContentSection
          id="process"
          {...getContentSectionProps(homeContent.process_section)}
          ctaRightIcon={true}
        >
          {homeContent.process_section.steps && (
            <SimpleGrid
              columns={{
                base: 1,
                md:
                  homeContent.process_section.steps.length > 3
                    ? 3
                    : homeContent.process_section.steps.length,
              }}
              spacing={6}
              mt={8}
              w="full"
            >
              {homeContent.process_section.steps.map(
                (step: ProcessStepItemHomePage, index: number) => (
                  <UICard key={index} variant="subtle" h="full">
                    <UICardHeader>
                      <UICardHeading as="h4" size="md">
                        {step.title}
                      </UICardHeading>
                    </UICardHeader>
                    <UICardBody>
                      <UICardText>{step.description}</UICardText>
                    </UICardBody>
                  </UICard>
                )
              )}
            </SimpleGrid>
          )}
          {homeContent.process_section.body_outro_paragraph && (
            <Text mt={8}>{homeContent.process_section.body_outro_paragraph}</Text>
          )}
        </ContentSection>
      )}

      {/* About Section */}
      {homeContent.about_section && (
        <ContentSection
          id="about-homepage"
          {...getContentSectionProps(homeContent.about_section)}
          variant="subtle"
          ctaRightIcon={true}
        >
          <VStack
            as="ul"
            spacing={2}
            mt={8}
            alignItems="flex-start"
            sx={{ listStyleType: 'none' }}
            pl={0}
          >
            {homeContent.about_section.points?.map((point: string, index: number) => (
              <Text as={'li' as TextAsValues} key={index} display="flex" alignItems="center">
                {point}
              </Text>
            ))}
          </VStack>
          {homeContent.about_section.body_outro_paragraph && (
            <Text mt={8}>{homeContent.about_section.body_outro_paragraph}</Text>
          )}
        </ContentSection>
      )}

      {/* Related FAQs Section */}
      {relatedFaqs && relatedFaqs.length > 0 && (
        <Section id="home-faqs" py={{ base: 12, md: 20 }} variant="default">
          <VStack spacing={4} mb={10} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">
              Quick Answers
            </Heading>
          </VStack>
          <Accordion allowMultiple defaultIndex={relatedFaqs.length === 1 ? [0] : []} maxW="container.md" mx="auto">
            {relatedFaqs.map((faq: FAQItem) => (
              <AccordionItem key={faq.id} mb={2}>
                <h2>
                  <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="lg">
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
                      <BlockRenderer key={block.id || `faq-home-${faq.id}-block-${index}`} block={block} />
                    ))
                  ) : faq.answer?.markdown ? (
                    <ReactMarkdown components={MarkdownComponentsForFAQ} remarkPlugins={[remarkGfm]}>
                      {faq.answer.markdown}
                    </ReactMarkdown>
                  ) : (
                    <Text color="muted.foreground">Answer not available.</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <VStack mt={10}>
            <HeroCtaButton href="/faq" variant="outline" colorScheme="gray">
              View All FAQs
            </HeroCtaButton>
          </VStack>
        </Section>
      )}

      {/* Final CTA Section */}
      {homeContent.final_cta_section && (
        <Section id="final_cta" variant="inverse" py={{ base: 16, md: 24 }} textAlign="center">
          <VStack spacing={6} maxW="xl" mx="auto">
            {homeContent.final_cta_section.headline && (
              <Heading as="h2" size="2xl">
                {homeContent.final_cta_section.headline}
              </Heading>
            )}
            {homeContent.final_cta_section.body_paragraph && (
              <Text fontSize="lg" opacity={0.9}>
                {homeContent.final_cta_section.body_paragraph}
              </Text>
            )}
            <HStack spacing={4} mt={4}>
              {homeContent.final_cta_section.ctas?.map(
                (cta_item: FinalCtaItemHomePage, index: number) =>
                  cta_item.text && cta_item.href ? (
                    <HeroCtaButton key={index} href={cta_item.href} colorScheme="gray" variant="solid">
                      {cta_item.text}
                    </HeroCtaButton>
                  ) : null
              )}
            </HStack>
          </VStack>
        </Section>
      )}
    </>
  );

  return (
    <Layout>
      {pageContentJSX}
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = (await getPageContentBySlug(SLUG)) as PageRow | null;
  if (!pageData) {
    return { title: 'Coriyon’s Studio | Digital Health UX & Design' };
  }
  const title = pageData.title;
  const description = pageData.meta_description ?? undefined;
  const ogImageUrl = pageData.og_image_url ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}
