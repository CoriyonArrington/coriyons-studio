// src/components/layout/site-footer.tsx
"use client";

import { Box, Text, Flex, Link as ChakraLink, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

export default function SiteFooter() { // Component name remains PascalCase
  return (
    <Box
      as="footer"
      w="full"
      py={6}
      px={{ base: 4, md: 8 }}
      borderTopWidth="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <VStack spacing={4} maxW="container.xl" mx="auto">
        <Flex
          w="full"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            &copy; {new Date().getFullYear()} YourSite. All rights reserved.
          </Text>
          <Flex gap={{ base: 4, md: 6 }}>
            <ChakraLink as={NextLink} href="/privacy" fontSize="sm" _hover={{ textDecoration: "underline" }}>
              Privacy Policy
            </ChakraLink>
            <ChakraLink as={NextLink} href="/terms" fontSize="sm" _hover={{ textDecoration: "underline" }}>
              Terms of Service
            </ChakraLink>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
}