/*
 FINAL VERSION - Key Changes:
 - Updated imports to use `Heading` and `Text` directly from '@chakra-ui/react',
   removing references to the old typography folder.
*/
'use client';

import React from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
} from '@chakra-ui/react';

export default function ShadowsShowcase() {
  return (
    <Box as="section" id="shadows" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Shadows
      </Heading>
      <Text mb={6}>
        Chakra UI provides a default shadow scale. These can be customized in the theme.
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="sm" borderColor="border">
          <Text>shadow=&quot;sm&quot;</Text>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="md" borderColor="border">
          <Text>shadow=&quot;md&quot;</Text>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="lg" borderColor="border">
          <Text>shadow=&quot;lg&quot;</Text>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="xl" borderColor="border">
          <Text>shadow=&quot;xl&quot;</Text>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="2xl" borderColor="border">
          <Text>shadow=&quot;2xl&quot;</Text>
        </Box>
        <Box p={6} borderWidth="1px" borderRadius="md" shadow="inner" borderColor="border">
          <Text>shadow=&quot;inner&quot;</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}