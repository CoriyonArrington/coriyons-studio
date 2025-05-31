// src/components/admin/border-radius-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  HStack,
  Code,
} from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function BorderRadiusShowcase() {
  return (
    <Box as="section" id="borderradius" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Border Radius
      </CustomHeading>
      <CustomText mb={6}>
        Defined in <Code>src/lib/theme.ts</Code> using CSS variable <Code>--radius</Code>.
      </CustomText>
      <HStack spacing={6} flexWrap="wrap">
        <Box
          w="100px"
          h="100px"
          bg="secondary.DEFAULT"
          borderWidth="1px"
          borderColor="border"
          borderRadius="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomText color="secondary.foreground">sm</CustomText>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.DEFAULT"
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomText color="secondary.foreground">md</CustomText>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.DEFAULT"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomText color="secondary.foreground">lg</CustomText>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.DEFAULT"
          borderWidth="1px"
          borderColor="border"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CustomText color="secondary.foreground">full</CustomText>
        </Box>
      </HStack>
    </Box>
  );
}