import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { 
    Box, 
    VStack, 
    Image, 
    UnorderedList, 
    ListItem, 
    SimpleGrid, 
    Divider, 
    HStack,
    Heading,
    Text
} from '@chakra-ui/react';
import {
    getProcessStepBySlug,
    getAllProcessSteps,
    type ContentPoint,
    type ContentVisual,
} from '@/src/lib/data/process';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface ProcessStepDetailPageProps { params: { slug: string }; }

const DynamicLucideIcon: React.FC<{ name: string | undefined | null; } & Omit<LucideProps, 'ref' | 'children'>> = ({ name, ...props }) => {
  if (name && Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    const IconComponent = (LucideIcons as any)[name];
    if (typeof IconComponent === 'function') {
      return React.createElement(IconComponent, props);
    }
  }
  const FallbackIcon = (LucideIcons as any)['Shapes']; 
  if (typeof FallbackIcon === 'function') {
    return React.createElement(FallbackIcon, props);
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

  if (allProcessStepsForNav.length > 0) {
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
              {icon && (
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
              {detailContent.main_heading && <Heading as="h2" size="xl" mb={2}>{detailContent.main_heading}</Heading>}
              {detailContent.introduction && <Text fontSize="lg" lineHeight="tall" whiteSpace="pre-line">{detailContent.introduction}</Text>}
              
              {detailContent.sub_steps && detailContent.sub_steps.length > 0 && (
                <Box mt={4}>
                  {detailContent.sub_steps.map((subStep: ContentPoint, index: number) => (
                    <Box key={index} mb={5} p={4} borderWidth="1px" borderRadius="md" borderColor="border">
                      {subStep.title && <Heading as="h3" size="lg" mb={2}>{subStep.title}</Heading>}
                      <Text whiteSpace="pre-line" mb={subStep.items && subStep.items.length > 0 ? 2 : 0}>{subStep.description || ''}</Text>
                      {subStep.items && subStep.items.length > 0 && (
                        <UnorderedList spacing={1} pl={5} mt={2}>
                          {subStep.items.map((item: string, itemIndex: number) => (<ListItem key={itemIndex}>{item}</ListItem>))}
                        </UnorderedList>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {detailContent.insights?.items && detailContent.insights.items.length > 0 && (
                <Box mt={4}>
                  <Heading as="h3" size="lg" mb={2}>{detailContent.insights.title || "Insights"}</Heading>
                  <UnorderedList spacing={1} pl={5}>
                    {detailContent.insights.items.map((item: string, index: number) => (<ListItem key={index}>{item}</ListItem>))}
                  </UnorderedList>
                </Box>
              )}

              {detailContent.visuals && detailContent.visuals.length > 0 && (
                <Box mt={6}>
                  <Heading as="h2" size="xl" mb={4}>Visuals</Heading>
                  <SimpleGrid columns={{ base: 1, md: detailContent.visuals.length > 1 ? 2 : 1 }} spacing={6}>
                    {detailContent.visuals.map((visual: ContentVisual, index: number) => (
                      visual.url ? (
                        <VStack key={index} spacing={2} alignItems="center">
                          <Image src={visual.url} alt={visual.alt || `Process visual ${String(index + 1)}`} borderRadius="md" boxShadow="sm" maxH="400px" objectFit="contain"/>
                          {visual.caption && <Text fontSize="sm" color="muted.foreground" textAlign="center">{visual.caption}</Text>}
                        </VStack>
                      ) : null ))}
                  </SimpleGrid>
                </Box>
              )}
              {detailContent.conclusion && <Text fontSize="lg" lineHeight="tall" mt={6} whiteSpace="pre-line">{detailContent.conclusion}</Text>}
            </VStack>
          ) : (<Text>Detailed content for this process step is not yet available.</Text>)}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousStepLink} nextPage={nextStepLink} basePath="/process" />
    </Layout>
  );
}

export async function generateMetadata( props: ProcessStepDetailPageProps, _parent: ResolvingMetadata ): Promise<Metadata> {
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
  
  if (step.content?.visuals?.length && step.content.visuals[0].url) {
    openGraphImages.push({ url: step.content.visuals[0].url, alt: step.content.visuals[0].alt || step.title });
  }

  return {
    title: `${step.title} | Our Process | Coriyon's Studio`,
    description: description,
    openGraph: {
      title: `${step.title} | Our Process`,
      description: description,
      type: 'article',
      url: `/process/${slug}`,
      images: openGraphImages.length > 0 ? openGraphImages : undefined,
    }, 
  };
}