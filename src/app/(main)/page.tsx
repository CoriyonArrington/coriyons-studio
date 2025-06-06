// src/app/(main)/page.tsx

// --- Attempt #5 ---
// Changes:
// 1. Unused 'Box' import from '@chakra-ui/react' has been removed to fix the '@typescript-eslint/no-unused-vars' warning.
// 2. All implicit truthiness checks that were causing '@typescript-eslint/no-unnecessary-condition' errors
//    have been converted to explicit null comparisons (e.g., `if (variable)` becomes `if (variable !== null)`).
//    This applies to the initial `pageData` check and all conditions related to `relatedUxProblem` and `relatedUxSolution`.

import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import Button from '@/src/components/ui/button';
import { Heading, Text } from '@/src/components/typography';
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
  Tag as ChakraTag,
  Image,
  Avatar,
} from '@chakra-ui/react';
import {
  getFeaturedServices, type ServiceData
} from '@/src/lib/data/services';
import type { ServiceContentData } from '@/src/lib/data/services';
import { getFeaturedProjects, type HomepageProject } from '@/src/lib/data/projects';
import { getFeaturedTestimonials, type HomepageTestimonial } from '@/src/lib/data/testimonials';
import { getFeaturedPosts, type PostCardItem, type Tag as PostTag } from '@/src/lib/data/posts';
import {
  getPageBySlug,
  getNavigablePages,
} from '@/src/lib/data/pages';
import type { PageWithRelations, NavigablePageInfo } from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const SLUG = 'home';

// --- TYPE DEFINITIONS ---
interface Cta { text: string; href: string; }
interface HeroSectionContent { headline: string; subheadline: string; cta: Cta; }
interface ContentSectionItemData { headline: string; body_paragraphs?: string[]; body_paragraph?: string; cta?: Cta; subheadline?: string; body_intro_paragraphs?: string[]; body_intro_paragraph?: string; }
interface UxItem { id: string; slug: string; title: string; description: string; icon?: { name?: string | null; icon_library?: string | null } | null; }
interface HomeContent { hero_section: HeroSectionContent; why_our_studio_section: ContentSectionItemData; relatedUxProblems?: UxItem[] | null; relatedUxSolutions?: UxItem[] | null; services_section: ContentSectionItemData & { body_intro_paragraphs?: string[] }; case_studies_section: ContentSectionItemData & { body_intro_paragraph?: string }; testimonials_section: ContentSectionItemData; }
interface UpdatedServiceContentData extends ServiceContentData { cta_text: string; }
// --- END TYPE DEFINITIONS ---


function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateString;
  }
}

interface MappedContentSectionProps { headline: string; body?: string; cta?: string; href?: string; subheadline?: string; }

const DynamicLucideIcon: React.FC<
  { name: string | undefined | null } & Omit<LucideProps, 'ref' | 'children'>
> = ({ name, ...props }) => {
  if (!name) return <LucideIcons.HelpCircle {...props} />;
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[name];

  if (IconComponent && (typeof IconComponent === 'function' || (typeof IconComponent === 'object' && (IconComponent as { $$typeof?: symbol }).$$typeof === Symbol.for('react.forward_ref')))) {
    return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`Lucide icon "${name}" not found for homepage. Rendering fallback 'HelpCircle'.`);
  }
  return <LucideIcons.HelpCircle {...props} />;
};

export default async function HomePage() {
  const pageData: PageWithRelations | null = await getPageBySlug(SLUG);

  // FIX: Converted implicit check to explicit `=== null` comparison to satisfy linter.
  if (pageData === null) {
    return (
      <>
        <Section id="error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Not Found</Heading>
          <Text>We&apos;re sorry, but the page data could not be loaded.</Text>
        </Section>
        <PrevNextNavigation previousPage={undefined} nextPage={undefined} />
      </>
    );
  }

  const navigablePages: NavigablePageInfo[] = await getNavigablePages();

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  const currentPageIndex = navigablePages.findIndex((p) => p.slug === pageData.slug);
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
  
  const {
    hero_section,
    why_our_studio_section,
    relatedUxProblems: contentRelatedUxProblems,
    relatedUxSolutions: contentRelatedUxSolutions,
    services_section,
    case_studies_section,
    testimonials_section,
  } = pageData.content as unknown as HomeContent;

  const relatedUxProblem = contentRelatedUxProblems?.[0] ?? null;
  const relatedUxSolution = contentRelatedUxSolutions?.[0] ?? null;

  const [
    featuredServicesResult,
    featuredProjectsResult,
    featuredTestimonialsResult,
    featuredPostsResult,
  ] = await Promise.all([
    getFeaturedServices(6).then((res) => ({ data: res, error: null })).catch(() => ({ data: [] as ServiceData[], error: 'Error fetching services.' })),
    getFeaturedProjects(3).then((res) => ({ data: res, error: null })).catch(() => ({ data: [] as HomepageProject[], error: 'Error fetching projects.' })),
    getFeaturedTestimonials(6).then((res) => ({ data: res, error: null })).catch(() => ({ data: [] as HomepageTestimonial[], error: 'Error fetching testimonials.' })),
    getFeaturedPosts(3).then((res) => ({ data: res, error: null })).catch(() => ({ data: [] as PostCardItem[], error: 'Error fetching posts.' })),
  ]);

  const featuredServices: ServiceData[] = featuredServicesResult.data || [];
  const serviceFetchError: string | null = featuredServicesResult.error;
  const featuredProjects: HomepageProject[] = featuredProjectsResult.data || [];
  const projectFetchError: string | null = featuredProjectsResult.error;
  const featuredTestimonials: HomepageTestimonial[] = featuredTestimonialsResult.data || [];
  const testimonialFetchError: string | null = featuredTestimonialsResult.error;
  const featuredPosts: PostCardItem[] = featuredPostsResult.data || [];
  const postFetchError: string | null = featuredPostsResult.error;

  const getContentSectionProps = (
    sectionData: ContentSectionItemData | undefined
  ): MappedContentSectionProps => {
    if (!sectionData) {
      return { headline: '', body: undefined, cta: undefined, href: undefined, subheadline: undefined };
    }
    return {
      headline: sectionData.headline,
      body: sectionData.body_paragraphs?.join('\n\n') || sectionData.body_paragraph || undefined,
      cta: sectionData.cta?.text,
      href: sectionData.cta?.href,
      subheadline: sectionData.subheadline,
    };
  };

  const pageContentJSX = (
    <>
      <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
        <VStack spacing={6} maxW="2xl" mx="auto">
          <Heading as="h1" size="3xl" fontWeight="extrabold" color="foreground">{hero_section.headline}</Heading>
          <Text fontSize="xl" color="muted.foreground" maxW="xl">{hero_section.subheadline}</Text>
          <HeroCtaButton href={hero_section.cta.href}>{hero_section.cta.text}</HeroCtaButton>
        </VStack>
      </Section>

      <ContentSection id="why_ux_studio" {...getContentSectionProps(why_our_studio_section)} variant="subtle" ctaRightIcon={true} />
      
      {/* FIX: Converted all related checks to explicit `!== null` comparisons. */}
      {(relatedUxProblem !== null || relatedUxSolution !== null) && (
        <Section id="ux-spotlight" py={{ base: 12, md: 20 }} variant="default">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">Addressing Key UX Challenges</Heading>
            <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">Understanding common pitfalls and effective strategies is key to great user experience.</Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: (relatedUxProblem !== null && relatedUxSolution !== null) ? 2 : 1 }}
            spacing={8}
            maxW="container.lg"
            mx="auto"
          >
            {relatedUxProblem !== null && (
              <UICard variant="outlineFilled" h="full" display="flex" flexDirection="column">
                <UICardHeader>
                  <HStack spacing={3}>
                    {relatedUxProblem.icon?.name && ( <DynamicLucideIcon name={relatedUxProblem.icon.name} size={24} color="var(--chakra-colors-orange-500)"/> )}
                    <UICardHeading size="lg" as="h3">{relatedUxProblem.title}</UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <Text color="muted.foreground" mb={4} noOfLines={3}>{relatedUxProblem.description}</Text>
                </UICardBody>
                <UICardFooter>
                  <NextLink href={`/ux-problems/${relatedUxProblem.slug}`} passHref style={{ width: '100%' }}>
                    <Button variant="outline" size="sm" width="full" colorScheme="gray">Learn More</Button>
                  </NextLink>
                </UICardFooter>
              </UICard>
            )}
            {relatedUxSolution !== null && (
              <UICard variant="outlineFilled" h="full" display="flex" flexDirection="column">
                <UICardHeader>
                  <HStack spacing={3}>
                    {relatedUxSolution.icon?.name && ( <DynamicLucideIcon name={relatedUxSolution.icon.name} size={24} color="var(--chakra-colors-green-500)"/> )}
                    <UICardHeading size="lg" as="h3">{relatedUxSolution.title}</UICardHeading>
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <Text color="muted.foreground" mb={4} noOfLines={3}>{relatedUxSolution.description}</Text>
                </UICardBody>
                <UICardFooter>
                  <NextLink href={`/ux-solutions/${relatedUxSolution.slug}`} passHref style={{ width: '100%' }}>
                    <Button variant="outline" size="sm" width="full" colorScheme="gray">Explore Solution</Button>
                  </NextLink>
                </UICardFooter>
              </UICard>
            )}
          </SimpleGrid>
        </Section>
      )}

      <Section id="dynamic-services" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">{services_section.headline}</Heading>
          {services_section.body_intro_paragraphs?.map((p, i) => ( <Text key={i} fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">{p}</Text> ))}
        </VStack>
        {serviceFetchError ? ( <Text textAlign="center" color="red.500">{serviceFetchError}</Text> ) : featuredServices.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredServices.map((item: ServiceData) => (
              <UICard key={item.id} variant="outline" h="full" display="flex" flexDirection="column">
                {item.featured_image_url && ( <Image src={item.featured_image_url} alt={item.title} borderTopRadius="md" objectFit="cover" h="200px" w="full"/> )}
                <UICardHeader>
                  <HStack justifyContent="space-between" alignItems="center">
                    <UICardHeading size="lg" as="h3">{item.title}</UICardHeading>
                    {item.offering_type === 'BUNDLE' && ( <ChakraTag size="sm" colorScheme="purple">Bundle</ChakraTag> )}
                    {item.offering_type === 'INDIVIDUAL' && ( <ChakraTag size="sm" colorScheme="teal">Service</ChakraTag> )}
                  </HStack>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <UICardText color="muted.foreground" mb={4}>{item.description || 'More details coming soon.'}</UICardText>
                </UICardBody>
                <UICardFooter>
                  <NextLink href={`/services/${item.slug}`} passHref style={{ width: '100%' }}>
                    <Button size="sm" variant="outline" colorScheme="blue" width="full" _hover={{ textDecoration: 'none' }}>
                      {(item.content as UpdatedServiceContentData).cta_text || 'Learn More'}
                    </Button>
                  </NextLink>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : ( <Text textAlign="center" color="muted.foreground">Our services and packages will be listed here soon.</Text> )}
        {services_section.cta && services_section.cta.text && services_section.cta.href && ( <VStack mt={12}><HeroCtaButton href={services_section.cta.href} colorScheme="blue" showIcon={true}>{services_section.cta.text}</HeroCtaButton></VStack> )}
      </Section>

      <Section id="featured-projects" py={{ base: 12, md: 20 }} variant="default">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">{case_studies_section.headline}</Heading>
          {case_studies_section.body_intro_paragraph && ( <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">{case_studies_section.body_intro_paragraph}</Text> )}
        </VStack>
        {projectFetchError ? ( <Text textAlign="center" color="red.500">{projectFetchError}</Text> ) : featuredProjects.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredProjects.map((project: HomepageProject) => (
              <UICard key={project.id} variant="outline" h="full" display="flex" flexDirection="column">
                {project.featured_image_url && ( <Image src={project.featured_image_url} alt={project.title} borderTopRadius="md" objectFit="cover" h="200px" w="full"/> )}
                <UICardHeader>
                  <UICardHeading size="lg" as="h3">{project.title}</UICardHeading>
                  {project.client_name && ( <Text fontSize="sm" color="muted.foreground" mt={1}>Client: {project.client_name}</Text> )}
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  <UICardText color="muted.foreground" mb={4} noOfLines={3}>{project.description || 'Read more about this project.'}</UICardText>
                </UICardBody>
                <UICardFooter>
                  <NextLink href={`/projects/${project.slug}`} passHref style={{ width: '100%' }}>
                    <Button size="sm" variant="solid" colorScheme="blue" width="full" _hover={{ textDecoration: 'none' }}>View Project</Button>
                  </NextLink>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : ( <Text textAlign="center" color="muted.foreground">Our latest projects will be showcased here soon.</Text> )}
        {case_studies_section.cta && case_studies_section.cta.text && case_studies_section.cta.href && ( <VStack mt={12}><HeroCtaButton href={case_studies_section.cta.href} colorScheme="blue" showIcon={true}>{case_studies_section.cta.text}</HeroCtaButton></VStack> )}
      </Section>

      <ContentSection id="testimonials" {...getContentSectionProps(testimonials_section)}>
        {testimonialFetchError ? ( <Text textAlign="center" color="red.500" mt={8}>{testimonialFetchError}</Text> ) : featuredTestimonials.length > 0 ? (
          <>
            <VStack spacing={8} mt={8} alignItems="stretch">
              {featuredTestimonials.map((testimonial: HomepageTestimonial) => (
                <UICard key={testimonial.id} variant="outlineFilled" w="full" maxW="container.md" mx="auto">
                  <UICardBody>
                    {testimonial.avatar_url && ( <Avatar name={testimonial.name} src={testimonial.avatar_url} mb={3} size="md" /> )}
                    <UICardText fontSize="lg" fontStyle="italic" color="foreground">&quot;{testimonial.quote}&quot;</UICardText>
                    <VStack alignItems="flex-end" mt={4} spacing={0}>
                      <Text fontWeight="semibold" color="foreground">— {testimonial.name}</Text>
                      {(testimonial.role || testimonial.company_name) && ( <Text fontSize="sm" color="muted.foreground">{testimonial.role}{testimonial.role && testimonial.company_name ? ', ' : ''}{testimonial.company_name}</Text> )}
                    </VStack>
                  </UICardBody>
                </UICard>
              ))}
            </VStack>
          </>
        ) : ( <Text textAlign="center" color="muted.foreground" mt={8}>Client testimonials will be shared here soon.</Text> )}
      </ContentSection>

      <Section id="featured-blog-posts" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">From Our Blog</Heading>
          <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">Latest articles and insights on UX design and digital health.</Text>
        </VStack>
        {postFetchError ? ( <Text textAlign="center" color="red.500">{postFetchError}</Text> ) : featuredPosts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredPosts.map((post: PostCardItem) => (
              <UICard key={post.id} variant="outline" h="full" display="flex" flexDirection="column" transition="all 0.2s">
                {post.featured_image_url && ( <NextLink href={`/blog/${post.slug}`} passHref><Image src={post.featured_image_url} alt={post.title} borderTopRadius="md" objectFit="cover" h="200px" w="full" cursor="pointer"/></NextLink> )}
                <UICardHeader>
                  <NextLink href={`/blog/${post.slug}`} passHref>
                     <UICardHeading as="h3" size="md" noOfLines={2} cursor="pointer" _hover={{ textDecoration: 'underline' }}>{post.title}</UICardHeading>
                  </NextLink>
                </UICardHeader>
                <UICardBody flexGrow={1}>
                  {post.published_at && ( <Text fontSize="xs" color="muted.foreground" mb={2}>{formatDate(post.published_at)}</Text> )}
                  <UICardText color="muted.foreground" mb={4} noOfLines={3}>{post.excerpt || 'Continue reading.'}</UICardText>
                  {post.tags && post.tags.length > 0 && (
                    <HStack spacing={1.5} wrap="wrap" mt={2}>
                      {post.tags.slice(0, 3).map((tag: PostTag) => ( <ChakraTag key={tag.id} size="xs" variant="solid" colorScheme="purple">{tag.name}</ChakraTag> ))}
                    </HStack>
                  )}
                </UICardBody>
                <UICardFooter>
                  <NextLink href={`/blog/${post.slug}`} passHref>
                    <Button variant="ghost" colorScheme="blue" size="sm" _hover={{ textDecoration: 'none' }}>Read More &rarr;</Button>
                  </NextLink>
                </UICardFooter>
              </UICard>
            ))}
          </SimpleGrid>
        ) : ( <Text textAlign="center" color="muted.foreground">No featured blog posts available yet.</Text> )}
        <VStack mt={12}>
          <HeroCtaButton href="/blog" colorScheme="blue" variant="ghost">View All Posts</HeroCtaButton>
        </VStack>
      </Section>
    </>
  );

  return (
    <>
      {pageContentJSX}
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData: PageWithRelations | null = await getPageBySlug(SLUG);

  // FIX: Using explicit null check here as well for consistency.
  if (pageData === null) {
    return { title: 'Page Not Found | Your Studio', description: 'The requested page could not be found.' };
  }

  const title = pageData.title;
  const description = pageData.meta_description ?? undefined;
  const ogImageUrl = pageData.og_image_url ?? undefined;

  return {
    title,
    description,
    openGraph: { title, description, url: `/`, images: ogImageUrl ? [{ url: ogImageUrl }] : undefined },
  };
}