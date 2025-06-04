// src/app/(resources)/ux-solutions/[slug]/page.tsx
// NO 'use client' - Server Component
// - Added section to display Related Problems.

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { Box, VStack, UnorderedList, ListItem, HStack, Divider, SimpleGrid } from '@chakra-ui/react';
import {
    getUxSolutionBySlug,
    getAllUxSolutions, 
    // type UxSolutionDetail, // Removed
    // type UxSolutionContentJson, // Removed
    // type IconData // Removed
} from '@/src/lib/data/ux_solutions'; 
import type { UxProblemCardItem } from '@/src/lib/data/ux_problems'; 
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
    console.warn(`Lucide icon "${name}" not found or invalid in ux-solutions/[slug]/page.tsx. Rendering fallback 'AlertTriangle'.`);
  }
  return <LucideIcons.AlertTriangle {...props} />;
};

interface UxSolutionDetailPageProps {
  params: { slug: string };
}

const renderContentListSection = (title: string, items: string[] | undefined) => {
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

const renderContentParagraphSection = (title: string, text: string | undefined) => {
  if (!text) return null;
  return (
    <Box mt={6}>
      <Heading as="h3" size="md" mb={3} borderBottomWidth="1px" borderColor="border" pb={2}>
        {title}
      </Heading>
      <Text whiteSpace="pre-line">{text}</Text>
    </Box>
  );
};

export default async function UxSolutionDetailPage({ params }: UxSolutionDetailPageProps) {
  const { slug } = params;
  const [solution, allUxSolutionsForNav] = await Promise.all([
    getUxSolutionBySlug(slug), 
    getAllUxSolutions()
  ]);

  if (!solution) {
    notFound();
  }

  let previousSolutionLink: PrevNextNavLinkInfo | undefined;
  let nextSolutionLink: PrevNextNavLinkInfo | undefined;

  if (allUxSolutionsForNav && allUxSolutionsForNav.length > 0) {
    const currentIndex = allUxSolutionsForNav.findIndex(s => s.slug === solution.slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        const prevSolution = allUxSolutionsForNav[currentIndex - 1];
        previousSolutionLink = { slug: prevSolution.slug, title: prevSolution.title, categoryLabel: "Previous Solution" };
      }
      if (currentIndex < allUxSolutionsForNav.length - 1) {
        const nextSolution = allUxSolutionsForNav[currentIndex + 1];
        nextSolutionLink = { slug: nextSolution.slug, title: nextSolution.title, categoryLabel: "Next Solution" };
      }
    }
  }

  const { title, description, icon, content, relatedProblems } = solution; 

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
                  color="var(--chakra-colors-green-500)" 
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
              {renderContentListSection("Key Benefits", content.key_benefits)}
              {renderContentParagraphSection("Approach Summary", content.approach_summary)}
              {renderContentParagraphSection("Deliverables Summary", content.deliverables_summary)}
              {renderContentListSection("Tools Used", content.tools_used)}
            </Box>
          ) : (
            <Text>Detailed content for this UX solution is not yet available.</Text>
          )}

          {relatedProblems && relatedProblems.length > 0 && (
            <Box mt={12}>
              <Heading as="h2" size="xl" mb={6} borderTopWidth="1px" borderColor="border" pt={6}>
                Addresses These UX Problems
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {relatedProblems.map((problem: UxProblemCardItem) => (
                  <UICard key={problem.id} variant="outlineFilled" h="full" display="flex" flexDirection="column">
                    <UICardHeader>
                      <HStack spacing={3} alignItems="center">
                        {problem.icon && problem.icon.name && (
                           <DynamicLucideIcon
                             name={problem.icon.icon_library === 'lucide-react' ? problem.icon.name : undefined}
                             size={22}
                             color="var(--chakra-colors-primary-500)" 
                             strokeWidth={2.5}
                           />
                        )}
                        <UICardHeading size="md" as="h3">{problem.title}</UICardHeading>
                      </HStack>
                    </UICardHeader>
                    <UICardBody flexGrow={1}>
                      <UICardText color="muted.foreground" mb={4} noOfLines={3}>
                        {problem.description || "More details about this UX problem."}
                      </UICardText>
                    </UICardBody>
                    <UICardFooter>
                      <HeroCtaButton href={`/ux-problems/${problem.slug}`} size="sm" variant="outline" width="full">
                        View Problem Details
                      </HeroCtaButton>
                    </UICardFooter>
                  </UICard>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousSolutionLink} nextPage={nextSolutionLink} basePath="/ux-solutions" />
    </Layout>
  );
}

export async function generateMetadata(
  { params }: UxSolutionDetailPageProps,
  _parent: ResolvingMetadata // parent renamed to _parent
): Promise<Metadata> {
  const slug = params.slug;
  const solution = await getUxSolutionBySlug(slug); 

  if (!solution) {
    return {
      title: 'UX Solution Not Found | Coriyon\'s Studio',
      description: 'The requested UX solution could not be found.'
    };
  }

  const pageTitle = `${solution.title} | UX Solutions | Coriyon's Studio`;
  const metaDescription = solution.description || `Learn about the UX solution: ${solution.title}.`;

  return {
    title: pageTitle,
    description: metaDescription,
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: `/ux-solutions/${slug}`,
      type: 'article',
    },
  };
}