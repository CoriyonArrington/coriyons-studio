/*
 FINAL VERSION - Key Changes:
 - The horizontal padding (`px`) on the main <Section> components has been updated
   to use responsive values, providing more breathing room on larger screens.
   - Mobile: 24px (theme value `6`)
   - Tablet: 32px (theme value `8`)
   - Desktop: 64px (theme value `16`)
*/
'use client';

import React from 'react';
import {
  Box,
  Link as ChakraLink,
  VStack,
  List,
  ListItem,
  useColorModeValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import Section from '@/src/components/common/section';

// Import all showcase components
import ColorSystemShowcase from '@/src/components/admin/color-system-showcase';
import TypographyShowcase from '@/src/components/admin/typography-showcase';
import SpacingLayoutShowcase from '@/src/components/admin/spacing-layout-showcase';
import BreakpointsShowcase from '@/src/components/admin/breakpoints-showcase';
import BorderRadiusShowcase from '@/src/components/admin/border-radius-showcase';
import ShadowsShowcase from '@/src/components/admin/shadows-showcase';
import AnimationsMotionShowcase from '@/src/components/admin/animations-motion-showcase';
import IconographyShowcase from '@/src/components/admin/iconography-showcase';
import LayoutPrimitivesShowcase from '@/src/components/admin/layout-primitives-showcase';
import ChakraComponentsShowcase from '@/src/components/admin/chakra-components-showcase';
import CustomProjectComponentsShowcase from '@/src/components/admin/custom-project-components-showcase';

interface SectionLink { href: string; text: string; }
interface SectionType { id: string; title: string; componentLinks?: SectionLink[]; }

const sections: SectionType[] = [
    { id: "colors", title: "Color System" },
    { id: "typography", title: "Typography" },
    { id: "spacing", title: "Spacing & Layout" },
    { id: "breakpoints", title: "Breakpoints" },
    { id: "borderradius", title: "Border Radius" },
    { id: "shadows", title: "Shadows" },
    { id: "animations", title: "Animations & Motion" },
    { id: "iconography", title: "Iconography" },
    { id: "layout-primitives", title: "Layout & Sectioning" },
    { id: "components", title: "Chakra Components" },
    { id: "custom-components", title: "Custom Project Components" },
];


export default function DesignSystemPage() {
  const listItemHoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box>
      {/* Top content is contained with updated responsive padding */}
      <Section py={10} px={{ base: 6, md: 8, lg: 16 }} containerMaxWidth="container.lg">
        <Box as="header" mb={12}>
          <Heading as="h1" size="2xl" mb={4}>Design System</Heading>
          <Text fontSize="xl" color="muted.foreground">
            A visual guide to the project's tokens, components, and brand standards.
          </Text>
        </Box>

        <Box as="nav" mb={16} p={4} borderWidth="1px" borderRadius="lg" borderColor="border">
          <Heading as="h4" size="md" mb={3}>On This Page</Heading>
          <List>
            {sections.map((section) => (
              <ListItem
                key={section.id}
                _hover={{ bg: listItemHoverBg }} 
                py={1} px={2}
                borderRadius="md"
              >
                <ChakraLink href={`#${section.id}`} _hover={{ textDecoration: 'none' }} fontWeight="medium">
                  {section.title}
                </ChakraLink>
              </ListItem>
            ))}
          </List>
        </Box>
      </Section>
      
      {/* Each showcase component now controls its own padding via the Section component */}
      <VStack alignItems="stretch" spacing={0} divider={<Box as="hr" borderColor="border" />}>
        <Section px={{ base: 6, md: 8, lg: 16 }}><ColorSystemShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><TypographyShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><SpacingLayoutShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><BreakpointsShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><BorderRadiusShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><ShadowsShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><AnimationsMotionShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><IconographyShowcase /></Section>
        
        {/* This showcase handles its own sections/containers internally, so it doesn't get wrapped */}
        <LayoutPrimitivesShowcase />

        <Section px={{ base: 6, md: 8, lg: 16 }}><ChakraComponentsShowcase /></Section>
        <Section px={{ base: 6, md: 8, lg: 16 }}><CustomProjectComponentsShowcase /></Section>
      </VStack>
    </Box>
  );
}