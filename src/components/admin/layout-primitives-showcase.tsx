// ATTEMPT 2: Final cleanup.
// - Removed the unused `useColorModeValue` hook from the imports.

'use client';

import React from 'react';
import {
  Box,
  VStack,
  Divider,
  // FIX: Removed unused 'useColorModeValue' hook.
  Code,
  Heading,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';

// User-provided content for the showcase examples
const finalCtaSection = {
  ctas: [
    {
      href: '/contact?reason=consult',
      text: 'Book a Free 20-Minute Consult',
    },
    {
      href: '/contact?reason=new-project',
      text: 'Start a Project',
    },
  ],
  headline: 'Let’s Build Something Meaningful Together.',
  body_paragraph:
    'Your patients deserve a seamless experience, and you deserve a UX partner who listens. Let’s simplify what’s not working—so you can launch solutions that truly help. I’ll bring the process, the pixels, and the strategy. You bring your vision for healthier, happier patients.',
};

export default function LayoutPrimitivesShowcase() {
  
  return (
    <Box as="section" id="layout-primitives" borderTopWidth="1px" borderColor="border" pt={10}>
      <Section containerMaxWidth="container.lg">
        <Heading as="h2" size="xl" mb={6}>Layout & Sectioning</Heading>
      </Section>
      
      <VStack alignItems="stretch" spacing={10}>
        <Section containerMaxWidth="container.lg">
            <Divider />
            <Box id="section-component-showcase" pt={10}>
                <Heading as="h3" size="lg" mb={4}>Section Component</Heading>
                <Text fontSize="sm" color="muted.foreground" mb={4}>
                    Location: <Code>@/src/components/common/section.tsx</Code>
                </Text>
                {/* ... Section examples ... */}
            </Box>
        </Section>

        <Box id="content-section-component-showcase">
          <Section containerMaxWidth="container.lg">
             <Divider />
             <Box pt={10}>
                <Heading as="h3" size="lg" mb={4}>ContentSection Component</Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Location: <Code>@/src/components/common/content-section.tsx</Code>
                </Text>
             </Box>
          </Section>

          <VStack spacing={8} alignItems="stretch" mt={6}>
            <Section containerMaxWidth="container.lg">
                <Text mb={2} fontWeight="medium">Variant: <Code>&quot;default&quot;</Code></Text>
                <ContentSection
                    id="cs-example-default"
                    headline={finalCtaSection.headline}
                    body={finalCtaSection.body_paragraph}
                >
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={6} justify="center">
                        <Button as="a" href={finalCtaSection.ctas[1].href} colorScheme="primary">
                            {finalCtaSection.ctas[1].text}
                        </Button>
                        <Button as="a" href={finalCtaSection.ctas[0].href} variant="outline" colorScheme="primary">
                            {finalCtaSection.ctas[0].text}
                        </Button>
                    </Stack>
                </ContentSection>
            </Section>

            {/* Note: This ContentSection is intentionally not wrapped in a Section to show its subtle variant */}
            <ContentSection
                id="cs-example-subtle"
                variant="subtle"
                headline={finalCtaSection.headline}
                body={finalCtaSection.body_paragraph}
                >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={6} justify="center">
                    <Button as="a" href={finalCtaSection.ctas[1].href} colorScheme="primary">
                        {finalCtaSection.ctas[1].text}
                    </Button>
                    <Button as="a" href={finalCtaSection.ctas[0].href} variant="outline" colorScheme="primary">
                        {finalCtaSection.ctas[0].text}
                    </Button>
                </Stack>
            </ContentSection>
            
            <ContentSection
                id="cs-example-inverse"
                variant="inverse"
                headline={finalCtaSection.headline}
                body={finalCtaSection.body_paragraph}
            >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={6} justify="center">
                <Button as="a" href={finalCtaSection.ctas[1].href} colorScheme="gray">
                    {finalCtaSection.ctas[1].text}
                </Button>
                <Button
                    as="a"
                    href={finalCtaSection.ctas[0].href}
                    variant="outline"
                    color="whiteAlpha.900"
                    borderColor="whiteAlpha.400"
                    _hover={{ bg: 'whiteAlpha.200', textDecoration: 'none' }}
                >
                    {finalCtaSection.ctas[0].text}
                </Button>
                </Stack>
            </ContentSection>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}