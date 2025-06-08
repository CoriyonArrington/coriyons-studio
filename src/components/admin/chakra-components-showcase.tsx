/*
 FINAL VERSION - Key Changes:
 - Removed unused imports for `CustomHeading` and `CustomText` to clean up the code.
 - All components are now imported directly from '@chakra-ui/react'.
*/
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
  FormErrorMessage,
  Heading,
  Text,
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/form-control';

export default function ChakraComponentsShowcase() {
  return (
    <Box as="section" id="components" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Chakra Components
      </Heading>
      <VStack alignItems="start" spacing={10}>
        <Box id="chakra-buttons">
          <Heading as="h3" size="lg" mb={4}>
            Buttons (Chakra)
          </Heading>
          <HStack flexWrap="wrap" spacing={4}>
            <ChakraButton colorScheme="blue">Default Primary</ChakraButton>
            <ChakraButton variant="outline">Themed Outline</ChakraButton>
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

        <Box id="chakra-badges">
          <Heading as="h3" size="lg" mb={4}>
            Badges
          </Heading>
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

        <Box id="chakra-forms">
          <Heading as="h3" size="lg" mb={4}>
            Form Elements (Chakra)
          </Heading>
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

        <Box id="chakra-loading-states">
          <Heading as="h3" size="lg" mb={4}>
            Loading States (Skeleton)
          </Heading>
          <VStack spacing={6} alignItems="stretch">
            <Box>
              <Text mb={2}>Skeleton Text:</Text>
              <SkeletonText noOfLines={4} spacing="4" skeletonHeight="3" />
            </Box>
            <Box>
              <Text mb={2}>Skeleton Shapes:</Text>
              <HStack spacing={4}>
                <Skeleton boxSize="100px" />
                <SkeletonCircle size="24" />
                <Skeleton height="20px" width="200px" />
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}