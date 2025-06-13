/*
 FINAL VERSION - Key Changes:
 - Resolved all syntax errors, including duplicate function declarations.
 - Corrected the component's structure to properly render the header, navigation, and mobile drawer.
 - Ensured all Chakra UI components and custom components are imported and used correctly.
*/
'use client';

import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link as ChakraLink,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  Heading,
  Show,
  Hide,
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

const NAV_ITEMS = [
  { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader({ user, navAriaLabel = "Main navigation" }: SiteHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box 
      as="header" 
      bg="background"
      color="foreground"
      borderBottomWidth="1px" 
      borderColor="border" 
      py={3} 
      px={{ base: 4, md: 6 }}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
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
              >
                {item.label}
              </ChakraLink>
            ))}
            <ThemeSwitcher />
            <AuthButton user={user} />
          </HStack>
        </Hide>

        <Show below="md">
          <IconButton aria-label="Open menu" icon={<HamburgerIcon />} onClick={onOpen} variant="ghost" />
        </Show>
      </Flex>

      <Show below="md">
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="background" color="foreground">
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px" borderColor="border">Menu</DrawerHeader>
            <DrawerBody>
              <VStack as="nav" spacing={4} align="stretch" aria-label={navAriaLabel ? `${navAriaLabel} mobile` : "Mobile navigation"}>
                {NAV_ITEMS.map((item) => (
                  <ChakraLink
                    as={NextLink}
                    key={item.label}
                    href={item.href}
                    onClick={onClose} display="block" px={2} py={2} rounded="md"
                    _hover={{ textDecoration: "none", bg: "muted.DEFAULT" }}
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