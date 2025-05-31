// src/app/page.tsx (Final Cleaned Version)
// NO 'use client' - This is a Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { Heading, Text } from '@/src/components/typography';
// Button import might not be needed directly here if all CTAs use HeroCtaButton or ContentSection's button
// import Button from '@/src/components/ui/button'; 
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText } from '@/src/components/ui/card';
// NextLink might not be needed directly if HeroCtaButton and ContentSection handle their linking
// import NextLink from 'next/link'; 
import { VStack, SimpleGrid, HStack } from '@chakra-ui/react';
import { getFeaturedServices, type FeaturedService } from '@/src/lib/data/services';

interface HomePageSectionData {
  cta?: string;
  href?: string;
  headline: string;
  body?: string;
  subheadline?: string;
}
interface HomePageContentType {
  hero: HomePageSectionData;
  services: HomePageSectionData;
  case_studies: HomePageSectionData;
  why_ux: HomePageSectionData;
  process: HomePageSectionData;
  about: HomePageSectionData;
  testimonials: Pick<HomePageSectionData, 'headline' | 'body'>;
  blog: HomePageSectionData;
  faqs: HomePageSectionData;
  final_cta: HomePageSectionData;
}

const homePageContent: HomePageContentType = {
  "hero": { "cta": "Get Free Consultation", "href": "/contact", "headline": "Good UX solves business problems. Let's solve yours.", "subheadline": "I help businesses create intuitive, engaging digital experiences that users love and competitors envy. Let's build something amazing together." },
  "services": { "cta": "View All Services", "body": "Explore the range of UX/UI services I offer, tailored to meet your specific project needs.", "href": "/services", "headline": "My Services" },
  "case_studies": { "cta": "Browse Featured Projects", "body": "See real-world examples of how my UX expertise has transformed products and delighted users.", "href": "/projects", "headline": "Case Studies" },
  "why_ux": { "cta": "See the Business Value", "body": "Discover how strategic UX design drives business growth, user satisfaction, and a stronger bottom line.", "href": "/solutions", "headline": "Why Invest in UX?" },
  "process": { "cta": "Explore the Process", "body": "Understand the steps I take to ensure a successful, collaborative design journey from start to finish.", "href": "/process", "headline": "My Design Process" },
  "about": { "cta": "Learn More About My Journey", "body": "Deep dive into my background, skills, and passion for user-centered design.", "href": "/about", "headline": "About Me" },
  "testimonials": { "body": "Hear directly from businesses I've partnered with.", "headline": "What Clients Say" },
  "blog": { "cta": "View All Posts", "body": "Explore insights on UX, development, and more.", "href": "/blog", "headline": "From the Blog" },
  "faqs": { "cta": "Read the FAQs", "body": "Find answers to common questions about my services, process, and pricing.", "href": "/faq", "headline": "Frequently Asked Questions" },
  "final_cta": { "cta": "Start Your Project Today", "body": "Let's discuss how I can help you achieve your product goals.", "href": "/contact", "headline": "Ready to Elevate Your User Experience?" }
};

export default async function HomePage() {
  let featuredServices: FeaturedService[] = [];
  let serviceFetchError: string | null = null;
  try {
    featuredServices = await getFeaturedServices(3);
    if (!Array.isArray(featuredServices)) {
        serviceFetchError = "Data format error for services.";
        featuredServices = [];
    }
  } catch (error: unknown) {
    if (error instanceof Error) { serviceFetchError = error.message; }
    else { serviceFetchError = "An unknown error occurred while fetching services."; }
    // Optionally log critical errors to a server-side logging service in production
    // console.error("Error fetching services:", serviceFetchError);
  }

  const { hero, services, case_studies, why_ux, process, about, testimonials, blog, faqs, final_cta } = homePageContent;

  const pageJSX = (
    <>
      {/* Hero Section */}
      <Section id="hero" py={{ base: 16, md: 24 }} textAlign="center">
        <VStack spacing={6} maxW="2xl" mx="auto">
          <Heading as="h1" size="3xl" fontWeight="extrabold" color="foreground">
            {hero.headline}
          </Heading>
          <Text fontSize="xl" color="muted.foreground" maxW="xl">
            {hero.subheadline}
          </Text>
          <HeroCtaButton href={hero.href || '#'}>
            {hero.cta}
          </HeroCtaButton>
        </VStack>
      </Section>

      {/* Dynamic Services Section */}
      <Section id="dynamic-services" py={{ base: 12, md: 20 }} variant="subtle">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="2xl" color="foreground">
            {services.headline}
          </Heading>
          <Text fontSize="lg" color="muted.foreground" maxW="lg" mx="auto">
            {services.body}
          </Text>
        </VStack>
        {serviceFetchError ? (
          <Text textAlign="center" color="red.500">{serviceFetchError}</Text>
        ) : featuredServices && featuredServices.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredServices.map((service) => (
              <UICard key={service.id} variant="outline" h="full">
                <UICardHeader><HStack alignItems="center"><UICardHeading size="lg" as="h3">{service.title}</UICardHeading></HStack></UICardHeader>
                <UICardBody><UICardText color="muted.foreground">{service.description || "More details coming soon."}</UICardText></UICardBody>
              </UICard>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="muted.foreground">
            Our services will be listed here soon. Please check back!
          </Text>
        )}
        {services.cta && services.href && (
          <VStack mt={12}>
            {/* Updated to use HeroCtaButton for consistency with icon */}
            <HeroCtaButton href={services.href} colorScheme="blue" showIcon={true}>
              {services.cta}
            </HeroCtaButton>
          </VStack>
        )}
      </Section>

      <ContentSection id="case_studies" {...case_studies} ctaRightIcon={true} />
      <ContentSection id="why_ux" {...why_ux} variant="subtle" ctaRightIcon={true} />
      <ContentSection id="process" {...process} ctaRightIcon={true} />
      <ContentSection id="about" {...about} variant="subtle" ctaRightIcon={true} />
      <ContentSection id="testimonials" headline={testimonials.headline} body={testimonials.body}>
        <Text fontStyle="italic" color="muted.foreground" mt={4}>
          (Actual client testimonials will be displayed here dynamically.)
        </Text>
      </ContentSection>
      <ContentSection id="blog" {...blog} variant="subtle" ctaRightIcon={true} />
      <ContentSection id="faqs" {...faqs} ctaRightIcon={true} />
      <ContentSection id="final_cta" {...final_cta} variant="inverse" py={{ base: 16, md: 24 }} ctaRightIcon={true} />
    </>
  );

  return (
    <Layout>
      {pageJSX}
    </Layout>
  );
}