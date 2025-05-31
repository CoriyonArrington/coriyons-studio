// src/components/admin/typography-showcase.tsx
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
} from '@chakra-ui/react';
import { ExternalLinkIcon } from 'lucide-react'; // Ensure this is the correct icon you want to use
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';
import { TypographyInlineCode } from '@/src/components/typography/inline-code';

export default function TypographyShowcase() {
  const blockquoteBorderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box as="section" id="typography" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Typography
      </CustomHeading>
      <CustomText mb={6}>
        Base fonts (<Code>Nunito Sans</Code> for body, <Code>Montserrat</Code> for headings) configured in{' '}
        <Code>src/lib/theme.ts</Code>.
      </CustomText>
      <VStack alignItems="start" spacing={5}>
        <Box>
          <CustomHeading as="h1" size="2xl">
            Heading 1 (var(--font-montserrat))
          </CustomHeading>
        </Box>
        <Box>
          <CustomHeading as="h2" size="xl">
            Heading 2 (var(--font-montserrat))
          </CustomHeading>
        </Box>
        <Box>
          <CustomHeading as="h3" size="lg">
            Heading 3 (var(--font-montserrat))
          </CustomHeading>
        </Box>
        <Box>
          <CustomHeading as="h4" size="md">
            Heading 4 (var(--font-montserrat))
          </CustomHeading>
        </Box>
        <CustomText fontSize="lg">
          This is a lead paragraph style using our <Code>Text</Code> component with{' '}
          <Code>fontSize=&quot;lg&quot;</Code>.
        </CustomText>
        <CustomText>
          This is a standard paragraph (var(--font-nunito-sans)), using our custom <Code>Text</Code>{' '}
          component. It provides a baseline for body content.
        </CustomText>
        <Box
          as="blockquote"
          borderLeftWidth="4px"
          borderColor={blockquoteBorderColor}
          pl={4}
          py={2}
          fontStyle="italic"
        >
          <CustomText>
            &quot;This is a blockquote. It&apos;s useful for highlighting quotes or important snippets of
            text.&quot;
          </CustomText>
        </Box>
        <CustomText>
          Use your custom <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode> component for
          inline code snippets, or Chakra&apos;s default <Code>Code</Code> component.
        </CustomText>
        <CustomHeading as="h4" size="sm" mt={4} mb={2}>
          Unordered List
        </CustomHeading>
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
        <CustomHeading as="h4" size="sm" mt={4} mb={2}>
          Ordered List
        </CustomHeading>
        <OrderedList pl={5} spacing={1}>
          <ListItem>First item</ListItem>
          <ListItem>Second item</ListItem>
          <ListItem>Third item</ListItem>
        </OrderedList>
        <CustomText>
          This is an example of a{' '}
          <ChakraLink href="#" color="primary.DEFAULT" isExternal>
            ChakraLink <Icon as={ExternalLinkIcon} mx="2px" boxSize="0.8em" />
          </ChakraLink>
          .
        </CustomText>
      </VStack>
    </Box>
  );
}