// src/app/(resources)/process/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  VStack,
  SimpleGrid,
  Image,
  Box,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  OrderedList,
  ListItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  CardFooter,
} from '@chakra-ui/react';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import { getPageDataBySlug, getNavigablePages } from '@/src/lib/data/pages';
import { getAllProcessSteps, type ProcessStepItem } from '@/src/lib/data/process';
import type { FAQItem, FAQAnswerBlock } from '@/src/lib/data/faqs';
import type { UxProblemCardItem } from '@/src/lib/data/ux_problems';
import PrevNextNavigation, {
  type NavLinkInfo as PrevNextNavLinkInfo,
} from '@/src/components/common/prev-next-navigation';
import { mapPageTypeToCategoryLabel } from '@/src/lib/utils';
import type { Metadata } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const SLUG = 'process';

// --- Type Definitions ---
interface ProcessPageCmsContent {
  hero?: { headline?: string };
  intro_text?: string;
  relatedFaqs?: FAQItem[];
  relatedUxProblems?: UxProblemCardItem[];
}

interface ProcessPageProps {
  params: unknown;
}

// --- Helper Components ---
const DynamicLucideIcon: React.FC<{ name: string | null | undefined } & LucideProps> = ({ name, ...props }) => {
  if (name && name in LucideIcons) {
    // Disabling ESLint here is a pragmatic choice. The lucide-react library's types
    // do not support dynamic string-based lookups without triggering type errors.
    // This 'any' cast is a controlled escape hatch to solve the issue.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent {...props} />;
    }
  }
  return <LucideIcons.HelpCircle {...props} />;
};

const BlockRenderer: React.FC<{ block: FAQAnswerBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const data = block.data as { level?: number; text?: string };
      const level = `h${String(data.level || 3)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <Heading as={level} size="md" my={3}>
          {data.text}
        </Heading>
      );
    }
    case 'paragraph': {
      const data = block.data as { text?: string };
      return (
        <Text my={2} lineHeight="tall">
          {data.text}
        </Text>
      );
    }
    case 'list': {
      const data = block.data as { style?: 'ordered' | 'unordered'; items?: string[] };
      const ListComponent = data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={1} my={2} pl={5}>
          {data.items?.map((item: string, index: number) => <ListItem key={index}>{item}</ListItem>)}
        </ListComponent>
      );
    }
    default:
      return null;
  }
};

const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {};

// --- Page Component ---
export default async function ProcessPage({ params: _params }: ProcessPageProps) {
  const pageCmsData = await getPageDataBySlug(SLUG);
  const allProcessSteps = await getAllProcessSteps();
  const navigablePages = await getNavigablePages();

  let previousPageLink: PrevNextNavLinkInfo | undefined;
  let nextPageLink: PrevNextNavLinkInfo | undefined;
  if (pageCmsData) {
    const currentPageIndex = navigablePages.findIndex(p => p.slug === pageCmsData.slug);
    if (currentPageIndex > 0) {
      const prev = navigablePages[currentPageIndex - 1];
      previousPageLink = { slug: prev.slug, title: prev.title, categoryLabel: mapPageTypeToCategoryLabel(prev.page_type) };
    }
    if (currentPageIndex < navigablePages.length - 1) {
      const next = navigablePages[currentPageIndex + 1];
      nextPageLink = { slug: next.slug, title: next.title, categoryLabel: mapPageTypeToCategoryLabel(next.page_type) };
    }
  }

  if (!pageCmsData) {
    return (
      <Layout>
        <Section id="error-process" py={{ base: 16, md: 24 }} textAlign="center">
          <Heading as="h1" size="2xl">
            Page Not Found
          </Heading>
          <Text>The content for the Process page could not be loaded.</Text>
        </Section>
      </Layout>
    );
  }

  const cmsContent = pageCmsData.content as ProcessPageCmsContent | null;
  const relatedFaqs = cmsContent?.relatedFaqs;
  const relatedUxProblems = cmsContent?.relatedUxProblems;

  return (
    <Layout>
      <Section id={pageCmsData.slug} py={{ base: 12, md: 20 }} as="article">
        <VStack spacing={12} alignItems="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="3xl" mb={6}>
              {pageCmsData.title}
            </Heading>
            {cmsContent?.intro_text && (
              <Text fontSize="xl" color="muted.foreground" maxW="3xl" mx="auto">
                {cmsContent.intro_text}
              </Text>
            )}
          </Box>

          {allProcessSteps.length > 0 && (
            <VStack spacing={8} align="stretch">
              {allProcessSteps.map((step: ProcessStepItem, index: number) => (
                <Card key={step.id} variant="outline" overflow="hidden">
                  <SimpleGrid columns={{ base: 1, md: 5 }} spacing={0}>
                    <Box gridColumn={{ base: 'auto', md: 'span 2' }}>
                      {step.featured_image_url && (
                        <Image src={step.featured_image_url} alt={step.title} objectFit="cover" w="full" h="full" />
                      )}
                    </Box>
                    <Box gridColumn={{ base: 'auto', md: 'span 3' }}>
                      <CardHeader>
                        <HStack>
                          <Text fontSize="5xl" fontWeight="bold" color="primary.500" lineHeight="1" mr={2}>
                            {String(index + 1).padStart(2, '0')}
                          </Text>
                          <VStack align="start" spacing={0}>
                            <Heading size="lg" as="h3">
                              {step.title}
                            </Heading>
                            <Text color="muted.foreground" fontSize="md">
                              {step.subtitle}
                            </Text>
                          </VStack>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <Text color="muted.foreground" mb={4}>
                          {step.description}
                        </Text>
                        {step.content?.key_activities && (
                          <Text fontSize="sm">
                            <strong>Key Activities:</strong> {step.content.key_activities}
                          </Text>
                        )}
                      </CardBody>
                      <CardFooter>
                        <HeroCtaButton href={`/process/${step.slug}`} size="sm" variant="outline">
                          Learn More
                        </HeroCtaButton>
                      </CardFooter>
                    </Box>
                  </SimpleGrid>
                </Card>
              ))}
            </VStack>
          )}

          {relatedUxProblems && relatedUxProblems.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Guiding Principles
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {relatedUxProblems.map((problem: UxProblemCardItem) => (
                  <Card key={problem.id} variant="outline" h="full">
                    <CardHeader>
                      <HStack spacing={3}>
                        {problem.icon?.name && <DynamicLucideIcon name={problem.icon.name} size={22} color="var(--chakra-colors-blue-500)" />}
                        <Heading size="md" as="h3">
                          {problem.title}
                        </Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <Text noOfLines={3}>{problem.description}</Text>
                    </CardBody>
                    <CardFooter>
                      <HeroCtaButton href={`/ux-problems/${problem.slug}`} variant="ghost" size="sm">
                        Read More
                      </HeroCtaButton>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {relatedFaqs && relatedFaqs.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                Related Questions
              </Heading>
              <Accordion allowMultiple maxW="container.md" mx="auto">
                {relatedFaqs.map((faq: FAQItem, _index: number) => (
                  <AccordionItem key={faq.id} mb={2}>
                    <h2>
                      <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="lg">
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} pt={4} borderWidth="1px" borderTopWidth="0" borderColor="border">
                      {faq.answer?.blocks?.map((block, i) => <BlockRenderer key={block.id || `faq-block-${String(i)}`} block={block} />)}
                      {faq.answer?.markdown && (
                        <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                          {faq.answer.markdown}
                        </ReactMarkdown>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
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

export async function generateMetadata({ params: _params }: ProcessPageProps): Promise<Metadata> {
  const pageData = await getPageDataBySlug(SLUG);
  if (!pageData) {
    return { title: 'Process | Coriyon’s Studio' };
  }
  const title = pageData.title;
  const description = pageData.meta_description || "An overview of the design and development process at Coriyon's Studio.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${SLUG}`,
      images: pageData.og_image_url ? [{ url: pageData.og_image_url }] : undefined,
    },
  };
}