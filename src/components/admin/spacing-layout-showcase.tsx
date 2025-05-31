// src/components/admin/spacing-layout-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Code,
} from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function SpacingLayoutShowcase() {
  return (
    <Box as="section" id="spacing" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}> 
        Spacing & Layout
      </CustomHeading>
      <CustomText mb={6}>
        Chakra UI&apos;s spacing scale is themeable. Examples use props like <Code>p</Code>,{' '}
        <Code>m</Code>, <Code>gap</Code>.
      </CustomText>
      <VStack alignItems="stretch" spacing={8}>
        <Box>
          <CustomHeading as="h3" size="md" mb={3}> 
            Padding Example
          </CustomHeading>
          <HStack spacing={4} flexWrap="wrap">
            <Box bg="secondary.DEFAULT" color="secondary.foreground" p="1" borderRadius="sm">p=&quot;1&quot;</Box>
            <Box bg="secondary.DEFAULT" color="secondary.foreground" p="2" borderRadius="sm">p=&quot;2&quot;</Box>
            <Box bg="secondary.DEFAULT" color="secondary.foreground" p="4" borderRadius="sm">p=&quot;4&quot;</Box>
            <Box bg="secondary.DEFAULT" color="secondary.foreground" p="6" borderRadius="sm">p=&quot;6&quot;</Box>
            <Box bg="secondary.DEFAULT" color="secondary.foreground" p="8" borderRadius="sm">p=&quot;8&quot;</Box>
          </HStack>
        </Box>
        <Box>
          <CustomHeading as="h3" size="md" mb={3}>
            Margin Example
          </CustomHeading>
          <VStack bg="muted.DEFAULT" p="4" borderRadius="md" alignItems="stretch" spacing={4}>
            <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm">No margin</Box>
            <Box bg="card.DEFAULT" color="card.foreground" p="3" borderRadius="sm" shadow="sm" mt="4">mt=&quot;4&quot;</Box>
            <Box
              bg="card.DEFAULT"
              color="card.foreground"
              p="3"
              borderRadius="sm"
              shadow="sm"
              mx="auto"
              w="fit-content"
            >
              mx=&quot;auto&quot;
            </Box>
          </VStack>
        </Box>
        <Box>
          <CustomHeading as="h3" size="md" mb={3}>
            Gap Example (SimpleGrid)
          </CustomHeading>
          <SimpleGrid columns={{ base: 1, sm: 3 }} bg="muted.DEFAULT" p="4" borderRadius="md" gap={6}>
            <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item A</Box>
            <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item B</Box>
            <Box bg="accent.DEFAULT" color="accent.foreground" p="4" borderRadius="sm" textAlign="center">Item C</Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
}