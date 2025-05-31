// src/components/common/site-footer.tsx
import React from 'react';
import { Box, Container, Stack, Text, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

// Expanded FOOTER_LINKS
const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" }, // Existing
  { label: "Terms of Use", href: "/terms-of-use" }, // "Terms of Service" in current, "/terms-of-use" in app readme
  { label: "Security Policy", href: "/security" },      // Added
  { label: "Accessibility", href: "/accessibility" }, // Added
  { label: "Support", href: "/support"}, // Added
  { label: "FAQ", href: "/resources/faq" } // Example, path from app readme
];

export default function SiteFooter() {
  return (
    <Box as="footer" bg="background" color="foreground" borderTopWidth="1px" borderColor="border">
      <Container
        as={Stack} maxW={"container.xl"} py={4} spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Text fontSize="sm" color="foreground">
          {/* Updated Copyright Project Name */}
          © {new Date().getFullYear()} Coriyon&apos;s Studio. All rights reserved.
        </Text>

        {FOOTER_LINKS.length > 0 && (
          <Stack direction={"row"} spacing={4} flexWrap="wrap" justify="center"> {/* Added flexWrap and justify for smaller screens */}
            {FOOTER_LINKS.map((link) => (
              <ChakraLink 
                as={NextLink} 
                key={link.label} 
                href={link.href} 
                fontSize="sm"
                color="foreground"
                _hover={{ textDecoration: "underline", color: "primary.DEFAULT" }}
                whiteSpace="nowrap" // Prevent ugly wrapping of link text
              >
                {link.label}
              </ChakraLink>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}