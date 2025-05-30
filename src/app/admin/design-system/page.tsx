// app/admin/design-system/page.tsx
'use client';

import {
  Box, Container, Heading, Text, Link as ChakraLink,
  VStack, HStack, SimpleGrid, Code, Button, Badge, Input,
  Skeleton, SkeletonText, Icon,
  List,
  ListItem,
  Divider,
  UnorderedList, 
  OrderedList,  
  useColorModeValue,
  FormErrorMessage, 
  SkeletonCircle,   
} from "@chakra-ui/react";

import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { Home as HomeIconSvg, Settings as SettingsIconSvg, ExternalLinkIcon } from 'lucide-react';
import type { User } from "@supabase/supabase-js";

// Import your custom components
import { ChakraNextThemeSyncer } from '@/components/chakra-next-theme-syncer'; //
import { FormMessage, type Message as FormMessageType } from '@/components/form-message'; //
import AuthButton from '@/components/header-auth'; //
import SiteFooter from "@/src/components/layout/site-footer"; //
import SiteHeader from "@/src/components/layout/site-header"; //
import { SubmitButton } from '@/components/submit-button'; //
import { ThemeSwitcher } from '@/components/theme-switcher'; //
import { TypographyInlineCode } from '@/components/typography/inline-code'; //


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
        <Text fontSize="xs" fontWeight="medium" color={themeTextColorKey}>Aa</Text>
      </Box>
      <Text fontSize="sm" mt={2} mb={0}>{title}</Text>
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
       { href: "#buttons", text: "Buttons"},
       { href: "#badges", text: "Badges"},
       { href: "#forms", text: "Form Elements"},
       { href: "#loading-states", text: "Loading States"},
    ]
  },
  { id: "custom-components", title: "Custom Project Components" },
];

export default function DesignSystemPage() {
  const mockUser: User = {
    id: 'mock-user-id-123',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Jane Doe' }, //
    aud: 'authenticated', //
    created_at: new Date().toISOString(), //
    email: 'jane@example.com', //
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
  };
  const noUser: User | null = null;

  const errorFormMessage: FormMessageType = { error: "This is a detailed error message.", title: "Validation Error" }; //
  const successFormMessage: FormMessageType = { success: "Your profile has been updated successfully!", title: "Update Complete" }; //
  const infoFormMessage: FormMessageType = { message: "Please note: System maintenance scheduled for midnight.", title: "System Notification" }; //
  const errorWithoutTitle: FormMessageType = { error: "An unexpected error occurred." }; //

  const blockquoteBorderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Container maxW="container.xl" py={10}>
      <Box as="header" mb={12}>
        <Heading as="h1" size="2xl" mb={4}>Design System - Chakra UI</Heading>
        <Text fontSize="xl" color="gray.600">
          Visual guide to project tokens and components using Chakra UI.
        </Text>
      </Box>

      <Box as="nav" mb={16} p={4} borderWidth="1px" borderRadius="lg" borderColor="border">
        <Heading as="h4" size="md" mb={3}>On This Page</Heading>
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
          <Heading as="h2" size="xl" mb={6}>Color System</Heading>
          <Text mb={6}>Defined via CSS variables and mapped to Chakra theme tokens in <Code>src/lib/theme.ts</Code>.</Text> {/* */}
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
          <Heading as="h2" size="xl" mb={6}>Typography</Heading>
          <Text mb={6}>Base fonts (<Code>Nunito Sans</Code> for body, <Code>Montserrat</Code> for headings) configured in <Code>src/lib/theme.ts</Code>.</Text> {/* */}
          <VStack alignItems="start" spacing={5}>
            <Box><Heading as="h1" size="2xl">Heading 1 (var(--font-montserrat))</Heading></Box>
            <Box><Heading as="h2" size="xl">Heading 2 (var(--font-montserrat))</Heading></Box>
            <Box><Heading as="h3" size="lg">Heading 3 (var(--font-montserrat))</Heading></Box>
            <Box><Heading as="h4" size="md">Heading 4 (var(--font-montserrat))</Heading></Box>
            <Text fontSize="lg">This is a lead paragraph style using <Code>Text</Code> component with <Code>fontSize=&quot;lg&quot;</Code>.</Text>
            <Text>This is a standard paragraph (var(--font-nunito-sans)). It provides a baseline for body content across the application, ensuring readability and consistency.</Text>
            <Box as="blockquote" borderLeftWidth="4px" borderColor={blockquoteBorderColor} pl={4} py={2} fontStyle="italic">
              <Text>{'"This is a blockquote. It&apos;s useful for highlighting quotes or important snippets of text."'}</Text>
            </Box>
            <Text>Use your custom <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode> component for inline code snippets, or Chakra&apos;s default <Code>Code</Code> component.</Text> {/* */}
            <Heading as="h4" size="sm" mt={4} mb={2}>Unordered List</Heading>
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
            <Heading as="h4" size="sm" mt={4} mb={2}>Ordered List</Heading>
            <OrderedList pl={5} spacing={1}>
              <ListItem>First item</ListItem>
              <ListItem>Second item</ListItem>
              <ListItem>Third item</ListItem>
            </OrderedList>
            <Text>This is an example of a <ChakraLink href="#" color="primary.DEFAULT" isExternal>ChakraLink <Icon as={ExternalLinkIcon} mx="2px" boxSize="0.8em" /></ChakraLink>.</Text>
          </VStack>
        </Box>

        <Box as="section" id="spacing" borderTopWidth="1px" borderColor="border" pt={10}>
          <Heading as="h2" size="xl" mb={6}>Spacing & Layout</Heading>
          <Text mb={6}>Chakra UI&apos;s spacing scale is themeable. Examples use props like <Code>p</Code>, <Code>m</Code>, <Code>gap</Code>.</Text>
          <VStack alignItems="stretch" spacing={8}>
            <Box>
              <Heading as="h4" size="md" mb={3}>Padding Example</Heading>
              <HStack spacing={4} flexWrap="wrap">
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="1" borderRadius="sm">p=&quot;1&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="2" borderRadius="sm">p=&quot;2&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="4" borderRadius="sm">p=&quot;4&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="6" borderRadius="sm">p=&quot;6&quot;</Box>
                <Box bg="secondary.DEFAULT" color="secondary.foreground" p="8" borderRadius="sm">p=&quot;8&quot;</Box>
              </HStack>
            </Box>
             <Box>
              <Heading as="h4" size="md" mb={3}>Margin Example</Heading>
              <VStack bg="muted.DEFAULT" p="4" borderRadius="md" alignItems="stretch" spacing={4}>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm">No margin</Box>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm" mt="4">mt=&quot;4&quot;</Box>
                <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm" mx="auto" w="fit-content">mx=&quot;auto&quot;</Box>
              </VStack>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={3}>Gap Example (SimpleGrid)</Heading>
              <SimpleGrid columns={{ base: 1, sm: 3 }} bg="muted.DEFAULT" p="4" borderRadius="md" gap={6}>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item A</Box>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item B</Box>
                 <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item C</Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>

        <Box as="section" id="breakpoints" borderTopWidth="1px" borderColor="border" pt={10}>
          <Heading as="h2" size="xl" mb={6}>Breakpoints</Heading>
          <Text mb={6}>Chakra UI uses standard responsive breakpoints (sm, md, lg, xl, 2xl). Test by resizing your browser window.</Text>
          <VStack spacing={3} borderWidth="1px" borderColor="border" borderRadius="lg" p={4}>
              <Text>Background color changes based on breakpoint:</Text>
              <Box p={4} borderRadius="md" w="full" textAlign="center"
                bg={{ base: "red.100", sm: "orange.100", md: "yellow.100", lg: "green.100", xl: "blue.100" }}
                color={{ base: "red.700", sm: "orange.700", md: "yellow.700", lg: "green.700", xl: "blue.700" }}
              >
                <Text display={{ base: "block", sm: "none" }}>Base (Red)</Text>
                <Text display={{ base: "none", sm: "block", md: "none" }}>SM (Orange)</Text>
                <Text display={{ base: "none", md: "block", lg: "none" }}>MD (Yellow)</Text>
                <Text display={{ base: "none", lg: "block", xl: "none" }}>LG (Green)</Text>
                <Text display={{ base: "none", xl: "block" }}>XL (Blue)</Text>
              </Box>
          </VStack>
        </Box>

         <Box as="section" id="borderradius" borderTopWidth="1px" borderColor="border" pt={10}>
          <Heading as="h2" size="xl" mb={6}>Border Radius</Heading>
          <Text mb={6}>Defined in <Code>src/lib/theme.ts</Code> using CSS variable <Code>--radius</Code>.</Text> {/* */}
          <HStack spacing={6} flexWrap="wrap">
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="sm" display="flex" alignItems="center" justifyContent="center">sm</Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="md" display="flex" alignItems="center" justifyContent="center">md</Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">lg</Box>
             <Box w="100px" h="100px" bg="secondary.DEFAULT" borderWidth="1px" borderRadius="full" display="flex" alignItems="center" justifyContent="center">full</Box>
          </HStack>
        </Box>

        <Box as="section" id="shadows" borderTopWidth="1px" borderColor="border" pt={10}>
           <Heading as="h2" size="xl" mb={6}>Shadows</Heading>
           <Text mb={6}>Chakra UI provides a default shadow scale. These can be customized in the theme.</Text>
           <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="sm"><Text>shadow=&quot;sm&quot;</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="md"><Text>shadow=&quot;md&quot;</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="lg"><Text>shadow=&quot;lg&quot;</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="xl"><Text>shadow=&quot;xl&quot;</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="2xl"><Text>shadow=&quot;2xl&quot;</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="inner"><Text>shadow=&quot;inner&quot;</Text></Box>
           </SimpleGrid>
        </Box>

         <Box as="section" id="animations" borderTopWidth="1px" borderColor="border" pt={10}>
          <Heading as="h2" size="xl" mb={6}>Animations & Motion</Heading>
          <Text mb={6}>Chakra UI supports transitions and can integrate with animation libraries.</Text>
           <HStack alignItems="center" spacing={6} >
              <Box w="64px" h="64px" bg="primary.DEFAULT" borderRadius="lg" transition="all 0.3s ease-in-out" _hover={{ transform: 'scale(1.15) rotate(10deg)', bg: "accent.DEFAULT" }} />
              <Text>Hover the box for transition.</Text>
           </HStack>
           <Heading as="h4" size="md" mt={6} mb={3}>Pulse Example (CSS Keyframe in globals.css)</Heading>
           <Text fontSize="sm" mb={3}>Requires <Code>@keyframes pulseAnimation</Code> and <Code>animation: pulseAnimation...</Code> to be defined, typically in <Code>globals.css</Code>.</Text>
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
          <Heading as="h2" size="xl" mb={6}>Iconography</Heading>
          <Text mb={6}>Using Lucide Icons with Chakra UI&apos;s <Code>Icon</Code> component.</Text>
           <HStack alignItems="center" spacing={6} >
               <HStack><Icon as={HomeIconSvg} boxSize={5} color="primary.DEFAULT"/> <Text>Home Icon (size 5)</Text></HStack>
               <HStack><Icon as={SettingsIconSvg} boxSize={6} color="secondary.foreground"/> <Text>Settings Icon (size 6)</Text></HStack>
               <HStack><Icon as={ExternalLinkIcon} boxSize={4} /> <Text>External Link (default color)</Text></HStack>
           </HStack>
         </Box>

        <Box as="section" id="components" borderTopWidth="1px" borderColor="border" pt={10}>
          <Heading as="h2" size="xl" mb={6}>Chakra Components</Heading>
           <VStack alignItems="start" spacing={10} >
            <Box id="buttons">
              <Heading as="h3" size="lg" mb={4}>Buttons</Heading>
              <HStack flexWrap="wrap" spacing={4} >
                <Button colorScheme="blue">Default Primary</Button>
                <Button variant="themedOutline">Themed Outline</Button> {/* */}
                <Button colorScheme="green" variant="solid">Solid Green</Button>
                <Button colorScheme="red" variant="ghost">Ghost Red</Button>
                <Button colorScheme="purple" variant="link">Link Purple</Button>
                <Button isLoading loadingText="Submitting">Loading</Button>
                <Button isDisabled>Disabled</Button>
              </HStack>
            </Box>
            <Box id="badges">
              <Heading as="h3" size="lg" mb={4}>Badges</Heading>
              <HStack flexWrap="wrap" spacing={4}>
                  <Badge colorScheme="green">Default</Badge>
                  <Badge colorScheme="yellow" variant="subtle">Subtle Yellow</Badge>
                  <Badge colorScheme="pink" variant="solid">Solid Pink</Badge>
                  <Badge colorScheme="cyan" variant="outline">Outline Cyan</Badge>
              </HStack>
            </Box>
            <Box id="forms">
               <Heading as="h3" size="lg" mb={4}>Form Elements</Heading>
               <VStack maxW="md" alignItems="stretch" spacing={4}>
                 <FormControl id="ds-email-chakra">
                   <FormLabel>Email Address</FormLabel>
                   <Input type="email" placeholder="your@email.com" />
                   <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                 </FormControl>
                 <FormControl id="ds-name-chakra" isInvalid>
                   <FormLabel>Name (with error)</FormLabel>
                   <Input type="text" placeholder="Your Name" />
                   <FormErrorMessage>Name is required.</FormErrorMessage>
                 </FormControl>
                 <Button colorScheme="blue" type="submit" maxW="fit-content">Submit Example</Button>
               </VStack>
            </Box>
            <Box id="loading-states">
              <Heading as="h3" size="lg" mb={4}>Loading States (Skeleton)</Heading>
              <VStack spacing={6} alignItems="stretch">
                <Box>
                  <Text mb={2}>Skeleton Text:</Text>
                  <SkeletonText noOfLines={4} spacing="4" skeletonHeight="3" />
                </Box>
                <Box>
                  <Text mb={2}>Skeleton Shapes:</Text>
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
          <Heading as="h2" size="xl" mb={6}>Custom Project Components</Heading>
          <VStack alignItems="stretch" spacing={10} divider={<Divider />}>

            <Box>
              <Heading as="h3" size="lg" mb={4}>ThemeSwitcher</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/components/theme-switcher.tsx</Code></Text> {/* */}
              <ThemeSwitcher />
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>FormMessage</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/components/form-message.tsx</Code></Text> {/* */}
              <VStack spacing={3} alignItems="stretch">
                <FormMessage message={errorFormMessage} />
                <FormMessage message={successFormMessage} mt={2} />
                <FormMessage message={infoFormMessage} mt={2} />
                <FormMessage message={errorWithoutTitle} mt={2}/>
              </VStack>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>SubmitButton</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/components/submit-button.tsx</Code></Text> {/* */}
              <HStack spacing={4}>
                <SubmitButton>Default Submit</SubmitButton>
                <SubmitButton isLoading>Loading Submit</SubmitButton>
                <SubmitButton isDisabled>Disabled Submit</SubmitButton>
              </HStack>
              <HStack spacing={4} mt={4}>
                <SubmitButton colorScheme="green">Styled Submit</SubmitButton>
                <SubmitButton variant="outline">Outline Submit</SubmitButton>
              </HStack>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>HeaderAuth (using AuthButton component)</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/components/header-auth.tsx</Code></Text> {/* */}
              <VStack spacing={4} alignItems="flex-start">
                <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
                  <Text mb={2} fontWeight="medium">Logged In State (Mocked):</Text>
                  <AuthButton user={mockUser} />
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="md" w="full" borderColor="border">
                  <Text mb={2} fontWeight="medium">Logged Out State (Mocked):</Text>
                  <AuthButton user={noUser} />
                </Box>
              </VStack>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>SiteHeader</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/layout/site-header.tsx</Code></Text> {/* */}
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
                <Text mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged In - Mocked):</Text>
                <SiteHeader user={mockUser} />
                <Divider my={4} />
                <Text mb={2} fontWeight="medium" pl={2} pt={2}>SiteHeader (Logged Out - Mocked):</Text>
                <SiteHeader user={noUser} />
              </Box>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>SiteFooter</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/src/components/layout/site-footer.tsx</Code></Text> {/* */}
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="border">
                <SiteFooter />
              </Box>
            </Box>

            <Box>
              <Heading as="h3" size="lg" mb={4}>ChakraNextThemeSyncer</Heading>
              <Text fontSize="sm" color="gray.600" mb={2}>Location: <Code>@/components/chakra-next-theme-syncer.tsx</Code></Text> {/* */}
              <Text>This component synchronizes Chakra UI&apos;s theme with Next.js. No direct visual output expected here. It&apos;s usually placed in a global provider.</Text>
              <ChakraNextThemeSyncer /> {/* Rendered to satisfy linter as it returns null */}
            </Box>

          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}