/*
 FINAL VERSION - Key Changes:
 - Re-introduced responsive logic using Chakra's `display` prop on each showcase block.
 - Each breakpoint example (sm, md, lg, xl, 2xl) will now only appear when the viewport
   is at or above that breakpoint's width.
 - This creates a showcase that is both a static reference on large screens and a
   live demonstration of responsive behavior when the window is resized.
*/
'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Code,
  Heading,
  Text,
  useTheme,
  SimpleGrid,
} from '@chakra-ui/react';

export default function BreakpointsShowcase() {
  const theme = useTheme();

  // Data for the breakpoint key, converting em to px for display
  const breakpointData = [
    { name: 'sm', value: theme.breakpoints.sm, px: parseFloat(theme.breakpoints.sm) * 16, color: 'orange' },
    { name: 'md', value: theme.breakpoints.md, px: parseFloat(theme.breakpoints.md) * 16, color: 'yellow' },
    { name: 'lg', value: theme.breakpoints.lg, px: parseFloat(theme.breakpoints.lg) * 16, color: 'green' },
    { name: 'xl', value: theme.breakpoints.xl, px: parseFloat(theme.breakpoints.xl) * 16, color: 'blue' },
    { name: '2xl', value: theme.breakpoints['2xl'], px: parseFloat(theme.breakpoints['2xl']) * 16, color: 'purple' },
  ];

  return (
    <Box as="section" id="breakpoints" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Breakpoints
      </Heading>
      <Text mb={6}>
        Chakra UI uses standard responsive breakpoints. Test by resizing your browser window.
      </Text>
      
      <Box mb={8} p={4} borderWidth="1px" borderRadius="lg" bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
        <Heading as="h4" size="md" mb={3}>Breakpoint Key</Heading>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} spacing={2}>
            <Text fontSize="sm"><Code>base</Code>: 0px+</Text>
            {breakpointData.map(bp => (
                <Text key={bp.name} fontSize="sm"><Code>{bp.name}</Code>: {bp.value} ({bp.px}px)</Text>
            ))}
        </SimpleGrid>
      </Box>

      <VStack spacing={8} alignItems="stretch" mt={8}>
        
        {/* Mobile Example (Always shows) */}
        <Box>
          <Heading size="md" mb={2}>Mobile View (`base`)</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={4} maxW="full">
            <Box bg="red.100" color="red.800" p={4} borderRadius="md" textAlign="center">
              <Text fontWeight="bold">Base (0px+)</Text>
            </Box>
          </Box>
        </Box>
        
        {/* All other breakpoints render conditionally */}
        {breakpointData.map(bp => (
            <Box key={bp.name} display={{ base: 'none', [bp.name]: 'block' }}>
                <Heading size="md" mb={2}>{bp.name.toUpperCase()} View (`{bp.name}`)</Heading>
                <Box borderWidth="1px" borderRadius="lg" p={4} maxW="full">
                    <Box bg={`${bp.color}.100`} color={`${bp.color}.800`} p={4} borderRadius="md" textAlign="center">
                        <Text fontWeight="bold">{bp.name.toUpperCase()} ({bp.px}px+)</Text>
                    </Box>
                </Box>
            </Box>
        ))}

      </VStack>
    </Box>
  );
}