// ATTEMPT #3: Removing incorrect self-import.
// Change 1: Removed a faulty line that was causing the component to import itself, which resolves the "Failed to resolve import" error and allows the test suites to run correctly.

'use client';

import React from 'react';
import {
  Box,
  VStack,
  Code,
  Heading,
  Text,
  useTheme,
  SimpleGrid,
} from '@chakra-ui/react';

// Define a type for our breakpoint data for better type safety.
interface BreakpointInfo {
  name: string;
  value: string;
  px: number;
  color: string;
}

// Define a color map for the breakpoints.
const breakpointColors: Record<string, string> = {
  sm: 'orange',
  md: 'yellow',
  lg: 'green',
  xl: 'blue',
  '2xl': 'purple',
};

export default function BreakpointsShowcase() {
  const theme = useTheme();

  const breakpoints = theme.breakpoints as Record<string, string> | undefined;

  const breakpointData: BreakpointInfo[] = breakpoints
    ? Object.keys(breakpoints).map(key => {
        const value = breakpoints[key];
        return {
          name: key,
          value: value,
          px: parseFloat(value) * 16,
          color: breakpointColors[key] || 'gray',
        };
      })
    : [];


  return (
    <Box as="section" id="breakpoints" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Breakpoints
      </Heading>
      <Text mb={6}>
        Chakra UI uses standard responsive breakpoints. Test by resizing your browser window.
      </Text>
      
      <Box mb={8} p={4} borderWidth="1px" borderRadius="lg" bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
        <Heading as="h3" size="md" mb={3}>Breakpoint Key</Heading>
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
          <Heading as="h3" size="md" mb={2}>Mobile View (`base`)</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={4} maxW="full">
            <Box bg="red.100" color="red.800" p={4} borderRadius="md" textAlign="center">
              <Text fontWeight="bold">Base (0px+)</Text>
            </Box>
          </Box>
        </Box>
        
        {/* All other breakpoints render conditionally */}
        {breakpointData.map(bp => (
            <Box key={bp.name} display={{ base: 'none', [bp.name]: 'block' }}>
                <Heading as="h3" size="md" mb={2}>{bp.name.toUpperCase()} View (`{bp.name}`)</Heading>
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