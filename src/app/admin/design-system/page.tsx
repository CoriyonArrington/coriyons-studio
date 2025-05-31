// src/app/admin/design-system/page.tsx
// REFACTOR STATUS: All sections refactored.
'use client';

import React from 'react';
import {
  Box,
  Container,
  Link as ChakraLink,
  VStack,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';

// Typography components are still needed for page title/description
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

// Import all refactored showcase components
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
  {
    id: "layout-primitives",
    title: "Layout & Sectioning",
    componentLinks: [
      { href: "#section-component-showcase", text: "Section Component" },
      { href: "#content-section-component-showcase", text: "ContentSection Component" },
    ]
  },
  {
    id: "components", title: "Chakra Components",
    componentLinks: [
       { href: "#chakra-buttons", text: "Buttons"},
       { href: "#chakra-badges", text: "Badges"},
       { href: "#chakra-forms", text: "Form Elements"},
       { href: "#chakra-loading-states", text: "Loading States"},
    ]
  },
  {
    id: "custom-components", title: "Custom Project Components",
    componentLinks: [
      { href: "#custom-layout", text: "Layout" },
      { href: "#custom-site-header", text: "SiteHeader" },
      { href: "#custom-site-footer", text: "SiteFooter" },
      { href: "#custom-form", text: "Form (Custom)" },
      { href: "#custom-form-field", text: "FormField (Custom)" },
      { href: "#custom-form-message", text: "FormMessage" },
      { href: "#custom-submit-button", text: "SubmitButton" },
      { href: "#custom-header-auth", text: "HeaderAuth" },
      { href: "#custom-theme-switcher", text: "ThemeSwitcher" },
      { href: "#custom-button-primitive", text: "Button (Primitive)" },
      { href: "#hero-cta-button-component-showcase", text: "HeroCtaButton" },
      { href: "#custom-card-primitive", text: "Card (Primitive)" },
      { href: "#custom-input-primitive", text: "Input (Primitive)" },
      { href: "#custom-modal-primitive", text: "Modal (Primitive)" },
      { href: "#custom-spinner-primitive", text: "Spinner (Primitive)" },
      { href: "#custom-theme-syncer", text: "ChakraNextThemeSyncer" },
      { href: "#custom-toaster", text: "Toaster" },
      { href: "#custom-theme-provider", text: "ThemeProvider" },
    ]
  },
];

export default function DesignSystemPage() {
  const listItemHoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Container maxW="container.xl" py={10}>
      <Box as="header" mb={12}>
        <CustomHeading as="h1" size="2xl" mb={4}>Design System - Chakra UI</CustomHeading>
        <CustomText fontSize="xl" color="gray.600">
          Visual guide to project tokens and components using Chakra UI.
        </CustomText>
      </Box>

      <Box as="nav" mb={16} p={4} borderWidth="1px" borderRadius="lg" borderColor="border">
        <CustomHeading as="h4" size="md" mb={3}>On This Page</CustomHeading>
        <List>
          {sections.map((section) => (
            <ListItem
              key={section.id}
              _hover={{ bg: listItemHoverBg }} 
              py={1} px={2}
              borderRadius="md"
            >
              <ChakraLink href={`#${section.id}`} _hover={{ textDecoration: 'none', color: "primary.DEFAULT" }} fontWeight="medium">
                {section.title}
              </ChakraLink>
              {section.componentLinks && (
                <List pl={4} mt={1.5} >
                   {section.componentLinks.map(link => (
                     <ListItem key={link.href} py={0.5}>
                       <ChakraLink href={link.href} fontSize="sm" _hover={{ textDecoration: 'underline', color: "primary.DEFAULT" }}>
                         {link.text}
                       </ChakraLink>
                     </ListItem>
                   ))}
                </List>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      <VStack alignItems="stretch" spacing={16}>
        <ColorSystemShowcase />
        <TypographyShowcase />
        <SpacingLayoutShowcase />
        <BreakpointsShowcase />
        <BorderRadiusShowcase />
        <ShadowsShowcase />
        <AnimationsMotionShowcase />
        <IconographyShowcase />
        <LayoutPrimitivesShowcase />
        <ChakraComponentsShowcase />
        <CustomProjectComponentsShowcase />
      </VStack>
    </Container>
  );
}