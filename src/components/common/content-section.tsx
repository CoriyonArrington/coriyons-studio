// src/components/common/content-section.tsx
// - Updated NextLink usage for the CTA button to the modern pattern.
// - Removed `legacyBehavior` and `passHref` from NextLink.
// - Removed `as="a"` from the child Button component, as NextLink now renders the anchor.
"use client";

import React from 'react';
import Section from './section';
import type { SectionProps, SectionVariant } from './section';
import { Heading, Text } from '@/src/components/typography';
import Button from '@/src/components/ui/button'; // Your custom Button component
import NextLink from 'next/link';
import { VStack, SystemProps, Box, Icon as ChakraIcon } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

type ChakraHeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export interface ContentSectionProps {
  id: string;
  headline: string;
  body?: string;
  cta?: string;
  href?: string;
  subheadline?: string;
  variant?: SectionVariant;
  py?: SectionProps['py'];
  ctaColorScheme?: string;
  ctaRightIcon?: boolean;
  headlineSize?: ChakraHeadingSize;
  bodyFontSize?: SystemProps['fontSize'];
  textAlign?: SectionProps['textAlign'];
  maxW?: SystemProps['maxW'];
  children?: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  id,
  headline,
  body,
  cta,
  href,
  subheadline,
  variant = "default",
  py = { base: 12, md: 20 },
  ctaColorScheme = "blue",
  ctaRightIcon,
  headlineSize = "2xl",
  bodyFontSize = "lg",
  textAlign = "center",
  maxW = "xl",
  children,
}) => {
  return (
    <Section
      id={id}
      py={py}
      variant={variant}
      textAlign={textAlign}
    >
      <VStack spacing={5} maxW={maxW} mx="auto">
        <Heading as="h2" size={headlineSize} color={variant === 'inverse' ? 'background' : 'foreground'}>
          {headline}
        </Heading>
        {(body || subheadline) && (
          <Text fontSize={bodyFontSize} color={variant === 'inverse' ? 'background' : 'muted.foreground'} opacity={variant === 'inverse' ? 0.9 : 1}>
            {body || subheadline}
          </Text>
        )}
        {children}
        {cta && href && (
          // Updated NextLink: no legacyBehavior, no passHref.
          // NextLink itself will render the <a> tag.
          <NextLink href={href}>
            <Button
              // `as="a"` is removed here. The Button is now content within NextLink's <a>.
              size="lg"
              colorScheme={variant === 'inverse' ? undefined : ctaColorScheme}
              bg={variant === 'inverse' ? 'background' : undefined}
              color={variant === 'inverse' ? 'foreground' : undefined}
              _hover={variant === 'inverse' ? { opacity: 0.9 } : undefined}
            >
              {cta}
              {ctaRightIcon && (
                <Box as="span" ml={2} display="inline-flex" alignItems="center">
                  <ChakraIcon as={ArrowForwardIcon} />
                </Box>
              )}
            </Button>
          </NextLink>
        )}
      </VStack>
    </Section>
  );
};

export default ContentSection;