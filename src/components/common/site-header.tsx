// src/components/common/site-header.tsx
// - Manually reordered NAV_ITEMS to match the new desired global sort order:
//   Home, Services, Projects, About, Contact.
'use client';

import React from 'react';
import {
  Box, Flex, HStack, VStack, Link as ChakraLink, IconButton,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, useDisclosure, Spacer, Heading, Show, Hide,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { ThemeSwitcher } from "../navigation/theme-switcher";
import AuthButton from "../navigation/header-auth";
import type { User } from "@supabase/supabase-js";

interface SiteHeaderProps {
  user: User | null;
  navAriaLabel?: string;
}

// Updated NAV_ITEMS order to match your specified sort_order
const NAV_ITEMS = [
  { label: "Home", href: "/" },              // Sort Order 1
  { label: "Projects", href: "/projects" },  // Sort Order 2
  { label: "Services", href: "/services" },  // Sort Order 3
  { label: "About", href: "/about" },        // Sort Order 4
  { label: "Contact", href: "/contact" },    // Sort Order 5
];

export default function SiteHeader({ user, navAriaLabel = "Main navigation" }: SiteHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="header" bg="background" borderBottomWidth="1px" borderColor="border" py={3} px={{ base: 4, md: 6 }}>
      <Flex align="center" maxW="container.xl" mx="auto">
        <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
          <Heading size="md" color="foreground">Coriyon&apos;s Studio</Heading>
        </ChakraLink>

        <Spacer />

        <Hide below="md">
          <HStack as="nav" spacing={4} alignItems="center" aria-label={navAriaLabel}>
            {NAV_ITEMS.map((item) => (
              <ChakraLink
                as={NextLink}
                key={item.label}
                href={item.href}
                px={2} py={1} rounded="md"
                _hover={{ textDecoration: "none", bg: "muted.DEFAULT" }}
                color="foreground"
              >
                {item.label}
              </ChakraLink>
            ))}
            <ThemeSwitcher />
            <AuthButton user={user} />
          </HStack>
        </Hide>

        <Show below="md">
          <IconButton aria-label="Open menu" icon={<HamburgerIcon />} onClick={onOpen} variant="ghost" color="foreground"/>
        </Show>
      </Flex>

      <Show below="md">
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="background">
            <DrawerCloseButton color="foreground" />
            <DrawerHeader borderBottomWidth="1px" borderColor="border" color="foreground">Menu</DrawerHeader>
            <DrawerBody>
              <VStack as="nav" spacing={4} align="stretch" aria-label={navAriaLabel ? `${navAriaLabel} mobile` : "Mobile navigation"}>
                {NAV_ITEMS.map((item) => (
                  <ChakraLink
                    as={NextLink}
                    key={item.label}
                    href={item.href}
                    onClick={onClose} display="block" px={2} py={2} rounded="md"
                    _hover={{ textDecoration: "none", bg: "muted.DEFAULT" }}
                    color="foreground"
                  >
                    {item.label}
                  </ChakraLink>
                ))}
                <Box pt={4} mt={4} borderTopWidth="1px" borderColor="border"><ThemeSwitcher /></Box>
                <Box pt={4} mt={2} borderTopWidth="1px" borderColor="border">
                  <AuthButton user={user} />
                </Box>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Show>
    </Box>
  );
}