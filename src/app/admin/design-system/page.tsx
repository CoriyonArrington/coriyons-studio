// app/admin/design-system/page.tsx
'use client';

import React from 'react';
import {
  Box, Container, Link as ChakraLink,
  VStack, HStack, SimpleGrid, Code, Badge, // Removed Button, Input, Heading, Text direct imports
  Skeleton, SkeletonText, Icon,
  List,
  ListItem,
  Divider,
  UnorderedList,
  OrderedList,
  useColorModeValue,
  FormErrorMessage,
  SkeletonCircle,
  useDisclosure,
  Button as ChakraButton, // Aliased Chakra UI Button
  Input as ChakraInput,   // Aliased Chakra UI Input
} from "@chakra-ui/react";

import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { Home as HomeIconSvg, Settings as SettingsIconSvg, ExternalLinkIcon } from 'lucide-react';
import type { User } from "@supabase/supabase-js";

// --- Import Your Custom Components ---

// Common
import SiteFooter from "@/src/components/common/site-footer";
import SiteHeader from "@/src/components/common/site-header";
// import Layout from "@/src/components/common/layout"; // Example: Not used directly to wrap page here, but listed as a custom component

// Forms
import { FormMessage, type Message as FormMessageType } from '@/src/components/forms/form-message';
import { SubmitButton } from '@/src/components/forms/submit-button';
import { default as CustomForm } from '@/src/components/forms/form';
import { default as CustomFormField } from '@/src/components/forms/form-field';

// Navigation
import AuthButton from '@/src/components/navigation/header-auth';
import { ThemeSwitcher } from '@/src/components/navigation/theme-switcher';

// Typography
import { TypographyInlineCode } from '@/src/components/typography/inline-code';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

// UI - Existing & Refactored
import { ChakraNextThemeSyncer } from '@/src/components/ui/chakra-next-theme-syncer';
import { toaster } from '@/src/components/ui/toaster';
// import { ThemeProvider as AppThemeProvider } from '@/src/components/ui/theme-provider'; // Ensured this is removed if truly unused

// UI - New Primitives
import Button from '@/src/components/ui/button'; // Custom Button
import { UICard, UICardHeader, UICardBody, UICardFooter, UICardHeading, UICardText } from '@/src/components/ui/card';
import Input from '@/src/components/ui/input'; // Custom Input
import {
  UIModal,
  UIModalOverlay,
  UIModalContent,
  UIModalHeader,
  UIModalBody,
  UIModalFooter,
  UIModalCloseButton
} from '@/src/components/ui/modal';
import Spinner from '@/src/components/ui/spinner';

// Helper function: ChakraColorSwatch
interface ChakraColorSwatchProps {
  title: string;
  themeColorKey: string;
  displayColorValue: string;
  themeTextColorKey: string;
  border?: boolean;
}

function ChakraColorSwatch({ title, themeColorKey, displayColorValue, themeTextColorKey, border = false }: ChakraColorSwatchProps) {
  return (
    <Box textAlign="center">
      <Box h="80px" w="full" borderRadius="md" bg={themeColorKey} borderWidth={border ? "1px" : "0"} display="flex" alignItems="center" justifyContent="center">
        <CustomText fontSize="xs" fontWeight="medium" color={themeTextColorKey}>Aa</CustomText>
      </Box>
      <CustomText fontSize="sm" mt={2} mb={0}>{title}</CustomText>
      <Code fontSize="xs" display="block">{displayColorValue}</Code>
    </Box>
  );
}

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
    id: "components", title: "Chakra Components",
    componentLinks: [
       { href: "#chakra-buttons", text: "Buttons"},
       { href: "#chakra-badges", text: "Badges"},
       { href: "#chakra-forms", text: "Form Elements"},
       { href: "#chakra-loading-states", text: "Loading States"},
    ]
  },
  { id: "custom-components", title: "Custom Project Components" },
];

export default function DesignSystemPage() {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const mockUser: User = {
    id: 'mock-user-id-123',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Jane Doe' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'jane@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
  };
  const noUser: User | null = null;

  const errorFormMessage: FormMessageType = { error: "This is a detailed error message.", title: "Validation Error" };
  const successFormMessage: FormMessageType = { success: "Your profile has been updated successfully!", title: "Update Complete" };
  const infoFormMessage: FormMessageType = { message: "Please note: System maintenance scheduled for midnight.", title: "System Notification" };
  const errorWithoutTitle: FormMessageType = { error: "An unexpected error occurred." };

  const blockquoteBorderColor = useColorModeValue("gray.300", "gray.600");

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
            <ListItem key={section.id} _hover={{ bg: "gray.50" }} py={1} px={2} borderRadius="md">
              <ChakraLink href={`#${section.id}`} _hover={{ textDecoration: 'none', color: "primary.DEFAULT" }} fontWeight="medium">
                {section.title}
              </ChakraLink>
              {section.id === 'components' && section.componentLinks && (
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

        <Box as="section" id="colors">
          <CustomHeading as="h2" size="xl" mb={6}>Color System</CustomHeading>
          <CustomText mb={6}>Defined via CSS variables and mapped to Chakra theme tokens in <Code>src/lib/theme.ts</Code>.</CustomText>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={6}>
            <ChakraColorSwatch title="Primary" themeColorKey="primary.DEFAULT" displayColorValue="var(--primary)" themeTextColorKey="primary.foreground" />
            <ChakraColorSwatch title="Secondary" themeColorKey="secondary.DEFAULT" displayColorValue="var(--secondary)" themeTextColorKey="secondary.foreground" />
            <ChakraColorSwatch title="Destructive" themeColorKey="destructive.DEFAULT" displayColorValue="var(--destructive)" themeTextColorKey="destructive.foreground" />
            <ChakraColorSwatch title="Accent" themeColorKey="accent.DEFAULT" displayColorValue="var(--accent)" themeTextColorKey="accent.foreground" />
            <ChakraColorSwatch title="Background" themeColorKey="background" displayColorValue="var(--background)" themeTextColorKey="foreground" border />
            <ChakraColorSwatch title="Foreground" themeColorKey="foreground" displayColorValue="var(--foreground)" themeTextColorKey="background" border />
            <ChakraColorSwatch title="Card" themeColorKey="card.DEFAULT" displayColorValue="var(--card)" themeTextColorKey="card.foreground" border />
            <ChakraColorSwatch title="Muted" themeColorKey="muted.DEFAULT" displayColorValue="var(--muted)" themeTextColorKey="muted.foreground" border />
            <ChakraColorSwatch title="Border" themeColorKey="border" displayColorValue="var(--border)" themeTextColorKey="foreground" />
            <ChakraColorSwatch title="Input" themeColorKey="input" displayColorValue="var(--input)" themeTextColorKey="foreground" border />
            <ChakraColorSwatch title="Ring" themeColorKey="ring" displayColorValue="var(--ring)" themeTextColorKey="foreground" />
          </SimpleGrid>
        </Box>

        <Box as="section" id="typography" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Typography</CustomHeading>
          <CustomText mb={6}>Base fonts (<Code>Nunito Sans</Code> for body, <Code>Montserrat</Code> for headings) configured in <Code>src/lib/theme.ts</Code>.</CustomText>
          <VStack alignItems="start" spacing={5}>
            <Box><CustomHeading as="h1" size="2xl">Heading 1 (var(--font-montserrat))</CustomHeading></Box>
            <Box><CustomHeading as="h2" size="xl">Heading 2 (var(--font-montserrat))</CustomHeading></Box>
            <Box><CustomHeading as="h3" size="lg">Heading 3 (var(--font-montserrat))</CustomHeading></Box>
            <Box><CustomHeading as="h4" size="md">Heading 4 (var(--font-montserrat))</CustomHeading></Box>
            <CustomText fontSize="lg">This is a lead paragraph style using our <Code>Text</Code> component with <Code>fontSize=&quot;lg&quot;</Code>.</CustomText>
            <CustomText>This is a standard paragraph (var(--font-nunito-sans)), using our custom <Code>Text</Code> component. It provides a baseline for body content.</CustomText>
            <Box as="blockquote" borderLeftWidth="4px" borderColor={blockquoteBorderColor} pl={4} py={2} fontStyle="italic">
              {/* CORRECTED LINE BELOW */}
              <CustomText>&quot;This is a blockquote. It&apos;s useful for highlighting quotes or important snippets of text.&quot;</CustomText>
            </Box>
            <CustomText>Use your custom <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode> component for inline code snippets, or Chakra&apos;s default <Code>Code</Code> component.</CustomText>
            <CustomHeading as="h4" size="sm" mt={4} mb={2}>Unordered List</CustomHeading>
            <UnorderedList pl={5} spacing={1}>
              <ListItem>List item one</ListItem>
              <ListItem>List item two</ListItem>
              <ListItem>Nested list item:
                <UnorderedList pl={5} mt={1} spacing={1}>
                  <ListItem>Sub-item A</ListItem>
                  <ListItem>Sub-item B</ListItem>
                </UnorderedList>
              </ListItem>
            </UnorderedList>
            <CustomHeading as="h4" size="sm" mt={4} mb={2}>Ordered List</CustomHeading>
            <OrderedList pl={5} spacing={1}>
              <ListItem>First item</ListItem>
              <ListItem>Second item</ListItem>
              <ListItem>Third item</ListItem>
            </OrderedList>
            <CustomText>This is an example of a <ChakraLink href="#" color="primary.DEFAULT" isExternal>ChakraLink <Icon as={ExternalLinkIcon} mx="2px" boxSize="0.8em" /></ChakraLink>.</CustomText>
          </VStack>
        </Box>

        <Box as="section" id="spacing" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Spacing & Layout</CustomHeading>
          <CustomText mb={6}>Chakra UI&apos;s spacing scale is themeable. Examples use props like <Code>p</Code>, <Code>m</Code>, <Code>gap</Code>.</CustomText>
           <VStack alignItems="stretch" spacing={8}>
            <Box> {/* This Box contains the "Padding Example" section */}
              <CustomHeading as="h4" size="md" mb={3}>Padding Example</CustomHeading>
              <HStack spacing={4} flexWrap="wrap">
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="1" borderRadius="sm">p=&quot;1&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="2" borderRadius="sm">p=&quot;2&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="4" borderRadius="sm">p=&quot;4&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="6" borderRadius="sm">p=&quot;6&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="8" borderRadius="sm">p=&quot;8&quot;</Box>
              </HStack>
            </Box>
             <Box>
              <CustomHeading as="h4" size="md" mb={3}>Margin Example</CustomHeading>
              <VStack bg="muted.DEFAULT" p="4" borderRadius="md" alignItems="stretch" spacing={4}>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm">No margin</Box>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm" mt="4">mt=&quot;4&quot;</Box>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm" mx="auto" w="fit-content">mx=&quot;auto&quot;</Box>
              </VStack>
            </Box>
            <Box>
              <CustomHeading as="h4" size="md" mb={3}>Gap Example (SimpleGrid)</CustomHeading>
              <SimpleGrid columns={{ base: 1, sm: 3 }} bg="muted.DEFAULT" p="4" borderRadius="md" gap={6}>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item A</Box>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item B</Box>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item C</Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>

        <Box as="section" id="breakpoints" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Breakpoints</CustomHeading>
          <CustomText mb={6}>Chakra UI uses standard responsive breakpoints (sm, md, lg, xl, 2xl). Test by resizing your browser window.</CustomText>
          <VStack spacing={3} borderWidth="1px" borderColor="border" borderRadius="lg" p={4}>
              <CustomText>Background color changes based on breakpoint:</CustomText>
              <Box p={4} borderRadius="md" w="full" textAlign="center"
                bg={{ base: "red.100", sm: "orange.100", md: "yellow.100", lg: "green.100", xl: "blue.100" }}
                color={{ base: "red.700", sm: "orange.700", md: "yellow.700", lg: "green.700", xl: "blue.700" }}
              >
                <CustomText display={{ base: "block", sm: "none" }}>Base (Red)</CustomText>
                <CustomText display={{ base: "none", sm: "block", md: "none" }}>SM (Orange)</CustomText>
                <CustomText display={{ base: "none", md: "block", lg: "none" }}>MD (Yellow)</CustomText>
                <CustomText display={{ base: "none", lg: "block", xl: "none" }}>LG (Green)</CustomText>
                <CustomText display={{ base: "none", xl: "block" }}>XL (Blue)</CustomText>
              </Box>
          </VStack>
        </Box>

         <Box as="section" id="borderradius" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Border Radius</CustomHeading>
          <CustomText mb={6}>Defined in <Code>src/lib/theme.ts</Code> using CSS variable <Code>--radius</Code>.</CustomText>
           <HStack spacing={6} flexWrap="wrap">
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="sm" display="flex" alignItems="center" justifyContent="center"><CustomText>sm</CustomText></Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="md" display="flex" alignItems="center" justifyContent="center"><CustomText>md</CustomText></Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="lg" display="flex" alignItems="center" justifyContent="center"><CustomText>lg</CustomText></Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"><CustomText>full</CustomText></Box>
          </HStack>
        </Box>

        <Box as="section" id="shadows" borderTopWidth="1px" borderColor="border" pt={10}>
           <CustomHeading as="h2" size="xl" mb={6}>Shadows</CustomHeading>
           <CustomText mb={6}>Chakra UI provides a default shadow scale. These can be customized in the theme.</CustomText>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="sm"><CustomText>shadow=&quot;sm&quot;</CustomText></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="md"><CustomText>shadow=&quot;md&quot;</CustomText></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="lg"><CustomText>shadow=&quot;lg&quot;</CustomText></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="xl"><CustomText>shadow=&quot;xl&quot;</CustomText></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="2xl"><CustomText>shadow=&quot;2xl&quot;</CustomText></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="inner"><CustomText>shadow=&quot;inner&quot;</CustomText></Box>
           </SimpleGrid>
        </Box>

         <Box as="section" id="animations" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Animations & Motion</CustomHeading>
          <CustomText mb={6}>Chakra UI supports transitions and can integrate with animation libraries.</CustomText>
            <HStack alignItems="center" spacing={6} >
              <Box w="64px" h="64px" bg="primary.DEFAULT" borderRadius="lg" transition="all 0.3s ease-in-out" _hover={{ transform: 'scale(1.15) rotate(10deg)', bg: "accent.DEFAULT" }} />
              <CustomText>Hover the box for transition.</CustomText>
           </HStack>
           <CustomHeading as="h4" size="md" mt={6} mb={3}>Pulse Example (CSS Keyframe in globals.css)</CustomHeading>
           <CustomText fontSize="sm" mb={3}>Requires <Code>@keyframes pulseAnimation</Code> and <Code>animation: pulseAnimation...</Code> to be defined, typically in <Code>globals.css</Code>.</CustomText>
            <Box
              w="64px" h="64px" bg="destructive.DEFAULT" borderRadius="lg"
              animation="pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            />
            <style jsx global>{`
              @keyframes pulseAnimation {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: .5; transform: scale(1.05); }
              }
            `}</style>
         </Box>

         <Box as="section" id="iconography" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Iconography</CustomHeading>
          <CustomText mb={6}>Using Lucide Icons with Chakra UI&apos;s <Code>Icon</Code> component.</CustomText>
            <HStack alignItems="center" spacing={6} >
               <HStack><Icon as={HomeIconSvg} boxSize={5} color="primary.DEFAULT"/> <CustomText>Home Icon (size 5)</CustomText></HStack>
               <HStack><Icon as={SettingsIconSvg} boxSize={6} color="secondary.foreground"/> <CustomText>Settings Icon (size 6)</CustomText></HStack>
               <HStack><Icon as={ExternalLinkIcon} boxSize={4} /> <CustomText>External Link (default color)</CustomText></HStack>
           </HStack>
         </Box>

        <Box as="section" id="components" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Chakra Components</CustomHeading>
           <VStack alignItems="start" spacing={10} >
            <Box id="chakra-buttons">
              <CustomHeading as="h3" size="lg" mb={4}>Buttons (Chakra)</CustomHeading>
              <HStack flexWrap="wrap" spacing={4} >
                <ChakraButton colorScheme="blue">Default Primary</ChakraButton>
                <ChakraButton variant="themedOutline">Themed Outline</ChakraButton>
                <ChakraButton colorScheme="green" variant="solid">Solid Green</ChakraButton>
                <ChakraButton colorScheme="red" variant="ghost">Ghost Red</ChakraButton>
                <ChakraButton colorScheme="purple" variant="link">Link Purple</ChakraButton>
                <ChakraButton isLoading loadingText="Submitting">Loading</ChakraButton>
                <ChakraButton isDisabled>Disabled</ChakraButton>
              </HStack>
            </Box>
            <Box id="chakra-badges">
              <CustomHeading as="h3" size="lg" mb={4}>Badges</CustomHeading>
              <HStack flexWrap="wrap" spacing={4}>
                  <Badge colorScheme="green">Default</Badge>
                  <Badge colorScheme="yellow" variant="subtle">Subtle Yellow</Badge>
                  <Badge colorScheme="pink" variant="solid">Solid Pink</Badge>
                  <Badge colorScheme="cyan" variant="outline">Outline Cyan</Badge>
              </HStack>
            </Box>
            <Box id="chakra-forms">
               <CustomHeading as="h3" size="lg" mb={4}>Form Elements (Chakra)</CustomHeading>
               <VStack maxW="md" alignItems="stretch" spacing={4}>
                 <FormControl id="ds-email-chakra">
                   <FormLabel>Email Address</FormLabel>
                   <ChakraInput type="email" placeholder="your@email.com" />
                   <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                 </FormControl>
                 <FormControl id="ds-name-chakra" isInvalid>
                   <FormLabel>Name (with error)</FormLabel>
                   <ChakraInput type="text" placeholder="Your Name" />
                   <FormErrorMessage>Name is required.</FormErrorMessage>
                 </FormControl>
                 <ChakraButton colorScheme="blue" type="submit" maxW="fit-content">Submit Example</ChakraButton>
               </VStack>
            </Box>
            <Box id="chakra-loading-states">
              <CustomHeading as="h3" size="lg" mb={4}>Loading States (Skeleton)</CustomHeading>
              <VStack spacing={6} alignItems="stretch">
                <Box>
                  <CustomText mb={2}>Skeleton Text:</CustomText>
                  <SkeletonText noOfLines={4} spacing="4" skeletonHeight="3" />
                </Box>
                <Box>
                  <CustomText mb={2}>Skeleton Shapes:</CustomText>
                  <HStack spacing={4}>
                    <Skeleton boxSize="100px" />
                    <SkeletonCircle size="24" />
                    <Skeleton height="20px" width="200px" />
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* --- Custom Project Components Section --- */}
        <Box as="section" id="custom-components" borderTopWidth="1px" borderColor="border" pt={10}>
          <CustomHeading as="h2" size="xl" mb={6}>Custom Project Components</CustomHeading>
          <VStack alignItems="stretch" spacing={10} divider={<Divider />}>
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Layout</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/layout.tsx</Code></CustomText>
              <Box borderWidth="1px" borderRadius="lg" p={4} borderColor="border">
                <CustomText>The <Code>Layout</Code> component wraps page content with <Code>SiteHeader</Code> and <Code>SiteFooter</Code>. This entire design system page can be considered an example of its use if Layout wraps it at a higher level (e.g. in the root layout).</CustomText>
              </Box>
            </Box>
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>SiteHeader</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/site-header.tsx</Code></CustomText>
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
                <CustomText mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged In - Mocked):</CustomText>
                <SiteHeader user={mockUser} />
                <Divider my={4} />
                <CustomText mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged Out - Mocked):</CustomText>
                <SiteHeader user={noUser} />
              </Box>
            </Box>
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>SiteFooter</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/common/site-footer.tsx</Code></CustomText>
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
                <SiteFooter />
              </Box>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Form (Custom Wrapper)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form.tsx</Code></CustomText>
              <CustomForm p={4} borderWidth="1px" borderRadius="lg" borderColor="border" onSubmit={(e) => { e.preventDefault(); alert('Custom Form Submitted!'); }}>
                <CustomText mb={2}>This content is inside our custom Form wrapper.</CustomText>
                <ChakraButton mt={2} type="submit">Submit via Custom Form</ChakraButton>
              </CustomForm>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>FormField (Custom Wrapper)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form-field.tsx</Code></CustomText>
              <VStack spacing={4} alignItems="stretch" p={4} borderWidth="1px" borderRadius="lg" borderColor="border">
                <CustomFormField label="Email Address (via FormField)" id="ds-ff-email" helperText="Helper text for email.">
                  <ChakraInput type="email" placeholder="your@email.com" id="ds-ff-email"/>
                </CustomFormField>
                <CustomFormField label="Name (with error via FormField)" id="ds-ff-name" error="Name is required." isRequired>
                  <ChakraInput type="text" placeholder="Your Name" id="ds-ff-name" />
                </CustomFormField>
              </VStack>
            </Box>
            
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>FormMessage</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/form-message.tsx</Code></CustomText>
              <VStack spacing={3} alignItems="stretch">
                <FormMessage message={errorFormMessage} />
                <FormMessage message={successFormMessage} mt={2} />
                <FormMessage message={infoFormMessage} mt={2} />
                <FormMessage message={errorWithoutTitle} mt={2}/>
              </VStack>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>SubmitButton</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/forms/submit-button.tsx</Code></CustomText>
              <CustomForm onSubmit={(e) => e.preventDefault()}> {/* Wrap in a form for context */}
                <HStack spacing={4}>
                  <SubmitButton>Default Submit</SubmitButton>
                  <SubmitButton isLoading>Loading Submit</SubmitButton>
                  <SubmitButton isDisabled>Disabled Submit</SubmitButton>
                </HStack>
                <HStack spacing={4} mt={4}>
                  <SubmitButton colorScheme="green">Styled Submit</SubmitButton>
                  <SubmitButton variant="outline">Outline Submit</SubmitButton>
                </HStack>
              </CustomForm>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>HeaderAuth (AuthButton)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/navigation/header-auth.tsx</Code></CustomText>
              <VStack spacing={4} alignItems="flex-start">
                <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
                  <CustomText mb={2} fontWeight="medium">Logged In State (Mocked):</CustomText>
                  <AuthButton user={mockUser} />
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
                  <CustomText mb={2} fontWeight="medium">Logged Out State (Mocked):</CustomText>
                  <AuthButton user={noUser} />
                </Box>
              </VStack>
            </Box>
            
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>ThemeSwitcher</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/navigation/theme-switcher.tsx</Code></CustomText>
              <ThemeSwitcher />
            </Box>

            {/* --- NEWLY ADDED UI PRIMITIVES --- */}
            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Button (Custom UI Primitive)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/button.tsx</Code></CustomText>
              <VStack alignItems="flex-start" spacing={3}>
                <HStack spacing={3} flexWrap="wrap">
                  <Button colorScheme="blue">Primary Action</Button>
                  <Button variant="outline">Secondary Action</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="link">Link Action</Button>
                </HStack>
                <HStack spacing={3} flexWrap="wrap">
                  <Button colorScheme="green" size="sm">Small Green</Button>
                  <Button colorScheme="red" size="md">Medium Red</Button>
                  <Button colorScheme="purple" size="lg">Large Purple</Button>
                </HStack>
                <HStack spacing={3} flexWrap="wrap">
                  <Button isLoading loadingText="Saving...">Saving</Button>
                  <Button isDisabled>Disabled Button</Button>
                </HStack>
              </VStack>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Card (Custom UI Primitive)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/card.tsx</Code></CustomText>
              <HStack spacing={4} alignItems="flex-start" flexWrap="wrap">
                <UICard maxW="sm" variant="outline">
                  <UICardHeader><UICardHeading size="md" as="h4">Card Title (Outline)</UICardHeading></UICardHeader>
                  <UICardBody>
                    <UICardText>This is the body of the card. It can contain various pieces of information or other components.</UICardText>
                  </UICardBody>
                  <UICardFooter>
                    <Button colorScheme="blue">Action Button</Button>
                  </UICardFooter>
                </UICard>
                <UICard maxW="sm" variant="elevated" bg={useColorModeValue("white", "gray.700")}>
                  <UICardHeader><UICardHeading size="md" as="h4">Card Title (Elevated)</UICardHeading></UICardHeader>
                  <UICardBody>
                    <UICardText>Another card example with an elevated style, good for standing out on colored backgrounds.</UICardText>
                  </UICardBody>
                  <UICardFooter>
                    <Button variant="ghost">Learn More</Button>
                  </UICardFooter>
                </UICard>
              </HStack>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Input (Custom UI Primitive)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/input.tsx</Code></CustomText>
              <VStack maxW="md" spacing={4} alignItems="stretch">
                <CustomFormField label="Email (Custom Input)" id="ds-c-email-custom">
                  <Input type="email" placeholder="you@example.com" id="ds-c-email-custom" />
                </CustomFormField>
                <CustomFormField label="Search (Custom Input Filled)" id="ds-c-search-custom">
                  <Input placeholder="Search..." variant="filled" id="ds-c-search-custom" />
                </CustomFormField>
                <CustomFormField label="Disabled Custom Input" id="ds-c-disabled-custom">
                  <Input isDisabled placeholder="Cannot type here" id="ds-c-disabled-custom"/>
                </CustomFormField>
                 <CustomFormField label="Invalid Custom Input" id="ds-c-invalid-custom" error="This custom input is invalid.">
                  <Input isInvalid defaultValue="Wrong value" id="ds-c-invalid-custom"/>
                </CustomFormField>
              </VStack>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Modal (Custom UI Primitive)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/modal.tsx</Code></CustomText>
              <Button onClick={onModalOpen}>Open Custom Modal</Button>
              <UIModal isOpen={isModalOpen} onClose={onModalClose} isCentered>
                <UIModalOverlay />
                <UIModalContent>
                  <UIModalHeader>Custom Modal Title</UIModalHeader>
                  <UIModalCloseButton />
                  <UIModalBody>
                    <CustomText mb={2}>This is the body content of our custom UI Modal component.</CustomText>
                    <CustomText>It&apos;s built using Chakra UI&apos;s modal components as a base.</CustomText>
                  </UIModalBody>
                  <UIModalFooter>
                    <Button variant="ghost" onClick={onModalClose}>Cancel</Button>
                    <Button colorScheme="teal" ml={3} onClick={onModalClose}>
                      Confirm Action
                    </Button>
                  </UIModalFooter>
                </UIModalContent>
              </UIModal>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Spinner (Custom UI Primitive)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/spinner.tsx</Code></CustomText>
              <HStack spacing={6} alignItems="center" flexWrap="wrap">
                <Box textAlign="center">
                  <CustomText mb={1} fontSize="sm">Default:</CustomText>
                  <Spinner />
                </Box>
                <Box textAlign="center">
                  <CustomText mb={1} fontSize="sm">Large Red:</CustomText>
                  <Spinner size="lg" color="red.500" thickness="4px" label="Loading data..." />
                </Box>
                <Box textAlign="center">
                  <CustomText mb={1} fontSize="sm">XL Green (empty label):</CustomText>
                  <Spinner size="xl" color="green.500" speed="0.8s" emptyColor="gray.200" label=""/>
                </Box>
              </HStack>
            </Box>
            {/* --- End of NEWLY ADDED UI PRIMITIVES --- */}

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>ChakraNextThemeSyncer</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/chakra-next-theme-syncer.tsx</Code></CustomText>
              <CustomText>This component synchronizes Chakra UI&apos;s theme with Next.js. No direct visual output expected here. It&apos;s usually placed in a global provider.</CustomText>
              <ChakraNextThemeSyncer />
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>Toaster (Toast Utility)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/toaster.tsx</Code></CustomText>
              <HStack spacing={3} flexWrap="wrap">
                <ChakraButton onClick={() => toaster({ title: 'Info Toast', description: 'This is from the design system page!', status: 'info' })}>
                  Show Info Toast
                </ChakraButton>
                <ChakraButton colorScheme="green" onClick={() => toaster({ title: 'Success!', description: 'Item saved.', status: 'success', duration: 3000 })}>
                  Show Success Toast
                </ChakraButton>
                <ChakraButton colorScheme="red" onClick={() => toaster({ title: 'Error!', description: 'Could not connect.', status: 'error', isClosable: true })}>
                  Show Error Toast
                </ChakraButton>
              </HStack>
            </Box>

            <Box>
              <CustomHeading as="h3" size="lg" mb={4}>ThemeProvider (App Provider)</CustomHeading>
              <CustomText fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/ui/theme-provider.tsx</Code></CustomText>
              <CustomText>This component wraps the application to provide Chakra UI and Next-Themes context. It&apos;s typically used in your main <Code>layout.tsx</Code> or <Code>app.tsx</Code>. No direct visual output here.</CustomText>
            </Box>

          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}