// src/components/admin/chakra-components-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Badge,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Button as ChakraButton,
  Input as ChakraInput,
  FormErrorMessage, // FormErrorMessage is typically from @chakra-ui/react
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/form-control';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text'; // If needed for descriptive text

export default function ChakraComponentsShowcase() {
  return (
    <Box as="section" id="components" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Chakra Components
      </CustomHeading>
      <VStack alignItems="start" spacing={10}>
        <Box id="chakra-buttons"> {/* ID for internal navigation link */}
          <CustomHeading as="h3" size="lg" mb={4}>
            Buttons (Chakra)
          </CustomHeading>
          <HStack flexWrap="wrap" spacing={4}>
            <ChakraButton colorScheme="blue">Default Primary</ChakraButton>
            <ChakraButton variant="themedOutline">Themed Outline</ChakraButton>
            <ChakraButton colorScheme="green" variant="solid">
              Solid Green
            </ChakraButton>
            <ChakraButton colorScheme="red" variant="ghost">
              Ghost Red
            </ChakraButton>
            <ChakraButton colorScheme="purple" variant="link">
              Link Purple
            </ChakraButton>
            <ChakraButton isLoading loadingText="Submitting">
              Loading
            </ChakraButton>
            <ChakraButton isDisabled>Disabled</ChakraButton>
          </HStack>
        </Box>

        <Box id="chakra-badges"> {/* ID for internal navigation link */}
          <CustomHeading as="h3" size="lg" mb={4}>
            Badges
          </CustomHeading>
          <HStack flexWrap="wrap" spacing={4}>
            <Badge colorScheme="green">Default</Badge>
            <Badge colorScheme="yellow" variant="subtle">
              Subtle Yellow
            </Badge>
            <Badge colorScheme="pink" variant="solid">
              Solid Pink
            </Badge>
            <Badge colorScheme="cyan" variant="outline">
              Outline Cyan
            </Badge>
          </HStack>
        </Box>

        <Box id="chakra-forms"> {/* ID for internal navigation link */}
          <CustomHeading as="h3" size="lg" mb={4}>
            Form Elements (Chakra)
          </CustomHeading>
          <VStack maxW="md" alignItems="stretch" spacing={4}>
            <FormControl id="ds-email-chakra-showcase">
              <FormLabel>Email Address</FormLabel>
              <ChakraInput type="email" placeholder="your@email.com" />
              <FormHelperText>We&apos;ll never share your email.</FormHelperText>
            </FormControl>
            <FormControl id="ds-name-chakra-showcase" isInvalid>
              <FormLabel>Name (with error)</FormLabel>
              <ChakraInput type="text" placeholder="Your Name" />
              <FormErrorMessage>Name is required.</FormErrorMessage>
            </FormControl>
            <ChakraButton colorScheme="blue" type="submit" maxW="fit-content">
              Submit Example
            </ChakraButton>
          </VStack>
        </Box>

        <Box id="chakra-loading-states"> {/* ID for internal navigation link */}
          <CustomHeading as="h3" size="lg" mb={4}>
            Loading States (Skeleton)
          </CustomHeading>
          <VStack spacing={6} alignItems="stretch">
            <Box>
              <CustomText mb={2}>Skeleton Text:</CustomText>
              <SkeletonText noOfLines={4} spacing="4" skeletonHeight="3" />
            </Box>
            <Box>
              <CustomText mb={2}>Skeleton Shapes:</CustomText>
              <HStack spacing={4}>
                <Skeleton boxSize="100px" />
                <SkeletonCircle size="24" /> {/* Chakra uses 'size' for diameter */}
                <Skeleton height="20px" width="200px" />
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}