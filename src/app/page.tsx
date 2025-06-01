// src/app/page.tsx (Addressing unused var and testimonial item typing)
// NO 'use client' - This is a Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { Heading, Text, type TextAsValues } from '@/src/components/typography';
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card';
import { VStack, SimpleGrid, HStack, Box, Tag as ChakraTag } from '@chakra-ui/react';
import { getFeaturedServices, type FeaturedService } from '@/src/lib/data/services';
import { getPageContentBySlug, type PageData } from '@/src/lib/data/pages';
// FIX: Removed ReactMarkdown import and MarkdownRenderer component as it's no longer used in this file
// import ReactMarkdown from 'react-markdown';

// const MarkdownRenderer: React.FC<{ markdown: string | undefined }> = ({ markdown }) => {
//   if (!markdown) return null;
//   return <ReactMarkdown>{markdown}</ReactMarkdown>;
// };

// FIX: Removed TestimonialItem interface as item type will be inferred in map
// interface TestimonialItem {
//   quote: string;
//   author: string;
// }

export default async function HomePage() {
  const pageData: PageData | null = await getPageContentBySlug('home');

  let featuredServicesAndBundles: FeaturedService[] = [];
  let serviceFetchError: string | null = null;
  try {
    featuredServicesAndBundles = await getFeaturedServices(6); 
    if (!Array.isArray(featuredServicesAndBundles)) {
        serviceFetchError = "Data format error for services.";
        featuredServicesAndBundles = [];
    }
  } catch (error: unknown) {
    if (error instanceof Error) { serviceFetchError = error.message; }
    else { serviceFetchError = "An unknown error occurred while fetching services."; }
  }

  if (!pageData || !pageData.content) {
    return (
      <Layout>
        <Section id="error" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">Page Content Not Found</Heading>
          <Text>We&apos;re sorry, but the content for the homepage could not be loaded.</Text>
        </Section>
      </Layout>
    );
  }

  const {
    hero_section,
    why_our_studio_section,
    testimonials_section,
    services_section, 
    process_section,
    case_studies_section,
    about_section,
    final_cta_section
  } = pageData.content;

  const pageJSX = (
    <>
      {hero_section && (
        <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
          <VStack spacing={6} maxW="2xl" mx="auto">
            <Heading as="h1" size="3xl" fontWeight="extrabold" color="foreground">
              {hero_section.headline}
            </Heading>
            {hero_section.subheadline && (
              <Text fontSize="xl" color="muted.foreground" maxW="xl">
                {hero_section.subheadline}
              </Text>
            )}
            {hero_section.cta && (
              <HeroCtaButton href={hero_section.cta.href || '#'}>
                {hero_section.cta.text}
              </HeroCtaButton>
            )}
          </VStack>
        </Section>
      )}

      {services_section && (
        <Section id="dynamic-services" py={{ base: 12, md: 20 }} variant="subtle">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="2xl" color="foreground">
              {services_section.headline}
            </Heading>
            {services_section.body_intro_paragraphs?.map((paragraph: string, index: number) => (
              <Text key={index} fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
                {paragraph}
              </Text>
            ))}
          </VStack>

          {serviceFetchError ? (
            <Text textAlign="center" color="red.500">{serviceFetchError}</Text>
          ) : featuredServicesAndBundles && featuredServicesAndBundles.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
              {featuredServicesAndBundles.map((item) => (
                <UICard key={item.id} variant="outline" h="full" display="flex" flexDirection="column">
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
                        {item.content.price && <Text fontWeight="bold">Price: {item.content.price}</Text>}
                        {item.content.includes_summary && <Text mt={2}><strong>Includes:</strong> {item.content.includes_summary}</Text>}
                        {item.content.savings_summary && <Text mt={1} color="green.600">{item.content.savings_summary}</Text>}
                        {item.content.value_summary && <Text mt={1} color="green.600">{item.content.value_summary}</Text>}
                        {item.content.perfect_for && <Text mt={2}><em>Perfect for: {item.content.perfect_for}</em></Text>}
                      </Box>
                    )}
                    {item.offering_type === 'INDIVIDUAL' && item.content && item.content.price && (
                       <Text mt={2} fontWeight="bold">Price: {item.content.price}</Text>
                    )}
                  </UICardBody>
                  {item.content?.cta_text && (
                    <UICardFooter>
                       <HeroCtaButton href={item.content.cta_link || `/services/${item.slug}`} size="sm" variant="outline" width="full">
                         {item.content.cta_text}
                       </HeroCtaButton>
                    </UICardFooter>
                  )}
                </UICard>
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" color="muted.foreground">
              Our services and packages will be listed here soon. Please check back!
            </Text>
          )}
          
          {services_section.cta && (
            <VStack mt={12}>
              <HeroCtaButton href={services_section.cta.href || '#'} colorScheme="blue" showIcon={true}>
                {services_section.cta.text}
              </HeroCtaButton>
            </VStack>
          )}
        </Section>
      )}

      {why_our_studio_section && (
        <ContentSection
          id="why_ux_studio"
          headline={why_our_studio_section.headline}
          body={
            why_our_studio_section.body_paragraphs 
              ? why_our_studio_section.body_paragraphs.join('\n\n') 
              : why_our_studio_section.body_paragraph
          }
          cta={why_our_studio_section.cta?.text}
          href={why_our_studio_section.cta?.href}
          variant="subtle"
          ctaRightIcon={true}
        />
      )}
      
      {testimonials_section && (
        <ContentSection
          id="testimonials"
          headline={testimonials_section.headline}
        >
          <VStack spacing={6} mt={8} alignItems="stretch">
            {/* FIX: Removed explicit 'TestimonialItem' type for 'item'; type guard will handle it. */}
            {testimonials_section.items?.map((item, index: number) => ( 
              item && 'quote' in item && 'author' in item ? ( // Type guard narrows down 'item'
                <UICard key={index} variant="outlineFilled">
                  <UICardBody>
                    <UICardText fontStyle="italic">&quot;{item.quote}&quot;</UICardText> 
                    <UICardText textAlign="right" fontWeight="semibold" mt={2}>— {item.author}</UICardText>
                  </UICardBody>
                </UICard>
              ) : null
            ))}
          </VStack>
        </ContentSection>
      )}

      {process_section && (
        <ContentSection
          id="process"
          headline={process_section.headline}
          body={process_section.body_intro_paragraph}
          cta={process_section.cta?.text}
          href={process_section.cta?.href}
          ctaRightIcon={true}
        >
          {process_section.steps && (
            <SimpleGrid columns={{base: 1, md: process_section.steps.length > 3 ? 3 : process_section.steps.length}} spacing={6} mt={8} w="full">
              {process_section.steps.map((step: { title: string; description: string }, index: number) => (
                <UICard key={index} variant="subtle" h="full">
                  <UICardHeader><UICardHeading as="h4" size="md">{step.title}</UICardHeading></UICardHeader>
                  <UICardBody><UICardText>{step.description}</UICardText></UICardBody>
                </UICard>
              ))}
            </SimpleGrid>
          )}
          {process_section.body_outro_paragraph && <Text mt={8}>{process_section.body_outro_paragraph}</Text>}
        </ContentSection>
      )}

      {case_studies_section && (
         <ContentSection
          id="case_studies"
          headline={case_studies_section.headline}
          body={case_studies_section.body_intro_paragraph}
          cta={case_studies_section.cta?.text}
          href={case_studies_section.cta?.href}
          variant="subtle"
          ctaRightIcon={true}
        >
          <VStack spacing={4} mt={8} alignItems="stretch">
            {case_studies_section.examples?.map((example: { summary: string }, index: number) => (
                 <UICardText key={index} as="div" p={4} borderWidth="1px" borderRadius="md" >• {example.summary}</UICardText>
            ))}
          </VStack>
          {case_studies_section.body_outro_paragraph && <Text mt={8}>{case_studies_section.body_outro_paragraph}</Text>}
        </ContentSection>
      )}

      {about_section && (
        <ContentSection
          id="about"
          headline={about_section.headline}
          body={about_section.body_intro_paragraph}
          cta={about_section.cta?.text}
          href={about_section.cta?.href}
          variant="subtle"
          ctaRightIcon={true}
        >
          <VStack as="ul" spacing={2} mt={8} alignItems="flex-start" sx={{ listStyleType: 'none' }} pl={0}>
            {about_section.points?.map((point: string, index: number) => (
              <Text as={"li" as TextAsValues} key={index} display="flex" alignItems="center">
                {point}
              </Text>
            ))}
          </VStack>
          {about_section.body_outro_paragraph && <Text mt={8}>{about_section.body_outro_paragraph}</Text>}
        </ContentSection>
      )}

      {final_cta_section && (
        <Section id="final_cta" variant="inverse" py={{ base: 16, md: 24 }} textAlign="center">
         <VStack spacing={6} maxW="xl" mx="auto">
            <Heading as="h2" size="2xl">
              {final_cta_section.headline}
            </Heading>
            {final_cta_section.body_paragraph && ( 
              <Text fontSize="lg" opacity={0.9}>
                {final_cta_section.body_paragraph}
              </Text>
            )}
            <HStack spacing={4} mt={4}>
              {final_cta_section.ctas?.map((cta_item: {text: string; href: string}, index: number) => (
                <HeroCtaButton key={index} href={cta_item.href || '#'} colorScheme="gray" variant="solid">
                  {cta_item.text}
                </HeroCtaButton>
              ))}
            </HStack>
          </VStack>
        </Section>
      )}
    </>
  );

  return (
    <Layout>
      {pageJSX}
    </Layout>
  );
}