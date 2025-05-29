// app/admin/design-system/page.tsx
'use client';

import {
  Box, Container, Heading, Text, Link as ChakraLink,
  VStack, HStack, SimpleGrid, Code, Button, Badge, Input,
  Skeleton, SkeletonText, Icon,
  List,
  ListItem,
} from "@chakra-ui/react";

import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { Home as HomeIconSvg, Settings as SettingsIconSvg } from 'lucide-react';

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
    id: "components", title: "Components",
    componentLinks: [
       { href: "#buttons", text: "Buttons"},
       { href: "#badges", text: "Badges"},
       { href: "#forms", text: "Form Elements"},
       { href: "#loading-states", text: "Loading States"},
    ]
  },
];

export default function DesignSystemPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <Box as="header" mb={12}>
        <Heading as="h1" size="2xl" mb={4}>Design System - Chakra UI</Heading>
        <Text fontSize="xl" color="gray.600">
          Visual guide to project tokens and components using Chakra UI.
        </Text>
      </Box>

      <Box as="nav" mb={16} p={4} borderWidth="1px" borderRadius="lg">
        <Heading as="h4" size="md" mb={3}>On This Page</Heading>
        <List>
          {sections.map((section) => (
            <ListItem key={section.id} _hover={{ bg: "gray.50" }} py={1}>
              <ChakraLink href={`#${section.id}`} _hover={{ textDecoration: 'none', color: 'blue.600' }} fontWeight="medium">
                {section.title}
              </ChakraLink>
              {section.id === 'components' && section.componentLinks && (
                <List pl={4} mt={1.5} >
                   {section.componentLinks.map(link => (
                     <ListItem key={link.href} py={0.5}>
                       <ChakraLink href={link.href} fontSize="sm" _hover={{ textDecoration: 'underline', color: 'blue.500' }}>
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

      <VStack alignItems="stretch">

        <Box as="section" id="colors" mb="16">
          <Heading as="h2" size="xl" mb={4}>Color System</Heading>
          <Text mb={6}>Defined via CSS variables and mapped to Chakra theme tokens.</Text>
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={4}>
            <ChakraColorSwatch title="Primary" colorValue="var(--primary)" textColor="var(--primary-foreground)" />
            <ChakraColorSwatch title="Secondary" colorValue="var(--secondary)" textColor="var(--secondary-foreground)" />
            <ChakraColorSwatch title="Destructive" colorValue="var(--destructive)" textColor="var(--destructive-foreground)" />
            <ChakraColorSwatch title="Accent" colorValue="var(--accent)" textColor="var(--accent-foreground)" />
            <ChakraColorSwatch title="Background" colorValue="var(--background)" textColor="var(--foreground)" border />
            <ChakraColorSwatch title="Foreground" colorValue="var(--foreground)" textColor="var(--background)" border />
            <ChakraColorSwatch title="Card" colorValue="var(--card)" textColor="var(--card-foreground)" border />
            <ChakraColorSwatch title="Muted" colorValue="var(--muted)" textColor="var(--muted-foreground)" border />
            <ChakraColorSwatch title="Border" colorValue="var(--border)" textColor="var(--foreground)" />
            <ChakraColorSwatch title="Input" colorValue="var(--input)" textColor="var(--foreground)" border />
            <ChakraColorSwatch title="Ring" colorValue="var(--ring)" textColor="var(--foreground)" />
          </SimpleGrid>
        </Box>

        <Box as="section" id="typography" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Typography</Heading>
          <Text mb={6}>Fonts: Nunito Sans (Body), Montserrat (Headings) - configured in theme.</Text>
          <VStack alignItems="start">
            <Box mb={4}><Heading as="h1" size="2xl">Heading 1</Heading><Text>Font: {`"var(--font-montserrat)"`}</Text></Box>
            <Box mb={4}><Heading as="h2" size="xl">Heading 2</Heading><Text>Font: {`"var(--font-montserrat)"`}</Text></Box>
            <Box mb={4}><Heading as="h3" size="lg">Heading 3</Heading><Text>Font: {`"var(--font-montserrat)"`}</Text></Box>
            <Box mb={4}><Heading as="h4" size="md">Heading 4</Heading><Text>Font: {`"var(--font-montserrat)"`}</Text></Box>
            <Text mb={4}>Paragraph text. Font: {`"var(--font-nunito-sans)"`}</Text>
            <Text fontSize="lg" color="gray.700" mb={4}>Lead text.</Text>
            <Box as="blockquote" borderLeft="4px" borderColor="gray.300" pl={4} py={2} fontStyle="italic" mb={4}>
              <Text>Blockquote.</Text>
            </Box>
            <Text mb={4}>Use <Code>inline code</Code>.</Text>
            <List listStyleType="disc" pl={5} mb={4}>
              <ListItem>List item one</ListItem>
              <ListItem>List item two</ListItem>
            </List>
            <Text>Use <ChakraLink href="#" color="blue.500">inline links</ChakraLink>.</Text>
          </VStack>
        </Box>

        <Box as="section" id="spacing" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Spacing & Layout</Heading>
          <Text mb={6}>Using the &quot;Inside-Out Spacing&quot; method with a 4px base scale (4px-120px).</Text>
          <VStack alignItems="start">
            <Box mb={6}>
              <Heading as="h4" size="md" mb={2}>Margin Example</Heading>
              <VStack bg="gray.100" p="4" borderRadius="md" alignItems="stretch" >
                <Box bg="blue.100" p="2" borderRadius="sm" mb="4">Item 1 (mb=&quot;4&quot;)</Box>
                <Box bg="blue.100" p="2" borderRadius="sm" mb="8">Item 2 (mb=&quot;8&quot;)</Box>
                <Box bg="green.100" p="2" borderRadius="sm" >Item 3</Box>
              </VStack>
            </Box>
             <Box mb={6}>
              <Heading as="h4" size="md" mb={2}>Padding Example</Heading>
              <HStack >
                <Box bg="var(--primary)" color="var(--primary-foreground)" p="1" borderRadius="sm">p=&quot;1&quot;</Box>
                <Box bg="var(--primary)" color="var(--primary-foreground)" p="2" borderRadius="sm" ml="4">p=&quot;2&quot;</Box>
                <Box bg="var(--primary)" color="var(--primary-foreground)" p="4" borderRadius="sm" ml="4">p=&quot;4&quot;</Box>
                <Box bg="var(--primary)" color="var(--primary-foreground)" p="6" borderRadius="sm" ml="4">p=&quot;6&quot;</Box>
              </HStack>
            </Box>
             <Box>
              <Heading as="h4" size="md" mb={2}>Gap Example (SimpleGrid)</Heading>
              <SimpleGrid columns={3} bg="gray.100" p="4" borderRadius="md" gap={4}>
                 <Box bg="orange.100" p="4" borderRadius="sm">Item A</Box>
                 <Box bg="orange.100" p="4" borderRadius="sm">Item B</Box>
                 <Box bg="orange.100" p="4" borderRadius="sm">Item C</Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>

        <Box as="section" id="breakpoints" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Breakpoints</Heading>
          <Text mb={6}>Standard responsive breakpoints (sm, md, lg, xl, 2xl). Applied mobile-first.</Text>
          <Box mt={6} p={4} borderWidth="1px" borderRadius="lg" >
              <Text mb={2}>Resize browser:</Text>
              <Box p={2} bg="red.100" borderRadius="md" display={{ base: "block", sm: "none" }}>Visible base to sm</Box>
              <Box p={2} bg="orange.100" borderRadius="md" display={{ base: "none", sm: "block", md: "none" }}>Visible sm to md</Box>
          </Box>
        </Box>

         <Box as="section" id="borderradius" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Border Radius</Heading>
          <Text mb={6}>Uses CSS variable `--radius`.</Text>
          <HStack mt={6} >
             <Box w="100px" h="100px" bg="gray.200" borderWidth="1px" borderRadius="sm" display="flex" alignItems="center" justifyContent="center">sm</Box>
             <Box w="100px" h="100px" bg="gray.200" borderWidth="1px" borderRadius="md" display="flex" alignItems="center" justifyContent="center" ml="4">md</Box>
          </HStack>
        </Box>

        <Box as="section" id="shadows" borderTopWidth="1px" pt={12} mb="16">
           <Heading as="h2" size="xl" mb={4}>Shadows</Heading>
           <Text mb={6}>Consistent shadow scale for elevation.</Text>
           <SimpleGrid columns={{ base: 2, md: 3 }} mt={6} gap={6}>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="sm"><Text>sm</Text></Box>
              <Box p={6} borderWidth="1px" borderRadius="md" shadow="md"><Text>md</Text></Box>
           </SimpleGrid>
        </Box>

         <Box as="section" id="animations" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Animations & Motion</Heading>
          <Text mb={6}>Basic transition test.</Text>
           <HStack alignItems="center" mt={6} >
              <Box w="64px" h="64px" bg="var(--primary)" borderRadius="lg" transition="all 0.2s ease-in-out" _hover={{ transform: 'scale(1.1)' }} />
              <Text ml="4">Hover for transition</Text>
           </HStack>
           <Heading as="h4" size="md" mt={6} mb={2}>Pulse Example (CSS Keyframe)</Heading>
            <Box
              w="64px" h="64px" bg="var(--secondary)" borderRadius="lg"
              animation="pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            />
         </Box>

         <Box as="section" id="iconography" borderTopWidth="1px" pt={12} mb="16">
          <Heading as="h2" size="xl" mb={4}>Iconography</Heading>
          <Text mb={6}>Using Lucide Icons.</Text>
           <HStack alignItems="center" mt={6} >
               <HStack><Icon as={HomeIconSvg} boxSize={4} /> <Text>Default</Text></HStack>
               <HStack ml="4"><Icon as={SettingsIconSvg} boxSize={5} /> <Text>Size 5</Text></HStack>
           </HStack>
         </Box>

        <Box as="section" id="components" borderTopWidth="1px" pt={12}>
          <Heading as="h2" size="xl" mb={6}>Components</Heading>
          <VStack alignItems="start" >
            <Box id="buttons" mb={12}>
              <Heading as="h3" size="lg" mb={6}>Buttons</Heading>
              <HStack flexWrap="wrap" >
                <Button colorScheme="blue">Default Primary</Button>
                {/* Updated to use themedOutline */}
                <Button variant="themedOutline" ml="4">Themed Outline</Button>
              </HStack>
            </Box>
            <Box id="badges" mb={12}>
              <Heading as="h3" size="lg" mb={6}>Badges</Heading>
              <HStack flexWrap="wrap">
                  <Badge colorScheme="green">Default</Badge>
                  <Badge colorScheme="yellow" variant="subtle" ml="2">Subtle</Badge>
              </HStack>
            </Box>
            <Box id="forms" mb={12}>
               <Heading as="h3" size="lg" mb={6}>Form Elements</Heading>
               <VStack maxW="md" alignItems="stretch" >
                 <FormControl id="ds-email-chakra" mb="4">
                   <FormLabel>Email (Chakra)</FormLabel>
                   <Input type="email" placeholder="your@email.com" />
                   <FormHelperText>Helper text example.</FormHelperText>
                 </FormControl>
                 <FormControl id="ds-name-chakra" mb="4">
                   <FormLabel>Name (Chakra)</FormLabel>
                   <Input type="text" placeholder="Your Name" />
                 </FormControl>
                 <Button colorScheme="blue" type="submit">Submit Example</Button>
               </VStack>
            </Box>
            <Box id="loading-states">
              <Heading as="h3" size="lg" mb={6}>Loading States (Skeleton)</Heading>
              <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
                <Box borderWidth="1px" borderRadius="md" p={4}>
                    <SkeletonText noOfLines={1} width="60%" mb={2} />
                    <SkeletonText noOfLines={1} width="80%" mb={4}/>
                    <SkeletonText noOfLines={3} />
                </Box>
                <VStack >
                  <Skeleton height="32px" borderRadius="md" w="full" />
                  <SkeletonText noOfLines={3} mt="2" />
                </VStack>
              </SimpleGrid>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

function ChakraColorSwatch({ title, colorValue, textColor, border = false }: { title: string, colorValue: string, textColor: string, border?: boolean }) {
  return (
    <Box textAlign="center">
      <Box h="80px" w="full" borderRadius="md" bg={colorValue} borderWidth={border ? "1px" : "0"} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xs" fontWeight="medium" color={textColor}>Aa</Text>
      </Box>
      <Text fontSize="sm" mt={2} mb={0}>{title}</Text>
      <Code fontSize="xs" display="block">{colorValue.startsWith('var(') ? colorValue : `Theme: ${colorValue}`}</Code>
    </Box>
  );
}