// src/app/page.tsx
'use client';

import { Box, Heading, Text, VStack, Spinner } from '@chakra-ui/react';

export default function ComingSoonPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%" // Takes full width of its container in layout.tsx
      py={{ base: 10, md: 20 }} // Vertical padding
      textAlign="center"
    >
      <VStack spacing={8}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="border"
          color="primary.DEFAULT"
          size="xl"
        />
        <Heading
          as="h1"
          fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
          color="foreground"
        >
          Coming Soon!
        </Heading>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color="muted.foreground"
        >
          {/* Corrected line below */}
          We&apos;re working hard to bring something amazing to you.
          <br />
          Stay tuned for updates!
        </Text>
      </VStack>
    </Box>
  );
}