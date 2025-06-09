// ATTEMPT 1: Removing an unnecessary conditional fallback.
// - The `CategorizedFooterPages` type guarantees that `footerPages.LEGAL`
//   is always an array, so the `|| []` fallback is redundant.

"use client";

import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link as ChakraLink,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  type FooterLink,
  type CategorizedFooterPages,
  type FooterCategory,
} from "@/src/lib/data/pages";

const footerLinkColumns: Array<{ title: string; categoryKey: FooterCategory }> = [
  { title: "Main", categoryKey: "MAIN" },
  { title: "Resources", categoryKey: "RESOURCES" },
  { title: "Support", categoryKey: "SUPPORT" },
];

export default function SiteFooter({
  footerPages,
}: {
  footerPages: CategorizedFooterPages;
}) {
  const currentYear = new Date().getFullYear();

  const renderLinkColumn = (
    title: string,
    links: FooterLink[] | undefined
  ) => {
    const hasLinks = links && links.length > 0;
    return (
      <Stack align={{ base: "center", md: "flex-start" }}>
        <Heading
          size="sm"
          color="foreground"
          mb={3}
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {title}
        </Heading>
        {hasLinks ? (
          links.map((link: FooterLink) => (
            <ChakraLink
              as={NextLink}
              key={link.title}
              href={link.href}
              fontSize="sm"
              _hover={{ color: "primary.500", textDecoration: "underline" }}
              color="muted.foreground"
            >
              {link.title}
            </ChakraLink>
          ))
        ) : title === "Support" ? (
          <Text fontSize="sm" color="muted.foreground">
            (No support links yet)
          </Text>
        ) : null}
      </Stack>
    );
  };

  // FIX: Removed unnecessary `|| []` fallback. `footerPages.LEGAL` is always an array.
  const legalLinks = footerPages.LEGAL;

  return (
    <Box as="footer" bg="muted.DEFAULT" color="muted.foreground">
      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 8, md: 10 }}
        >
          <Stack spacing={4} align={{ base: "center", md: "flex-start" }}>
            <ChakraLink as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
              <Heading size="md" color="foreground">
                Coriyon&apos;s Studio
              </Heading>
            </ChakraLink>
            <Text
              fontSize="sm"
              textAlign={{ base: "center", md: "left" }}
              maxW="280px"
            >
              Senior Product Designer with a biomedical engineering background. I
              specialize in creating seamless customer experiences for tech
              startups and enterprises.
            </Text>
          </Stack>

          {footerLinkColumns.map((column) => (
            <React.Fragment key={column.categoryKey}>
             {renderLinkColumn(column.title, footerPages[column.categoryKey])}
            </React.Fragment>
          ))}

          <Stack align={{ base: "center", md: "flex-start" }}>
            <Heading
              size="sm"
              color="foreground"
              mb={3}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Contact
            </Heading>
            <ChakraLink
              href="mailto:coriyonarrington@gmail.com"
              fontSize="sm"
              _hover={{ color: "primary.500", textDecoration: "underline" }}
              isExternal
              color="muted.foreground"
            >
              coriyonarrington@gmail.com
            </ChakraLink>
            <ChakraLink
              href="https://www.linkedin.com/in/coriyonarrington/"
              fontSize="sm"
              _hover={{ color: "primary.500", textDecoration: "underline" }}
              isExternal
              color="muted.foreground"
            >
              LinkedIn
            </ChakraLink>
            <Text fontSize="sm">Minneapolis, MN</Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box borderTopWidth="1px" borderColor="border">
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
          {legalLinks.length > 0 && (
            <Stack
              direction={"row"}
              spacing={4}
              flexWrap="wrap"
              justify="center"
            >
              {legalLinks.map((link: FooterLink) => (
                <ChakraLink
                  as={NextLink}
                  key={link.title}
                  href={link.href}
                  fontSize="xs"
                  _hover={{
                    textDecoration: "underline",
                    color: "primary.500",
                  }}
                  color="muted.foreground"
                >
                  {link.title}
                </ChakraLink>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </Box>
  );
}