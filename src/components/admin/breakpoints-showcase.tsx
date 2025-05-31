// src/components/admin/breakpoints-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  VStack,
  // Code, // Removed
} from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function BreakpointsShowcase() {
  return (
    <Box as="section" id="breakpoints" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Breakpoints
      </CustomHeading>
      <CustomText mb={6}>
        Chakra UI uses standard responsive breakpoints (sm, md, lg, xl, 2xl). Test by resizing
        your browser window.
      </CustomText>
      <VStack spacing={3} borderWidth="1px" borderColor="border" borderRadius="lg" p={4}>
        <CustomText>Background color changes based on breakpoint:</CustomText>
        <Box
          p={4}
          borderRadius="md"
          w="full"
          textAlign="center"
          bg={{ base: 'red.100', sm: 'orange.100', md: 'yellow.100', lg: 'green.100', xl: 'blue.100' }}
          color={{ base: 'red.700', sm: 'orange.700', md: 'yellow.700', lg: 'green.700', xl: 'blue.700' }}
        >
          <CustomText display={{ base: 'block', sm: 'none' }}>Base (Red)</CustomText>
          <CustomText display={{ base: 'none', sm: 'block', md: 'none' }}>SM (Orange)</CustomText>
          <CustomText display={{ base: 'none', md: 'block', lg: 'none' }}>MD (Yellow)</CustomText>
          <CustomText display={{ base: 'none', lg: 'block', xl: 'none' }}>LG (Green)</CustomText>
          <CustomText display={{ base: 'none', xl: 'block' }}>XL (Blue)</CustomText>
        </Box>
      </VStack>
    </Box>
  );
}