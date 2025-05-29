// src/components/layout/site-footer.tsx
import React from 'react';
import { Box, Container, Stack, Text, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
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
          © {new Date().getFullYear()} Your Awesome Project. All rights reserved.
        </Text>

        {FOOTER_LINKS.length > 0 && (
          <Stack direction={"row"} spacing={6}>
            {FOOTER_LINKS.map((link) => (
              <ChakraLink 
                as={NextLink} 
                key={link.label} 
                href={link.href} 
                fontSize="sm"
                color="foreground"
                _hover={{ textDecoration: "underline", color: "primary.DEFAULT" }}
                // passHref removed
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