// src/app/(resources)/testimonials/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, Avatar } from '@chakra-ui/react';
import { UICard, UICardBody, UICardText } from '@/src/components/ui/card';
import {
  getPageContentBySlug,
  getNavigablePages,
  type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getAllTestimonials, type HomepageTestimonial } from '@/src/lib/data/testimonials';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';

interface TestimonialsPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

interface TestimonialsPageProps {
  params: {};
}

const SLUG = 'testimonials';

export default async function TestimonialsPage({ params: _params }: TestimonialsPageProps) {
  // Fetch CMS data and testimonials
  const [pageCmsData, allTestimonials, navigablePages] = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllTestimonials(),
    getNavigablePages(),
  ]);

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(
      (p: NavigablePageInfo) => p.slug === (pageCmsData.slug as string),
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

  if (!pageCmsData && (!allTestimonials || allTestimonials.length === 0)) {
    return (
      <Layout>
        <Section id="testimonials-error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Testimonials Not Available
          </Heading>
          <Text>We&apos;re sorry, but testimonials could not be loaded at this time.</Text>
        </Section>
        <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
      </Layout>
    );
  }

  const cmsContent = pageCmsData?.content as TestimonialsPageCmsContent | null;
  let introContent: React.ReactNode = null;

  if (cmsContent) {
    const parts: React.ReactNode[] = [];
    if (cmsContent.hero?.headline && cmsContent.hero.headline !== (pageCmsData?.title as string)) {
      parts.push(
        <Heading key="hero-headline" as="h2" size="2xl" mt={4} mb={4} textAlign="center">
          {cmsContent.hero.headline}
        </Heading>,
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
        </Text>,
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

  return (
    <Layout>
      <Section
        id={(pageCmsData?.slug as string) || SLUG}
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 8 }}
        as="article"
      >
        <Heading as="h1" size="3xl" mb={6} textAlign="center">
          {(pageCmsData?.title as string) || 'Client Testimonials'}
        </Heading>
        {introContent}

        {allTestimonials && allTestimonials.length > 0 ? (
          <VStack spacing={8} mt={8} alignItems="stretch">
            {allTestimonials.map((testimonial: HomepageTestimonial) => (
              <UICard
                key={testimonial.id}
                variant="outlineFilled"
                w="full"
                maxW="container.md"
                mx="auto"
                _hover={{ shadow: 'lg' }}
                transition="shadow 0.2s"
              >
                <UICardBody>
                  {testimonial.avatar_url && (
                    <Avatar name={testimonial.name as string} src={testimonial.avatar_url as string} mb={4} size="lg" />
                  )}
                  <UICardText fontSize="xl" fontStyle="italic" color="foreground" mb={4}>
                    &quot;{testimonial.quote as string}&quot;
                  </UICardText>
                  <VStack alignItems="flex-end" spacing={0}>
                    <Text fontWeight="semibold" fontSize="md" color="foreground">
                      — {testimonial.name as string}
                    </Text>
                    {(testimonial.role || testimonial.company_name) && (
                      <Text fontSize="sm" color="muted.foreground">
                        {testimonial.role as string}
                        {testimonial.role && testimonial.company_name && ', '}
                        {testimonial.company_name as string}
                      </Text>
                    )}
                  </VStack>
                </UICardBody>
              </UICard>
            ))}
          </VStack>
        ) : (
          <Text textAlign="center" color="muted.foreground" mt={8}>
            No testimonials to display at the moment. Please check back soon!
          </Text>
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata({ params: _params }: TestimonialsPageProps): Promise<Metadata> {
  const pageData = await getPageContentBySlug(SLUG);
  const title = (pageData?.title as string) || "Client Testimonials | Coriyon's Studio";
  const description =
    (pageData?.meta_description as string) ||
    "Read what our clients have to say about their experience working with Coriyon's Studio.";

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
