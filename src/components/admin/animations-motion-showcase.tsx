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

export default function AnimationsMotionShowcase() {
  return (
    <Box as="section" id="animations" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Animations & Motion
      </Heading>
      <Text mb={6}>
        Chakra UI supports transitions and can integrate with animation libraries.
      </Text>
      <HStack alignItems="center" spacing={6}>
        <Box
          data-testid="hover-box" 
          w="64px"
          h="64px"
          bg="primary.500"
          borderRadius="lg"
          transition="all 0.3s ease-in-out"
          _hover={{ transform: 'scale(1.15) rotate(10deg)', bg: 'accent.DEFAULT' }}
        />
        <Text>Hover the box for transition.</Text>
      </HStack>
      <Heading as="h3" size="md" mt={6} mb={3}>
        Pulse Example (CSS Keyframe)
      </Heading>
      <Text fontSize="sm" mb={3} data-testid="pulse-description">
        Requires <Code>@keyframes pulseAnimation</Code> and{' '}
        <Code>animation: pulseAnimation...</Code> to be defined in{' '}
        <Code>src/app/globals.css</Code>.
      </Text>
      <Box
        data-testid="pulse-box" 
        w="64px"
        h="64px"
        bg="destructive.500"
        borderRadius="lg"
        animation="pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" 
      />
    </Box>
  );
}