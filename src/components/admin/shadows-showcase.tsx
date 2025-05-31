// src/components/admin/shadows-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  SimpleGrid,
  // Code, // Removed
} from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function ShadowsShowcase() {
  return (
    <Box as="section" id="shadows" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Shadows
      </CustomHeading>
      <CustomText mb={6}>
        Chakra UI provides a default shadow scale. These can be customized in the theme.
      </CustomText>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="sm" borderColor="border">
          <CustomText>shadow=&quot;sm&quot;</CustomText>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="md" borderColor="border">
          <CustomText>shadow=&quot;md&quot;</CustomText>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="lg" borderColor="border">
          <CustomText>shadow=&quot;lg&quot;</CustomText>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="xl" borderColor="border">
          <CustomText>shadow=&quot;xl&quot;</CustomText>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="2xl" borderColor="border">
          <CustomText>shadow=&quot;2xl&quot;</CustomText>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="inner" borderColor="border">
          <CustomText>shadow=&quot;inner&quot;</CustomText>
        </Box>
      </SimpleGrid>
    </Box>
  );
}