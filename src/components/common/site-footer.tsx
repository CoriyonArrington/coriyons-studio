// src/components/common/site-footer.tsx
// - Ensures links for Accessibility and Security Policy point to the correct slugs.

import React from 'react';
import { Box, Container, Stack, Text, Link as ChakraLink, Heading, SimpleGrid } from "@chakra-ui/react"; // Added Heading, SimpleGrid
import NextLink from "next/link";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact"}, // Added Contact to main links for consistency with some footers
];

const resourcesLinks = [
  { label: "Testimonials", href: "/testimonials" },
  { label: "Process", href: "/process" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog"}, // Added Blog link
];

// Links for the bottom bar
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Accessibility", href: "/accessibility-statement" }, // Updated slug
  { label: "Security Policy", href: "/security-policy" },    // Updated slug
  // { label: "Support", href: "/support"}, // Optional
];

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.800" color="gray.400">
      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{base: 8, md:10}}> {/* Adjusted to 4 columns */}
          <Stack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
            <ChakraLink as={NextLink} href="/" _hover={{textDecoration: 'none'}}>
                <Heading size="md" color="whiteAlpha.900">Coriyon&apos;s Studio</Heading>
            </ChakraLink>
            <Text fontSize="sm" textAlign={{ base: 'center', md: 'left' }} maxW="280px">
              Senior Product Designer with a biomedical engineering background. I specialize in creating seamless customer experiences for tech startups and enterprises.
            </Text>
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Heading size="sm" color="whiteAlpha.900" mb={3} textTransform="uppercase" letterSpacing="wider">Main</Heading>
            {mainLinks.map((link) => (
              <ChakraLink as={NextLink} key={link.label} href={link.href} fontSize="sm" _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }}>
                {link.label}
              </ChakraLink>
            ))}
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Heading size="sm" color="whiteAlpha.900" mb={3} textTransform="uppercase" letterSpacing="wider">Resources</Heading>
            {resourcesLinks.map((link) => (
              <ChakraLink as={NextLink} key={link.label} href={link.href} fontSize="sm" _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }}>
                {link.label}
              </ChakraLink>
            ))}
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Heading size="sm" color="whiteAlpha.900" mb={3} textTransform="uppercase" letterSpacing="wider">Contact</Heading>
            <ChakraLink href="mailto:coriyonarrington@gmail.com" fontSize="sm" _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }} isExternal>
              coriyonarrington@gm...
            </ChakraLink>
            <ChakraLink href="https://www.linkedin.com/in/coriyonarrington/" fontSize="sm" _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }} isExternal>
              LinkedIn
            </ChakraLink>
            <Text fontSize="sm">Minneapolis, MN</Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box borderTopWidth="1px" borderColor="gray.700">
        <Container
          maxW="container.xl"
          py={4}
          as={Stack}
          direction={{ base: "column-reverse", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text fontSize="xs">
            © {currentYear} Coriyon&apos;s Studio. All rights reserved.
          </Text>
          <Stack direction={"row"} spacing={4} flexWrap="wrap" justify="center">
            {legalLinks.map((link) => (
              <ChakraLink
                as={NextLink}
                key={link.label}
                href={link.href}
                fontSize="xs"
                _hover={{ textDecoration: "underline", color: "whiteAlpha.800" }}
              >
                {link.label}
              </ChakraLink>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}