// ATTEMPT 5: Final cleanup.
// - Removed the unused 'UxItem' interface definition.

import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import PostCard from '@/src/components/common/post-card';
import FeatureCard from '@/src/components/common/featured-card';
import {
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Avatar,
  Box,
} from '@chakra-ui/react';
import { getFeaturedServices } from '@/src/lib/data/services';
import { getFeaturedProjects } from '@/src/lib/data/projects';
import { getFeaturedTestimonials } from '@/src/lib/data/testimonials';
import { getFeaturedPosts } from '@/src/lib/data/posts';
import { getPageBySlug, getNavigablePages } from '@/src/lib/data/pages';
import type { PageWithRelations, NavigablePageInfo } from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';

const SLUG = 'home';

// --- (Local Interfaces) ---
interface Cta { text: string; href: string; }
interface HeroSectionContent { headline: string; subheadline: string; cta: Cta; }
interface ContentSectionItemData { headline: string; body_paragraphs?: string[]; cta?: Cta; body_intro_paragraph?: string; }
// FIX: Removed unused UxItem interface.
interface HomeContent {
  hero_section: HeroSectionContent;
  why_our_studio_section: ContentSectionItemData;
  services_section: ContentSectionItemData;
  case_studies_section: ContentSectionItemData;
  testimonials_section: ContentSectionItemData;
}

interface MappedContentSectionProps { headline: string; body?: string; cta?: string; href?: string; }

export default async function HomePage() {
  const pageData: PageWithRelations | null = await getPageBySlug(SLUG);

  if (pageData === null) {
    return (
      <Section id="error" py={{ base: 16, md: 24 }} textAlign="center">
        <Heading as="h1" size="2xl">Page Not Found</Heading>
        <Text>We&apos;re sorry, but the page data could not be loaded.</Text>
      </Section>
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
    services_section,
    case_studies_section,
    testimonials_section,
  } = pageData.content as unknown as HomeContent;
  
  const relatedUxProblems = Array.isArray(pageData.ux_problems) ? pageData.ux_problems : [pageData.ux_problems].filter(Boolean);
  const relatedUxSolutions = Array.isArray(pageData.ux_solutions) ? pageData.ux_solutions : [pageData.ux_solutions].filter(Boolean);
  
  const featuredUxProblem = relatedUxProblems[0] ?? null;
  const featuredUxSolution = relatedUxSolutions[0] ?? null;

  const [
    featuredServices,
    featuredProjects,
    featuredTestimonials,
    featuredPosts,
  ] = await Promise.all([
    getFeaturedServices(3),
    getFeaturedProjects(3),
    getFeaturedTestimonials(3),
    getFeaturedPosts(3),
  ]);

  const getContentSectionProps = (sectionData: ContentSectionItemData | undefined): MappedContentSectionProps => {
    if (!sectionData) return { headline: '', body: undefined, cta: undefined, href: undefined };
    return {
      headline: sectionData.headline,
      body: sectionData.body_paragraphs?.join('\n\n'),
      cta: sectionData.cta?.text,
      href: sectionData.cta?.href,
    };
  };

  return (
    <>
      <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
        <VStack spacing={6} maxW="2xl" mx="auto">
          <Heading as="h1" size="3xl" fontWeight="extrabold">{hero_section.headline}</Heading>
          <Text fontSize="xl" color="muted.foreground" maxW="xl">{hero_section.subheadline}</Text>
          <HeroCtaButton href={hero_section.cta.href}>{hero_section.cta.text}</HeroCtaButton>
        </VStack>
      </Section>

      <ContentSection id="why_our_studio" {...getContentSectionProps(why_our_studio_section)} variant="subtle" ctaRightIcon>
        {(featuredUxProblem || featuredUxSolution) && (
          <Box mt={12} w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {featuredUxProblem && (
                <FeatureCard
                  href={`/ux-problems/${featuredUxProblem.slug}`}
                  iconName={featuredUxProblem.icons?.[0]?.name}
                  iconColor="orange.500"
                  title={featuredUxProblem.title}
                  description={featuredUxProblem.description}
                />
              )}
              {featuredUxSolution && (
                <FeatureCard
                  href={`/ux-solutions/${featuredUxSolution.slug}`}
                  iconName={featuredUxSolution.icons?.[0]?.name}
                  iconColor="green.500"
                  title={featuredUxSolution.title}
                  description={featuredUxSolution.description}
                />
              )}
            </SimpleGrid>
          </Box>
        )}
      </ContentSection>
      
      <Section id="featured-services" py={{ base: 12, md: 20 }}>
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">{services_section.headline}</Heading>
          </VStack>
           <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredServices.map((service) => (
                <PostCard
                    key={service.id}
                    href={`/services/${service.slug}`}
                    title={service.title}
                    description={service.description}
                    imageUrl={service.featured_image_url}
                    tags={service.offering_type ? [{ id: service.offering_type, name: service.offering_type }] : []}
                    tagColorScheme={service.offering_type === 'BUNDLE' ? 'purple' : 'teal'}
                    ctaText="Book Bundle Now"
                />
            ))}
           </SimpleGrid>
            {services_section.cta?.text && (
                <VStack mt={12}>
                    <HeroCtaButton href={services_section.cta.href || '#'}>{services_section.cta.text}</HeroCtaButton>
                </VStack>
            )}
      </Section>

      <Section id="featured-projects" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">{case_studies_section.headline}</Heading>
          {case_studies_section.body_intro_paragraph && ( <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">{case_studies_section.body_intro_paragraph}</Text> )}
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {featuredProjects.map((project) => (
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
        {case_studies_section.cta?.text && ( <VStack mt={12}><HeroCtaButton href={case_studies_section.cta.href || '#'}>{case_studies_section.cta.text}</HeroCtaButton></VStack> )}
      </Section>

      <ContentSection id="testimonials" {...getContentSectionProps(testimonials_section)}>
        <VStack spacing={8} mt={8} alignItems="stretch">
          {featuredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} variant="outline" w="full" maxW="container.md" mx="auto">
              <CardBody>
                {testimonial.avatar_url && ( <Avatar name={testimonial.name} src={testimonial.avatar_url} mb={3} size="md" /> )}
                <Text fontSize="lg" fontStyle="italic" color="foreground">&quot;{testimonial.quote}&quot;</Text>
                <VStack alignItems="flex-end" mt={4} spacing={0}>
                  <Text fontWeight="semibold" color="foreground">— {testimonial.name}</Text>
                  {(testimonial.role || testimonial.company_name) && ( <Text fontSize="sm" color="muted.foreground">{testimonial.role}{testimonial.role && testimonial.company_name ? ', ' : ''}{testimonial.company_name}</Text> )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </ContentSection>

      <Section id="featured-blog-posts" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">From Our Blog</Heading>
          <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">Latest articles and insights on UX design and digital health.</Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {featuredPosts.map((post) => (
            <PostCard
              key={post.id}
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.excerpt}
              imageUrl={post.featured_image_url}
              tags={post.tags}
              tagColorScheme="orange"
              ctaText="Read More"
            />
          ))}
        </SimpleGrid>
        <VStack mt={12}>
          <HeroCtaButton href="/blog" variant="ghost">View All Posts</HeroCtaButton>
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData: PageWithRelations | null = await getPageBySlug(SLUG);

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