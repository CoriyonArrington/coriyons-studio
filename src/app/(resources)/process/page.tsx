import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  VStack, SimpleGrid, Image, Box, HStack, Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon, Card, CardHeader, CardBody, Heading, Text, CardFooter, Icon
} from '@chakra-ui/react';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { getPageBySlug, getNavigablePages } from '@/src/lib/data/pages';
import { getAllProcessSteps } from '@/src/lib/data/process';
import PrevNextNavigation, { type NavLinkInfo } from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import { getIcon } from '@/src/lib/data/icons';

const SLUG = 'process';

// A simple, local function to render an icon without a separate component file.
const renderIcon = (name: string | null | undefined, props: object) => {
  const IconComponent = getIcon(name);
  return <Icon as={IconComponent} {...props} />;
};

interface FAQAnswerBlock { id?: string; type: string; data: { text?: string }; }
interface FAQItem { id: string; question: string; answer?: { blocks: FAQAnswerBlock[]; } | null; }
interface UxProblemCardItem { id: string; slug: string; title: string; description: string | null; icon?: { name: string } | null; }
interface ProcessPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedFaqs?: FAQItem[];
  relatedUxProblems?: UxProblemCardItem[];
}

export default async function ProcessPage() {
  const [pageCmsData, allProcessSteps, navigablePages] = await Promise.all([
    getPageBySlug(SLUG),
    getAllProcessSteps(),
    getNavigablePages(),
  ]);

  let previousPageLink: NavLinkInfo | undefined, nextPageLink: NavLinkInfo | undefined;
  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(p => p.slug === pageCmsData.slug);
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

  if (!pageCmsData) return <Layout><Section id="error-process" py={{ base: 16, md: 24 }} textAlign="center"><Heading size="2xl">Page Not Found</Heading></Section></Layout>;
  
  const cmsContent = pageCmsData.content as ProcessPageCmsContent | null;

  return (
    <Layout>
      <Section id={pageCmsData.slug} py={{ base: 12, md: 20 }} as="article">
        <VStack spacing={12} alignItems="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>{pageCmsData.title}</Heading>
            {cmsContent?.intro_text && <Text fontSize="xl" color="muted.foreground" maxW="3xl" mx="auto">{cmsContent.intro_text}</Text>}
          </Box>
          {allProcessSteps.length > 0 && (
            <VStack spacing={8} align="stretch">
              {allProcessSteps.map((step, index) => (
                <Card key={step.id} variant="outline" overflow="hidden">
                  <SimpleGrid columns={{ base: 1, md: 5 }} spacing={0}>
                    <Box gridColumn={{ base: 'auto', md: 'span 2' }}>{step.featured_image_url && <Image src={step.featured_image_url} alt={step.title} objectFit="cover" w="full" h="full" />}</Box>
                    <Box gridColumn={{ base: 'auto', md: 'span 3' }}>
                      <CardHeader><HStack><Text fontSize="5xl" fontWeight="bold" color="primary.500" lineHeight="1" mr={2}>{String(index + 1).padStart(2, '0')}</Text><VStack align="start" spacing={0}><Heading size="lg" as="h3">{step.title}</Heading>{step.subtitle && <Text color="muted.foreground" fontSize="md">{step.subtitle}</Text>}</VStack></HStack></CardHeader>
                      <CardBody><Text color="muted.foreground" mb={4}>{step.description}</Text>{step.content?.key_activities && <Text fontSize="sm"><strong>Key Activities:</strong> {step.content.key_activities}</Text>}</CardBody>
                      <CardFooter><HeroCtaButton href={`/process/${step.slug}`} size="sm" variant="outline">Learn More</HeroCtaButton></CardFooter>
                    </Box>
                  </SimpleGrid>
                </Card>
              ))}
            </VStack>
          )}
          {cmsContent?.relatedUxProblems && cmsContent.relatedUxProblems.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">Guiding Principles</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {cmsContent.relatedUxProblems.map(problem => (
                  <Card key={problem.id} variant="outline" h="full">
                    <CardHeader><HStack spacing={3}>{renderIcon(problem.icon?.name, { size: 22, color: "var(--chakra-colors-blue-500)" })}<Heading size="md" as="h3">{problem.title}</Heading></HStack></CardHeader>
                    <CardBody><Text noOfLines={3}>{problem.description}</Text></CardBody>
                    <CardFooter><HeroCtaButton href={`/ux-problems/${problem.slug}`} variant="ghost" size="sm">Read More</HeroCtaButton></CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}
          {cmsContent?.relatedFaqs && cmsContent.relatedFaqs.length > 0 && (
             <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
               <Heading as="h2" size="xl" mb={10} textAlign="center">Related Questions</Heading>
               <Accordion allowMultiple maxW="container.md" mx="auto">
                 {cmsContent.relatedFaqs.map(faq => (
                   <AccordionItem key={faq.id} mb={2}><h2><AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}><Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="lg">{faq.question}</Box><AccordionIcon /></AccordionButton></h2><AccordionPanel pb={4} pt={4} borderWidth="1px" borderTopWidth="0" borderColor="border">{faq.answer?.blocks?.map(block => <Text key={block.id}>{block.data.text}</Text>)}</AccordionPanel></AccordionItem>
                 ))}
               </Accordion>
             </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPageLink} nextPage={nextPageLink} />
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const pageCmsData = await getPageBySlug(SLUG);
  if (!pageCmsData) return { title: 'Process | Coriyon’s Studio' };
  const {title, meta_description, og_image_url} = pageCmsData;
  const description = meta_description || "An overview of the design and development process at Coriyon's Studio.";
  return { title, description, openGraph: { title, description, url: `/${SLUG}`, images: og_image_url ? [{ url: og_image_url }] : undefined } };
}