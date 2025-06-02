// src/app/(main)/page.tsx
// - Added null checks for 'pageData' before accessing properties for prev/next links.
// - Corrected type usage in featuredTestimonials.map().
// - Ensured conditional JSX blocks within maps return null explicitly (using ternary operator).
// - General syntax review for reported error lines.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { Heading, Text, type TextAsValues } from '@/src/components/typography';
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card';
import { VStack, SimpleGrid, HStack, Box, Tag as ChakraTag, Image, Avatar, Divider } from '@chakra-ui/react';
import { getFeaturedServices, type ServiceData, type ServiceContentData } from '@/src/lib/data/services';
import { getFeaturedProjects, type HomepageProject } from '@/src/lib/data/projects';
import { getFeaturedTestimonials, type HomepageTestimonial } from '@/src/lib/data/testimonials';
import { getFeaturedPosts, type PostCardItem } from '@/src/lib/data/posts';
import {
    getPageContentBySlug,
    type PageData,
    type HomePageDbContentType,
    getNavigablePages,
    type NavigablePageInfo
} from '@/src/lib/data/pages';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import NextLink from 'next/link';

const SLUG = 'home';

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return dateString; }
}

interface ProcessStep { title: string; description: string; [key: string]: any; }
interface FinalCtaItem { text: string; href?: string; [key: string]: any; }

export default async function HomePage() {
  const [
    pageData,
    navigablePages,
    featuredServicesResult,
    featuredProjectsResult,
    featuredTestimonialsResult,
    featuredPostsResult
  ] = await Promise.all([
    getPageContentBySlug(SLUG),
    getNavigablePages(),
    getFeaturedServices(6).then(data => ({ data, error: null })).catch(error => ({ data: [] as ServiceData[], error })),
    getFeaturedProjects(3).then(data => ({ data, error: null })).catch(error => ({ data: [] as HomepageProject[], error })),
    getFeaturedTestimonials(6).then(data => ({ data, error: null })).catch(error => ({ data: [] as HomepageTestimonial[], error })),
    getFeaturedPosts(3).then(data => ({ data, error: null })).catch(error => ({ data: [] as PostCardItem[], error }))
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  // Guard pageData before accessing slug for prev/next links
  if (pageData && navigablePages) {
    const currentPageIndex = navigablePages.findIndex((p: NavigablePageInfo) => p.slug === pageData.slug);
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

  let featuredServices: ServiceData[] = featuredServicesResult.data || [];
  let serviceFetchError: string | null = null;
  if (featuredServicesResult.error) { 
    serviceFetchError = "Error fetching services."; // Simplified for brevity
    featuredServices = [];
  }

  let featuredProjects: HomepageProject[] = featuredProjectsResult.data || [];
  let projectFetchError: string | null = null;
  if (featuredProjectsResult.error) { 
    projectFetchError = "Error fetching projects.";
    featuredProjects = [];
  }

  let featuredTestimonials: HomepageTestimonial[] = featuredTestimonialsResult.data || [];
  let testimonialFetchError: string | null = null;
  if (featuredTestimonialsResult.error) {
    testimonialFetchError = "Error fetching testimonials.";
    featuredTestimonials = [];
  }

  let featuredPosts: PostCardItem[] = featuredPostsResult.data || [];
  let postFetchError: string | null = null;
  if (featuredPostsResult.error) {
    postFetchError = "Error fetching posts.";
    featuredPosts = [];
  }

  // Main guard for page rendering
  if (!pageData || !pageData.content) {
    return (
      <Layout>
        <Section id="error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Content Not Found</Heading>
          <Text>We&apos;re sorry, but the content for the homepage could not be loaded.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  const homeContent = pageData.content as HomePageDbContentType;

  const pageContentJSX = (
    <>
      {homeContent.hero_section && (
        <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
          <VStack spacing={6} maxW="2xl" mx="auto">
            <Heading as="h1" size="3xl" fontWeight="extrabold" color="foreground">
              {homeContent.hero_section.headline}
            </Heading>
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

      {homeContent.case_studies_section && (
         <Section id="featured-projects" py={{ base: 12, md: 20 }} variant="subtle">
           <VStack spacing={4} mb={12} textAlign="center">
             <Heading as="h2" size="2xl" color="foreground">
               {homeContent.case_studies_section.headline || "Featured Projects"}
             </Heading>
             {homeContent.case_studies_section.body_intro_paragraph && (
                <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
                  {homeContent.case_studies_section.body_intro_paragraph}
                </Text>
             )}
           </VStack>
          {projectFetchError ? ( <Text textAlign="center" color="red.500">{projectFetchError}</Text> )
            : featuredProjects && featuredProjects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
              {featuredProjects.map((project: HomepageProject) => (
                <UICard key={project.id} variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  {project.featured_image_url && (
                    <Image src={project.featured_image_url} alt={project.title} borderTopRadius="md" objectFit="cover" h="200px" w="full"/>
                  )}
                  <UICardHeader>
                    <UICardHeading size="lg" as="h3">{project.title}</UICardHeading>
                    {project.client_name && <Text fontSize="sm" color="muted.foreground" mt={1}>Client: {project.client_name}</Text>}
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                        {project.description || "Read more about this project."}
                    </UICardText>
                  </UICardBody>
                  <UICardFooter>
                     <HeroCtaButton href={`/projects/${project.slug}`} size="sm" variant="themedSolid" width="full">
                       View Project
                     </HeroCtaButton>
                  </UICardFooter>
                </UICard>
              ))}
            </SimpleGrid>
          ) : ( <Text textAlign="center" color="muted.foreground">Our latest projects will be showcased here soon.</Text> )}
          {homeContent.case_studies_section.cta?.text && homeContent.case_studies_section.cta.href && (
            <VStack mt={12}> <HeroCtaButton href={homeContent.case_studies_section.cta.href} colorScheme="blue" showIcon={true}> {homeContent.case_studies_section.cta.text} </HeroCtaButton> </VStack>
          )}
        </Section>
      )}

      {homeContent.services_section && (
        <Section id="dynamic-services" py={{ base: 12, md: 20 }} variant="default">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">{homeContent.services_section.headline}</Heading>
            {homeContent.services_section.body_intro_paragraphs?.map((paragraph: string, index: number) => (
              <Text key={index} fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">{paragraph}</Text>
            ))}
          </VStack>
          {serviceFetchError ? (<Text textAlign="center" color="red.500">{serviceFetchError}</Text>)
            : featuredServices && featuredServices.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
              {featuredServices.map((item: ServiceData) => (
                <UICard key={item.id} variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <UICardHeader>
                    <HStack justifyContent="space-between" alignItems="center">
                      <UICardHeading size="lg" as="h3">{item.title}</UICardHeading>
                      {item.offering_type === 'BUNDLE' && <ChakraTag size="sm" colorScheme="purple">Bundle</ChakraTag>}
                    </HStack>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    <UICardText color="muted.foreground" mb={4}>{item.description || "More details coming soon."}</UICardText>
                    {item.offering_type === 'BUNDLE' && item.content && (
                      <Box fontSize="sm">
                        {(item.content as ServiceContentData).price && <Text fontWeight="bold">Price: {(item.content as ServiceContentData).price}</Text>}
                        {(item.content as ServiceContentData).includes_summary && <Text mt={2}><strong>Includes:</strong> {(item.content as ServiceContentData).includes_summary}</Text>}
                      </Box>
                    )}
                    {item.offering_type === 'INDIVIDUAL' && item.content && (item.content as ServiceContentData).price && (
                       <Text mt={2} fontWeight="bold">Price: {(item.content as ServiceContentData).price}</Text>
                    )}
                  </UICardBody>
                  {/* Corrected conditional rendering for HeroCtaButton */}
                  {(item.content?.cta_text && (item.content as ServiceContentData).cta_link) ? (
                    <UICardFooter>
                       <HeroCtaButton
                         href={(item.content as ServiceContentData).cta_link as string}
                         size="sm"
                         variant="themedOutline"
                         width="full"
                       >
                         {(item.content as ServiceContentData).cta_text}
                       </HeroCtaButton>
                    </UICardFooter>
                  ) : null} {/* Explicitly return null if condition is false */}
                </UICard>
              ))}
            </SimpleGrid>
          ) : (<Text textAlign="center" color="muted.foreground">Our services and packages will be listed here soon.</Text>)}
          {homeContent.services_section.cta?.text && homeContent.services_section.cta.href &&(
            <VStack mt={12}><HeroCtaButton href={homeContent.services_section.cta.href} colorScheme="blue" showIcon={true}>{homeContent.services_section.cta.text}</HeroCtaButton></VStack>
          )}
        </Section>
      )}

      {homeContent.why_our_studio_section && (
        <ContentSection
          id="why_ux_studio"
          headline={homeContent.why_our_studio_section.headline}
          body={ homeContent.why_our_studio_section.body_paragraphs ? homeContent.why_our_studio_section.body_paragraphs.join('\n\n') : homeContent.why_our_studio_section.body_paragraph }
          cta={homeContent.why_our_studio_section.cta?.text}
          href={homeContent.why_our_studio_section.cta?.href}
          variant="subtle"
          ctaRightIcon={true}
        />
      )}

      {homeContent.testimonials_section && (
        <ContentSection
            id="testimonials"
            headline={homeContent.testimonials_section.headline}
        >
            {testimonialFetchError ? (
                <Text textAlign="center" color="red.500" mt={8}>{testimonialFetchError}</Text>
            ) : featuredTestimonials && featuredTestimonials.length > 0 ? (
                <>
                    <VStack spacing={8} mt={8} alignItems="stretch">
                        {/* Corrected type for testimonial in map */}
                        {featuredTestimonials.map((testimonial: HomepageTestimonial) => (
                            <UICard key={testimonial.id} variant="outlineFilled" w="full">
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
                                                {testimonial.role}{testimonial.role && testimonial.company_name && ", "}{testimonial.company_name}
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

      {/* Featured Blog Posts Section - Placeholder, ensure content is correctly structured */}
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
          <Text textAlign="center" color="red.500">{postFetchError}</Text>
        ) : featuredPosts && featuredPosts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredPosts.map((post: PostCardItem) => (
              <NextLink key={post.id} href={`/blog/${post.slug}`} passHref>
                <UICard as="a" variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)', textDecoration: 'none' }} transition="all 0.2s">
                  {post.featured_image_url && (
                    <Image src={post.featured_image_url} alt={post.title} borderTopRadius="md" objectFit="cover" h="200px" w="full" />
                  )}
                  <UICardHeader>
                    <UICardHeading size="md" as="h3" noOfLines={2}>{post.title}</UICardHeading>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    {post.published_at && (
                      <Text fontSize="xs" color="muted.foreground" mb={2}>
                        {formatDate(post.published_at)}
                      </Text>
                    )}
                    <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                      {post.excerpt || "Continue reading..."}
                    </UICardText>
                  </UICardBody>
                  <UICardFooter>
                    <Text fontSize="sm" color="blue.500" fontWeight="medium">Read More &rarr;</Text>
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

      {homeContent.process_section && (
        <ContentSection
          id="process"
          headline={homeContent.process_section.headline}
          body={homeContent.process_section.body_intro_paragraph}
          cta={homeContent.process_section.cta?.text}
          href={homeContent.process_section.cta?.href}
          ctaRightIcon={true}
        >
          {homeContent.process_section.steps && (
            <SimpleGrid columns={{base: 1, md: homeContent.process_section.steps.length > 3 ? 3 : homeContent.process_section.steps.length}} spacing={6} mt={8} w="full">
              {homeContent.process_section.steps.map((step: ProcessStep, index: number) => (
                <UICard key={index} variant="subtle" h="full"><UICardHeader><UICardHeading as="h4" size="md">{step.title}</UICardHeading></UICardHeader><UICardBody><UICardText>{step.description}</UICardText></UICardBody></UICard>
              ))}
            </SimpleGrid>
          )}
          {homeContent.process_section.body_outro_paragraph && <Text mt={8}>{homeContent.process_section.body_outro_paragraph}</Text>}
        </ContentSection>
      )}

      {homeContent.about_section && (
        <ContentSection
          id="about-homepage"
          headline={homeContent.about_section.headline}
          body={homeContent.about_section.body_intro_paragraph}
          cta={homeContent.about_section.cta?.text}
          href={homeContent.about_section.cta?.href}
          variant="subtle"
          ctaRightIcon={true}
        >
          <VStack as="ul" spacing={2} mt={8} alignItems="flex-start" sx={{ listStyleType: 'none' }} pl={0}>
            {homeContent.about_section.points?.map((point: string, index: number) => (
              <Text as={"li" as TextAsValues} key={index} display="flex" alignItems="center">{point}</Text>
            ))}
          </VStack>
          {homeContent.about_section.body_outro_paragraph && <Text mt={8}>{homeContent.about_section.body_outro_paragraph}</Text>}
        </ContentSection>
      )}

      {homeContent.final_cta_section && (
        <Section id="final_cta" variant="inverse" py={{ base: 16, md: 24 }} textAlign="center">
         <VStack spacing={6} maxW="xl" mx="auto">
            <Heading as="h2" size="2xl">{homeContent.final_cta_section.headline}</Heading>
            {homeContent.final_cta_section.body_paragraph && (<Text fontSize="lg" opacity={0.9}>{homeContent.final_cta_section.body_paragraph}</Text>)}
            <HStack spacing={4} mt={4}>
              {homeContent.final_cta_section.ctas?.map((cta_item: FinalCtaItem, index: number) =>
                (cta_item.text && cta_item.href) ? ( // Ensure href exists before rendering button
                  <HeroCtaButton key={index} href={cta_item.href} colorScheme="gray" variant="solid">
                    {cta_item.text}
                  </HeroCtaButton>
                ) : null // Explicitly return null if condition is false
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
  const pageData = await getPageContentBySlug(SLUG);
  if (!pageData) { return { title: 'Page Not Found | Coriyon’s Studio' };}
  return {
    title: pageData.title,
    description: pageData.meta_description,
    openGraph: {
      title: pageData.title,
      description: pageData.meta_description || undefined,
      url: `/${SLUG}`,
      images: pageData.og_image_url ? [{ url: pageData.og_image_url }] : undefined,
    },
  };
}