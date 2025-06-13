/*
 FINAL VERSION - Key Changes:
 - Removed incorrect imports from the old typography folder.
 - Updated the file to import 'Heading' and 'Text' directly from '@chakra-ui/react'.
 - Renamed component usage in the JSX from <CustomHeading> and <CustomText> to <Heading> and <Text>.
*/
'use client';

import React from 'react';
import {
  Box,
  VStack,
  UnorderedList,
  OrderedList,
  ListItem,
  Link as ChakraLink,
  Icon,
  Code,
  useColorModeValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { TypographyInlineCode } from '@/src/components/typography/inline-code';

export default function TypographyShowcase() {
  const blockquoteBorderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box as="section" id="typography" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Typography
      </Heading>
      <Text mb={6}>
        Base fonts (<Code>Nunito Sans</Code> for body, <Code>Montserrat</Code> for headings) configured in{' '}
        <Code>src/lib/theme.ts</Code>.
      </Text>
      <VStack alignItems="start" spacing={5}>
        <Box>
          <Heading as="h1" size="2xl">
            Heading 1 (var(--font-montserrat))
          </Heading>
        </Box>
        <Box>
          <Heading as="h2" size="xl">
            Heading 2 (var(--font-montserrat))
          </Heading>
        </Box>
        <Box>
          <Heading as="h3" size="lg">
            Heading 3 (var(--font-montserrat))
          </Heading>
        </Box>
        <Box>
          <Heading as="h4" size="md">
            Heading 4 (var(--font-montserrat))
          </Heading>
        </Box>
        <Text fontSize="lg">
          This is a lead paragraph style using our <Code>Text</Code> component with{' '}
          <Code>fontSize=&quot;lg&quot;</Code>.
        </Text>
        <Text>
          This is a standard paragraph (var(--font-nunito-sans)), using our custom <Code>Text</Code>{' '}
          component. It provides a baseline for body content.
        </Text>
        <Box
          as="blockquote"
          borderLeftWidth="4px"
          borderColor={blockquoteBorderColor}
          pl={4}
          py={2}
          fontStyle="italic"
        >
          <Text>
            &quot;This is a blockquote. It&apos;s useful for highlighting quotes or important snippets of
            text.&quot;
          </Text>
        </Box>
        <Text>
          Use your custom <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode> component for
          inline code snippets, or Chakra&apos;s default <Code>Code</Code> component.
        </Text>
        <Heading as="h4" size="sm" mt={4} mb={2}>
          Unordered List
        </Heading>
        <UnorderedList pl={5} spacing={1}>
          <ListItem>List item one</ListItem>
          <ListItem>List item two</ListItem>
          <ListItem>
            Nested list item:
            <UnorderedList pl={5} mt={1} spacing={1}>
              <ListItem>Sub-item A</ListItem>
              <ListItem>Sub-item B</ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
        <Heading as="h4" size="sm" mt={4} mb={2}>
          Ordered List
        </Heading>
        <OrderedList pl={5} spacing={1}>
          <ListItem>First item</ListItem>
          <ListItem>Second item</ListItem>
          <ListItem>Third item</ListItem>
        </OrderedList>
        <Text>
          This is an example of a{' '}
          <ChakraLink href="#" color="primary.500" isExternal>
            ChakraLink <Icon as={ExternalLinkIcon} mx="2px" boxSize="0.8em" />
          </ChakraLink>
          .
        </Text>
      </VStack>
    </Box>
  );
}