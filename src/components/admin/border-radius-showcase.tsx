/*
 FINAL VERSION - Key Changes:
 - Updated imports to use `Heading` and `Text` directly from '@chakra-ui/react',
   removing references to the old typography folder.
*/
'use client';

import React from 'react';
import {
  Box,
  HStack,
  Code,
  Heading,
  Text,
} from '@chakra-ui/react';

export default function BorderRadiusShowcase() {
  return (
    <Box as="section" id="borderradius" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Border Radius
      </Heading>
      <Text mb={6}>
        Defined in <Code>src/lib/theme.ts</Code> using CSS variable <Code>--radius</Code>.
      </Text>
      <HStack spacing={6} flexWrap="wrap">
        <Box
          w="100px"
          h="100px"
          bg="secondary.500"
          borderWidth="1px"
          borderColor="border"
          borderRadius="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="secondary.foreground">sm</Text>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.500"
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="secondary.foreground">md</Text>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.500"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="secondary.foreground">lg</Text>
        </Box>
        <Box
          w="100px"
          h="100px"
          bg="secondary.500"
          borderWidth="1px"
          borderColor="border"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="secondary.foreground">full</Text>
        </Box>
      </HStack>
    </Box>
  );
}