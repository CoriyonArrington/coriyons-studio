// src/components/admin/animations-motion-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  HStack,
  Code,
} from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function AnimationsMotionShowcase() {
  return (
    <Box as="section" id="animations" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Animations & Motion
      </CustomHeading>
      <CustomText mb={6}>
        Chakra UI supports transitions and can integrate with animation libraries.
      </CustomText>
      <HStack alignItems="center" spacing={6}>
        <Box
          data-testid="hover-box" 
          w="64px"
          h="64px"
          bg="primary.DEFAULT"
          borderRadius="lg"
          transition="all 0.3s ease-in-out"
          _hover={{ transform: 'scale(1.15) rotate(10deg)', bg: 'accent.DEFAULT' }}
        />
        <CustomText>Hover the box for transition.</CustomText>
      </HStack>
      <CustomHeading as="h3" size="md" mt={6} mb={3}> {/* Ensured this is h3 */}
        Pulse Example (CSS Keyframe)
      </CustomHeading>
      <CustomText fontSize="sm" mb={3} data-testid="pulse-description">
        Requires <Code>@keyframes pulseAnimation</Code> and{' '}
        <Code>animation: pulseAnimation...</Code> to be defined in{' '}
        <Code>src/app/globals.css</Code>.
      </CustomText>
      <Box
        data-testid="pulse-box" 
        w="64px"
        h="64px"
        bg="destructive.DEFAULT"
        borderRadius="lg"
        animation="pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" 
      />
      {/* The <style jsx global> tag has been removed.
          Ensure the @keyframes pulseAnimation is defined in your src/app/globals.css:
          @keyframes pulseAnimation {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05);
            }
          }
      */}
    </Box>
  );
}