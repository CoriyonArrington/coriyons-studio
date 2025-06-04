// src/components/common/site-footer.tsx

import React from 'react';
import { Box, Container, Stack, Text, Link as ChakraLink, Heading, SimpleGrid } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  getCategorizedFooterPages,
  type FooterLink,
  type CategorizedFooterPages,
  type FooterCategory
} from '@/src/lib/data/pages';

// Define the order and titles for your dynamic columns
// Use the imported FooterCategory for type safety on categoryKey
const footerLinkColumns: Array<{ title: string; categoryKey: FooterCategory }> = [
  { title: "Main", categoryKey: "MAIN" },
  { title: "Resources", categoryKey: "RESOURCES" },
  { title: "Support", categoryKey: "SUPPORT" },
];

export default async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const categorizedPages: CategorizedFooterPages = (await getCategorizedFooterPages()) || {
    MAIN: [],
    RESOURCES: [],
    SUPPORT: [],
    LEGAL: []
  };

  // Helper function to render a link column
  const renderLinkColumn = (title: string, links: FooterLink[] | undefined) => {
    const actualLinks = links || []; // Default to empty array if undefined

    if (actualLinks.length === 0 && title.toLowerCase() !== "support") {
      return null; // Skip empty columns, except "Support" which shows placeholder
    }

    return (
      <Stack align={{ base: 'center', md: 'flex-start' }}>
        <Heading size="sm" color="whiteAlpha.900" mb={3} textTransform="uppercase" letterSpacing="wider">
          {title}
        </Heading>
        {actualLinks.map((link: FooterLink) => (
          link.href && link.title ? (
            <ChakraLink
              as={NextLink}
              key={link.title}
              href={link.href}
              fontSize="sm"
              _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }}
            >
              {link.title}
            </ChakraLink>
          ) : null
        ))}
        {title.toLowerCase() === "support" && actualLinks.length === 0 && (
          <Text fontSize="sm" fontStyle="italic">(No support links yet)</Text>
        )}
      </Stack>
    );
  };

  const legalLinks = categorizedPages.LEGAL || [];

  return (
    <Box as="footer" bg="gray.800" color="gray.400">
      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 8, md: 10 }}>
          {/* Column 1: Coriyon's Studio Info (Static) */}
          <Stack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
            <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
              <Heading size="md" color="whiteAlpha.900">Coriyon&apos;s Studio</Heading>
            </ChakraLink>
            <Text fontSize="sm" textAlign={{ base: 'center', md: 'left' }} maxW="280px">
              Senior Product Designer with a biomedical engineering background. I specialize in creating seamless customer experiences for tech startups and enterprises.
            </Text>
          </Stack>

          {/* Dynamically generated columns */}
          {footerLinkColumns.map(column => {
            const columnElement = renderLinkColumn(column.title, categorizedPages[column.categoryKey]);
            return columnElement ? React.cloneElement(columnElement, { key: column.categoryKey }) : null;
          })}

          {/* Column 4: Contact Info (Static) */}
          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Heading size="sm" color="whiteAlpha.900" mb={3} textTransform="uppercase" letterSpacing="wider">
              Contact
            </Heading>
            <ChakraLink href="mailto:coriyonarrington@gmail.com" fontSize="sm" _hover={{ color: "whiteAlpha.800", textDecoration: "underline" }} isExternal>
              coriyonarrington@gmail.com
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
          {/* Dynamically rendered legal links */}
          {legalLinks.length > 0 && (
            <Stack direction={"row"} spacing={4} flexWrap="wrap" justify="center">
              {legalLinks.map((link: FooterLink) => (
                link.href && link.title ? (
                  <ChakraLink
                    as={NextLink}
                    key={link.title}
                    href={link.href}
                    fontSize="xs"
                    _hover={{ textDecoration: "underline", color: "whiteAlpha.800" }}
                  >
                    {link.title}
                  </ChakraLink>
                ) : null
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </Box>
  );
}
