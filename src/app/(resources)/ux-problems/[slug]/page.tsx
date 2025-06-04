// src/app/(resources)/ux-problems/[slug]/page.tsx
// NO 'use client' - Server Component
// - Added section to display Related Solutions.

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { Box, VStack, UnorderedList, ListItem, HStack, Divider, SimpleGrid } from '@chakra-ui/react';
import {
    getUxProblemBySlug,
    getAllUxProblems,
    // type UxProblemDetail, // Removed
    // type UxProblemCardItem, // Removed
    // type UxProblemContentJson, // Removed
    // type IconData // Removed
} from '@/src/lib/data/ux_problems';
import type { UxSolutionCardItem } from '@/src/lib/data/ux_solutions'; 
import { UICard, UICardHeader, UICardBody, UICardHeading, UICardText, UICardFooter } from '@/src/components/ui/card'; 
import HeroCtaButton from '@/src/components/common/hero-cta-button'; 
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
// import NextLink from 'next/link'; // NextLink removed
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const DynamicLucideIcon: React.FC<{ name: string | undefined | null; } & Omit<LucideProps, 'ref' | 'children'>> = ({ name, ...props }) => {
  if (!name) {
    return <LucideIcons.AlertTriangle {...props} />;
  }
  if (Object.prototype.hasOwnProperty.call(LucideIcons, name)) {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent && (typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent.$$typeof === Symbol.for('react.forward_ref')))) {
      return React.createElement(IconComponent as React.ComponentType<LucideProps>, props);
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Lucide icon "${name}" not found or invalid in ux-problems/[slug]/page.tsx. Rendering fallback 'AlertTriangle'.`);
  }
  return <LucideIcons.AlertTriangle {...props} />;
};

interface UxProblemDetailPageProps {
  params: { slug: string };
}

const renderContentSection = (title: string, items: string[] | undefined) => {
  if (!items || items.length === 0) return null;
  return (
    <Box mt={6}>
      <Heading as="h3" size="md" mb={3} borderBottomWidth="1px" borderColor="border" pb={2}>
        {title}
      </Heading>
      <UnorderedList spacing={2} pl={5}>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

const renderRealWorldExamples = (examples: Array<{ example: string; impact: string }> | undefined) => {
  if (!examples || examples.length === 0) return null;
  return (
    <Box mt={6}>
      <Heading as="h3" size="md" mb={3} borderBottomWidth="1px" borderColor="border" pb={2}>
        Real-World Examples
      </Heading>
      <VStack spacing={4} alignItems="stretch">
        {examples.map((ex, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="md" borderColor="border.subtle">
            <Text fontWeight="semibold">Example: {ex.example}</Text>
            <Text fontSize="sm" color="muted.foreground">Impact: {ex.impact}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default async function UxProblemDetailPage({ params }: UxProblemDetailPageProps) {
  const { slug } = params;
  const [problem, allUxProblemsForNav] = await Promise.all([
    getUxProblemBySlug(slug), 
    getAllUxProblems()
  ]);

  if (!problem) {
    notFound();
  }

  let previousProblemLink: PrevNextNavLinkInfo | undefined;
  let nextProblemLink: PrevNextNavLinkInfo | undefined;

  if (allUxProblemsForNav && allUxProblemsForNav.length > 0) {
    const currentIndex = allUxProblemsForNav.findIndex(p => p.slug === problem.slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        const prevProblem = allUxProblemsForNav[currentIndex - 1];
        previousProblemLink = { slug: prevProblem.slug, title: prevProblem.title, categoryLabel: "Previous Problem" };
      }
      if (currentIndex < allUxProblemsForNav.length - 1) {
        const nextProblem = allUxProblemsForNav[currentIndex + 1];
        nextProblemLink = { slug: nextProblem.slug, title: nextProblem.title, categoryLabel: "Next Problem" };
      }
    }
  }

  const { title, description, icon, content, relatedSolutions } = problem;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} alignItems="stretch" maxW="container.lg" mx="auto">
          <VStack spacing={3} alignItems="center" textAlign="center" mb={8}>
            {icon && icon.name && (
              <Box mb={2}>
                <DynamicLucideIcon
                  name={icon.icon_library === 'lucide-react' ? icon.name : undefined}
                  size={40}
                  color="var(--chakra-colors-primary-500)"
                  strokeWidth={2.5}
                />
              </Box>
            )}
            <Heading as="h1" size="2xl" color="foreground">
              {title}
            </Heading>
            {description && (
              <Text fontSize="xl" color="muted.foreground" maxW="2xl" mt={2}>
                {description}
              </Text>
            )}
          </VStack>
          <Divider my={6} />

          {content ? (
            <Box>
              {renderContentSection("Common Symptoms", content.symptoms)}
              {renderContentSection("Potential Causes", content.potential_causes)}
              {renderRealWorldExamples(content.real_world_examples)}
              {renderContentSection("Key Questions to Ask", content.questions_to_ask)}
            </Box>
          ) : (
            <Text>Detailed content for this UX problem is not yet available.</Text>
          )}

          {relatedSolutions && relatedSolutions.length > 0 && (
            <Box mt={12}>
              <Heading as="h2" size="xl" mb={6} borderTopWidth="1px" borderColor="border" pt={6}>
                Related Solutions
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {relatedSolutions.map((solution: UxSolutionCardItem) => (
                  <UICard key={solution.id} variant="outlineFilled" h="full" display="flex" flexDirection="column">
                    <UICardHeader>
                      <HStack spacing={3} alignItems="center">
                        {solution.icon && solution.icon.name && (
                           <DynamicLucideIcon
                             name={solution.icon.icon_library === 'lucide-react' ? solution.icon.name : undefined}
                             size={22}
                             color="var(--chakra-colors-green-500)" 
                             strokeWidth={2.5}
                           />
                        )}
                        <UICardHeading size="md" as="h3">{solution.title}</UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody flexGrow={1}>
                      <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                        {solution.description || "Learn more about this solution."}
                      </UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-solutions/${solution.slug}`} size="sm" variant="outline" width="full">
                        Explore Solution
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousProblemLink} nextPage={nextProblemLink} basePath="/ux-problems" />
    </Layout>
  );
}

export async function generateMetadata(
  { params }: UxProblemDetailPageProps,
  _parent: ResolvingMetadata // parent renamed to _parent
): Promise<Metadata> {
  const slug = params.slug;
  const problem = await getUxProblemBySlug(slug); 

  if (!problem) {
    return {
      title: 'UX Problem Not Found | Coriyon\'s Studio',
      description: 'The requested UX problem could not be found.'
    };
  }

  const pageTitle = `${problem.title} | UX Problems | Coriyon's Studio`;
  const metaDescription = problem.description || `Learn about the UX problem: ${problem.title}.`;

  return {
    title: pageTitle,
    description: metaDescription,
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: `/ux-problems/${slug}`,
      type: 'article',
    },
  };
}