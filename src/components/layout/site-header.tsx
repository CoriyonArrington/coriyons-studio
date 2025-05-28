// src/components/layout/site-header.tsx
"use client";

import { Box, Flex, Heading, Link as ChakraLink, Spacer, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import AuthButton from "@/src/components/header-auth"; // Make sure path is correct
import { ThemeSwitcher } from "@/src/components/theme-switcher"; // Make sure path is correct
import type { User } from "@supabase/supabase-js"; // Import User type

interface SiteHeaderProps {
  user: User | null;
}

export default function SiteHeader({ user }: SiteHeaderProps) { // Accept user as a prop
  return (
    <Box
      as="header"
      w="full"
      py={3}
      px={{ base: 4, md: 8 }}
      borderBottomWidth="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
          <Heading size="md">YourSite</Heading>
        </ChakraLink>
        <Spacer />
        <HStack spacing={{ base: 2, md: 4 }}>
          <ChakraLink as={NextLink} href="/notes" fontWeight="medium">
            Notes
          </ChakraLink>
          <ChakraLink as={NextLink} href="/instruments" fontWeight="medium">
            Instruments
          </ChakraLink>
          <ThemeSwitcher />
          {/* Pass user data to AuthButton */}
          <AuthButton user={user} />
        </HStack>
      </Flex>
    </Box>
  );
}