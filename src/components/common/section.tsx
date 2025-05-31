// src/components/common/section.tsx
"use client";

import React from 'react';
import { Box, BoxProps, Container, ResponsiveValue, SystemProps } from '@chakra-ui/react'; // Added SystemProps back if used by py

export type SectionVariant = 'default' | 'subtle' | 'inverse';

export interface SectionProps extends Omit<BoxProps, 'variant'> {
  children?: React.ReactNode;
  containerMaxWidth?: ResponsiveValue<string>;
  containerPx?: BoxProps['px'];
  variant?: SectionVariant;
  py?: SystemProps['py']; // Explicitly typed py if it's not directly from BoxProps spread alone
  bg?: SystemProps['bg'];   // Explicitly typed bg
  textAlign?: SystemProps['textAlign']; // Added textAlign to props
}

const Section: React.FC<SectionProps> = ({
  children,
  py = { base: 8, md: 12 },
  bg = "transparent",
  containerMaxWidth = "container.xl",
  containerPx,
  variant = "default",
  textAlign, // Destructure textAlign
  ...restBoxProps
}) => {
  let sectionBg = bg;

  if (variant === 'subtle') {
    sectionBg = 'muted.DEFAULT';
  } else if (variant === 'inverse') {
    sectionBg = 'foreground';
  }

  // console.log(`CLIENT DEBUG: src/components/common/section.tsx - Rendering. Variant: ${variant}, Final BG: ${sectionBg}`); // Removed this line

  return (
    <Box
      as="section"
      py={py}
      bg={sectionBg}
      textAlign={textAlign} // Apply textAlign if passed
      {...restBoxProps}
    >
      {containerMaxWidth && containerMaxWidth !== 'none' ? (
        <Container
          maxW={containerMaxWidth}
          px={containerPx}
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </Box>
  );
};

export default Section;