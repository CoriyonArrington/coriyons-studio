// src/app/(resources)/process/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { VStack, SimpleGrid, Box, HStack } from '@chakra-ui/react';
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card';
import {
    getPageContentBySlug,
    type PageData,
    getNavigablePages,
    type NavigablePageInfo,
} from '@/src/lib/data/pages';
import { getAllProcessSteps, type ProcessStepItem } from '@/src/lib/data/process';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
// import { mapPageTypeToCategoryLabel } from '@/src/lib/utils'; // Not used in this snippet
import type { Metadata } from 'next';
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import NextLink from 'next/link';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface ProcessPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  [key: string]: any;
}

interface ProcessPageProps {}
const SLUG = 'process';

const DynamicLucideIcon: React.FC<{ name: string | undefined | null; } & Omit<LucideProps, 'ref' | 'children'>> = ({ name, ...props }) => {
  if (!name) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent && (typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent.$$typeof === Symbol.for('react.forward_ref')))) {
      return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`Lucide icon "${name}" not found or invalid in process/page.tsx. Rendering fallback 'Shapes'.`);
  }
  const FallbackIcon = (LucideIcons as any)['Shapes'];

  if (FallbackIcon && (typeof FallbackIcon === 'function' || (typeof FallbackIcon === 'object' && FallbackIcon.$$typeof === Symbol.for('react.forward_ref')))) {
    return React.createElement(FallbackIcon as React.ComponentType<LucideProps>, props);
  }
  return null; 
};

export default async function ProcessLandingPage({}: ProcessPageProps) { // Added {} for props destructuring
  const results = await Promise.all([
    getPageContentBySlug(SLUG),
    getAllProcessSteps(),
    getNavigablePages()
  ]);

  const pageCmsData: PageData | null = results[0] || null;
  const processSteps: ProcessStepItem[] = results[1] || [];
  const navigablePages: NavigablePageInfo[] = results[2] || [];

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;

  if (pageCmsData) { /* ... your prev/next link logic based on pageCmsData and navigablePages ... */ }

  if (!pageCmsData && processSteps.length === 0) {
    return ( <Layout><Section><Text>Content not available.</Text></Section></Layout> /* Basic error UI */ );
  }

  const cmsContent = pageCmsData?.content as ProcessPageCmsContent | undefined;
  let introContent: React.ReactNode = null;

  if (cmsContent?.intro_text) { 
    introContent = <Text fontSize="lg" color="muted.foreground" textAlign="center" mb={10} whiteSpace="pre-line">{cmsContent.intro_text}</Text>;
  } else if (pageCmsData && !cmsContent?.intro_text) {
    introContent = <Text fontSize="lg" color="muted.foreground" textAlign="center" mb={10}>Explore the steps involved in our design and development journey.</Text>;
  }


  return (
    <Layout>
      <Section id={pageCmsData?.slug || SLUG} py={{ base: 12, md: 20 }} px={{ base: 4, md: 8 }} as="article">
        <Heading as="h1" size="3xl" mb={cmsContent?.hero?.headline ? 2 : 6} textAlign="center">
          {cmsContent?.hero?.headline || pageCmsData?.title || "Our Design Process"}
        </Heading>
        {introContent}

        {processSteps.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} mt={8}>
            {processSteps.map((step: ProcessStepItem) => (
              <NextLink key={step.id} href={`/process/${step.slug}`} passHref>
                <UICard as="a" variant="outline" h="full" display="flex" flexDirection="column" _hover={{ shadow: 'lg', transform: 'translateY(-2px)', textDecoration: 'none' }} transition="all 0.2s">
                  <UICardHeader>
                    <HStack spacing={3} alignItems="center">
                      {step.icon && step.icon.icon_library === 'lucide-react' && (
                        <DynamicLucideIcon name={step.icon.name} size={24} color="var(--chakra-colors-primary-500)" strokeWidth={2.5} />
                      )}
                      <UICardHeading size="lg" as="h3">{step.title}</UICardHeading>
                    </HStack>
                  </UICardHeader>
                  <UICardBody flexGrow={1}>
                    <UICardText color="muted.foreground" mb={4} noOfLines={4}>
                        {step.description || "Learn more about this step."}
                    </UICardText>
                  </UICardBody>
                  <UICardFooter>
                     <Text fontSize="sm" color="blue.500" fontWeight="medium">Learn More &rarr;</Text>
                  </UICardFooter>
                </UICard>
              </NextLink>
            ))}
          </SimpleGrid>
        ) : (
          pageCmsData ?
          <Text textAlign="center" color="muted.foreground" mt={8}>
            Our process steps will be detailed here soon.
          </Text> : null
        )}
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} basePath="/process" /> {/* Consider if basePath should be dynamic or is always /process */}
    </Layout>
  );
}

// Corrected generateMetadata (should be around line 72 for the comma issue)
export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageContentBySlug(SLUG);
  const title = pageCmsData?.title || "Our Design Process"; // Simplified default
  const metaTitle = `${title} | Coriyon's Studio`;
  const description = pageCmsData?.meta_description || `Learn about the collaborative and transparent design process at Coriyon's Studio, covering discovery, design, development, and delivery.`;
  const ogImage = pageCmsData?.og_image_url;

  const openGraphImages: OpenGraph['images'] = [];
  if (ogImage) {
    openGraphImages.push({ url: ogImage, alt: title }); // Added alt tag for OG image
  }

  return {
    title: metaTitle,
    description,
    openGraph: {
      title: title, // Use base title for OG
      description,
      url: `/process`,
      type: 'website', // More appropriate for a landing page
      images: openGraphImages.length > 0 ? openGraphImages : undefined,
    } // Removed trailing comma here, assuming this closing brace is what line 72's error refers to.
  };
}