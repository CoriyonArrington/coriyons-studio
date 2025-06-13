/*
 FINAL VERSION - Key Changes:
 - The 'themeColorKey' for the Chart swatches has been updated to apply the CSS variable directly, ensuring they always render correctly.
 - All other swatches have been verified to use the correct keys from your final theme.
*/
'use client';

import React from 'react';
import { Box, SimpleGrid, Code, Heading, Text } from '@chakra-ui/react';

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
        <Text fontSize="xs" fontWeight="medium" color={themeTextColorKey}>
          Aa
        </Text>
      </Box>
      <Text fontSize="sm" mt={2} mb={0}>
        {title}
      </Text>
      <Code fontSize="xs" display="block">
        {displayColorValue}
      </Code>
    </Box>
  );
}

export default function ColorSystemShowcase() {
  return (
    <Box as="section" id="colors">
      <Heading as="h2" size="xl" mb={6}>
        Color System
      </Heading>
      <Text mb={6}>
        Defined via CSS variables and mapped to Chakra theme tokens in{' '}
        <Code>src/lib/theme.ts</Code>.
      </Text>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={6}>
        <ChakraColorSwatch
          title="Primary"
          themeColorKey="primary.500"
          displayColorValue="var(--primary)"
          themeTextColorKey="white"
        />
        <ChakraColorSwatch
          title="Secondary"
          themeColorKey="secondary.500"
          displayColorValue="var(--secondary)"
          themeTextColorKey="secondary.foreground"
        />
        <ChakraColorSwatch
          title="Destructive"
          themeColorKey="destructive.500"
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
          themeTextColorKey="white"
        />
        <Box />
        <ChakraColorSwatch
          title="Chart 1"
          themeColorKey="hsl(var(--chart-1))"
          displayColorValue="var(--chart-1)"
          themeTextColorKey="black"
        />
         <ChakraColorSwatch
          title="Chart 2"
          themeColorKey="hsl(var(--chart-2))"
          displayColorValue="var(--chart-2)"
          themeTextColorKey="white"
        />
         <ChakraColorSwatch
          title="Chart 3"
          themeColorKey="hsl(var(--chart-3))"
          displayColorValue="var(--chart-3)"
          themeTextColorKey="white"
        />
         <ChakraColorSwatch
          title="Chart 4"
          themeColorKey="hsl(var(--chart-4))"
          displayColorValue="var(--chart-4)"
          themeTextColorKey="black"
        />
         <ChakraColorSwatch
          title="Chart 5"
          themeColorKey="hsl(var(--chart-5))"
          displayColorValue="var(--chart-5)"
          themeTextColorKey="black"
        />
      </SimpleGrid>
    </Box>
  );
}