// src/app/(resources)/process/[slug]/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { 
    Box, VStack, Image, UnorderedList, ListItem, SimpleGrid, Divider, HStack, 
    // chakra, // chakra removed
    // Code, // Code removed (was for BlockRenderer)
    // OrderedList // OrderedList removed (was for BlockRenderer)
} from '@chakra-ui/react';
import {
    getProcessStepBySlug,
    getAllProcessSteps,
    // type ProcessStepDetail, // ProcessStepDetail removed
    type ContentPoint,
    type ContentVisual,
} from '@/src/lib/data/process';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
// ReactMarkdown and remarkGfm removed as BlockRenderer is removed

// ContentBlock interface removed as BlockRenderer is removed
// BlockRenderer function removed

// MarkdownComponents removed as BlockRenderer is removed

interface ProcessStepDetailPageProps { params: { slug: string }; }

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
    console.warn(`Lucide icon "${name}" not found or invalid in [slug]/page.tsx. Rendering fallback 'Shapes'.`);
  }
  const FallbackIcon = (LucideIcons as any)['Shapes']; 
  if (FallbackIcon && (typeof FallbackIcon === 'function' || (typeof FallbackIcon === 'object' && FallbackIcon.$$typeof === Symbol.for('react.forward_ref')))) {
    return React.createElement(FallbackIcon as React.ComponentType<LucideProps>, props);
  }
  return null; 
};

export default async function ProcessStepDetailPage(props: ProcessStepDetailPageProps) {
  const { params } = props;
  const { slug } = params;

  const [step, allProcessStepsForNav] = await Promise.all([
    getProcessStepBySlug(slug),
    getAllProcessSteps() 
  ]);

  if (!step) {
    notFound();
  }

  let previousStepLink: PrevNextNavLinkInfo | undefined;
  let nextStepLink: PrevNextNavLinkInfo | undefined;

  if (allProcessStepsForNav && allProcessStepsForNav.length > 0) {
    const currentIndex = allProcessStepsForNav.findIndex(s => s.slug === step.slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        const prevStep = allProcessStepsForNav[currentIndex - 1];
        previousStepLink = { slug: prevStep.slug, title: prevStep.title, categoryLabel: "Previous Step"};
      }
      if (currentIndex < allProcessStepsForNav.length - 1) {
        const nextStep = allProcessStepsForNav[currentIndex + 1];
        nextStepLink = { slug: nextStep.slug, title: nextStep.title, categoryLabel: "Next Step"};
      }
    }
  }

  const { title, description, content, icon } = step; 
  const detailContent = content;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} alignItems="stretch" maxW="container.lg" mx="auto">
          <VStack spacing={3} alignItems="center" textAlign="center" mb={8}>
            <HStack spacing={4} alignItems="center">
              {icon && icon.icon_library === 'lucide-react' && (
                <DynamicLucideIcon name={icon.name} size={40} color="var(--chakra-colors-primary-500)" strokeWidth={2.5}/>
              )}
              <Heading as="h1" size="2xl" color="foreground">
                {title}
              </Heading>
            </HStack>
            {description && (<Text fontSize="xl" color="muted.foreground" maxW="2xl" mt={2}>{description}</Text>)}
          </VStack>
          <Divider my={6} />
          {detailContent ? (
            <VStack spacing={6} alignItems="stretch">
              {detailContent.main_heading ? <Heading as="h2" size="xl" mb={2}>{detailContent.main_heading}</Heading> : null}
              {detailContent.introduction ? <Text fontSize="lg" lineHeight="tall" whiteSpace="pre-line">{detailContent.introduction}</Text> : null}
              
              {detailContent.sub_steps && detailContent.sub_steps.length > 0 ? (
                <Box mt={4}>
                  {detailContent.sub_steps.map((subStep: ContentPoint, index: number) => (
                    <Box key={index} mb={5} p={4} borderWidth="1px" borderRadius="md" borderColor="border">
                      {subStep.title ? <Heading as="h3" size="lg" mb={2}>{subStep.title}</Heading> : null}
                      <Text whiteSpace="pre-line" mb={subStep.items && subStep.items.length > 0 ? 2 : 0}>{subStep.description || ''}</Text>
                      {subStep.items && subStep.items.length > 0 ? (
                        <UnorderedList spacing={1} pl={5} mt={2}>
                          {subStep.items.map((item: string, itemIndex: number) => (<ListItem key={itemIndex}>{item}</ListItem>))}
                        </UnorderedList>
                      ) : null}
                    </Box>
                  ))}
                </Box>
              ) : null}

              {detailContent.insights?.items && detailContent.insights.items.length > 0 ? (
                <Box mt={4}>
                  <Heading as="h3" size="lg" mb={2}>{detailContent.insights?.title || "Insights"}</Heading>
                  <UnorderedList spacing={1} pl={5}>
                    {detailContent.insights.items.map((item: string, index: number) => (<ListItem key={index}>{item}</ListItem>))}
                  </UnorderedList>
                </Box>
              ) : null}

              {detailContent.visuals && detailContent.visuals.length > 0 ? (
                <Box mt={6}>
                  <Heading as="h2" size="xl" mb={4}>Visuals</Heading>
                  <SimpleGrid columns={{ base: 1, md: detailContent.visuals.length > 1 ? 2 : 1 }} spacing={6}>
                    {detailContent.visuals.map((visual: ContentVisual, index: number) => (
                      visual.url ? (
                        <VStack key={index} spacing={2} alignItems="center">
                          <Image src={visual.url} alt={visual.alt || `Process visual ${index + 1}`} borderRadius="md" boxShadow="sm" maxH="400px" objectFit="contain"/>
                          {visual.caption ? <Text fontSize="sm" color="muted.foreground" textAlign="center">{visual.caption}</Text> : null}
                        </VStack>
                      ) : null ))}
                  </SimpleGrid>
                </Box>
              ) : null}
              {detailContent.conclusion ? <Text fontSize="lg" lineHeight="tall" mt={6} whiteSpace="pre-line">{detailContent.conclusion}</Text> : null}
            </VStack>
          ) : (<Text>Detailed content for this process step is not yet available.</Text>)}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousStepLink} nextPage={nextStepLink} basePath="/process" />
    </Layout>
  );
}

export async function generateMetadata( props: ProcessStepDetailPageProps, _parent: ResolvingMetadata ): Promise<Metadata> { // parent renamed to _parent
  const { params } = props;
  const { slug } = params;
  const step = await getProcessStepBySlug(slug); 

  if (!step) { 
    return { 
      title: 'Process Step Not Found | Coriyon’s Studio',
      description: 'The requested process step could not be found.' 
    }; 
  }
  
  const description = step.description || `Learn about the ${step.title} phase of our design process at Coriyon's Studio.`;
  const openGraphImages: Array<{ url: string | URL; alt?: string }> = []; 
  
  // Example: Populate openGraphImages if you have logic for it
  // if (step.content?.visuals && step.content.visuals.length > 0 && step.content.visuals[0].url) {
  //   openGraphImages.push({ url: step.content.visuals[0].url, alt: step.content.visuals[0].alt || step.title });
  // } else if (step.icon?.url) { // Assuming icon might have a direct URL for OG
  //   openGraphImages.push({ url: step.icon.url, alt: step.title });
  // }


  return {
    title: `${step.title} | Our Process | Coriyon's Studio`,
    description: description,
    openGraph: {
      title: `${step.title} | Our Process`,
      description: description,
      type: 'article',
      url: `/process/${slug}`,
      images: openGraphImages.length > 0 ? openGraphImages : undefined, // Ensure it's undefined if empty
    }, 
  };
}