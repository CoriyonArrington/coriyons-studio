// src/components/admin/color-system-showcase.tsx
'use client';

import React from 'react';
import { Box, SimpleGrid, Code } from '@chakra-ui/react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

interface ChakraColorSwatchProps {
  title: string;
  themeColorKey: string;
  displayColorValue: string;
  themeTextColorKey: string;
  border?: boolean;
}

function ChakraColorSwatch({
  title,
  themeColorKey,
  displayColorValue,
  themeTextColorKey,
  border = false,
}: ChakraColorSwatchProps) {
  return (
    <Box textAlign="center">
      <Box
        h="80px"
        w="full"
        borderRadius="md"
        bg={themeColorKey}
        borderWidth={border ? '1px' : '0'}
        borderColor="border" 
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CustomText fontSize="xs" fontWeight="medium" color={themeTextColorKey}>
          Aa
        </CustomText>
      </Box>
      <CustomText fontSize="sm" mt={2} mb={0}>
        {title}
      </CustomText>
      <Code fontSize="xs" display="block">
        {displayColorValue}
      </Code>
    </Box>
  );
}

export default function ColorSystemShowcase() {
  return (
    <Box as="section" id="colors">
      <CustomHeading as="h2" size="xl" mb={6}>
        Color System
      </CustomHeading>
      <CustomText mb={6}>
        Defined via CSS variables and mapped to Chakra theme tokens in{' '}
        <Code>src/lib/theme.ts</Code>.
      </CustomText>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={6}> {/* Removed role="grid" */}
        <ChakraColorSwatch
          title="Primary"
          themeColorKey="primary.DEFAULT"
          displayColorValue="var(--primary)"
          themeTextColorKey="primary.foreground"
        />
        <ChakraColorSwatch
          title="Secondary"
          themeColorKey="secondary.DEFAULT"
          displayColorValue="var(--secondary)"
          themeTextColorKey="secondary.foreground"
        />
        <ChakraColorSwatch
          title="Destructive"
          themeColorKey="destructive.DEFAULT"
          displayColorValue="var(--destructive)"
          themeTextColorKey="destructive.foreground"
        />
        <ChakraColorSwatch
          title="Accent"
          themeColorKey="accent.DEFAULT"
          displayColorValue="var(--accent)"
          themeTextColorKey="accent.foreground"
        />
        <ChakraColorSwatch
          title="Background"
          themeColorKey="background"
          displayColorValue="var(--background)"
          themeTextColorKey="foreground"
          border
        />
        <ChakraColorSwatch
          title="Foreground"
          themeColorKey="foreground"
          displayColorValue="var(--foreground)"
          themeTextColorKey="background"
          border
        />
        <ChakraColorSwatch
          title="Card"
          themeColorKey="card.DEFAULT"
          displayColorValue="var(--card)"
          themeTextColorKey="card.foreground"
          border
        />
        <ChakraColorSwatch
          title="Muted"
          themeColorKey="muted.DEFAULT"
          displayColorValue="var(--muted)"
          themeTextColorKey="muted.foreground"
          border
        />
        <ChakraColorSwatch
          title="Border"
          themeColorKey="border"
          displayColorValue="var(--border)"
          themeTextColorKey="foreground"
        />
        <ChakraColorSwatch
          title="Input"
          themeColorKey="input"
          displayColorValue="var(--input)"
          themeTextColorKey="foreground"
          border
        />
        <ChakraColorSwatch
          title="Ring"
          themeColorKey="ring"
          displayColorValue="var(--ring)"
          themeTextColorKey="foreground"
        />
      </SimpleGrid>
    </Box>
  );
}