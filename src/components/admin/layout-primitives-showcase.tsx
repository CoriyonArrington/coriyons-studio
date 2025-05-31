// src/components/admin/layout-primitives-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  VStack,
  Divider,
  useColorModeValue,
  Code,
} from '@chakra-ui/react';
import Section from '@/src/components/common/section';
import ContentSection from '@/src/components/common/content-section';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';
import Button from '@/src/components/ui/button';

export default function LayoutPrimitivesShowcase() {
  const sectionDemoContentBg = useColorModeValue("teal.50", "teal.900");
  const sectionDemoContentBorder = useColorModeValue("teal.200", "teal.700");
  const sectionDemoTextColor = useColorModeValue("teal.700", "teal.100");

  const inverseContentChildBg = useColorModeValue("whiteAlpha.200", "blackAlpha.300");
  const inverseContentChildColor = useColorModeValue("white","gray.200");

  return (
    <Box as="section" id="layout-primitives" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>Layout & Sectioning</CustomHeading>
      <VStack alignItems="stretch" spacing={10} divider={<Divider />}>
        <Box id="section-component-showcase">
          <CustomHeading as="h3" size="lg" mb={4}>Section Component</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={4}>
            Location: <Code>@/src/components/common/section.tsx</Code>
          </CustomText>
          
          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Variant: <Code>&quot;default&quot;</Code>, PY: <Code>default</Code>, MaxWidth: <Code>&quot;container.xl&quot;</Code> (default), TextAlign: <Code>&quot;left&quot;</Code> (default)</CustomText>
            <Section>
              <Box bg={sectionDemoContentBg} p={4} borderWidth="1px" borderColor={sectionDemoContentBorder} borderRadius="md">
                <CustomText color={sectionDemoTextColor}>Default section content.</CustomText>
              </Box>
            </Section>
          </Box>

          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Variant: <Code>&quot;subtle&quot;</Code>, PY: <Code>&#123;&#123; base: 16, md: 24 &#125;&#125;</Code>, MaxWidth: <Code>&quot;container.md&quot;</Code>, TextAlign: <Code>&quot;center&quot;</Code></CustomText>
            <Section variant="subtle" py={{ base: 16, md: 24 }} containerMaxWidth="container.md" textAlign="center">
              <Box bg={useColorModeValue("white", "gray.700")} p={4} borderWidth="1px" borderColor={sectionDemoContentBorder} borderRadius="md">
                <CustomText color={useColorModeValue("gray.800", "whiteAlpha.900")}>Subtle section with centered text and medium container.</CustomText>
              </Box>
            </Section>
          </Box>

          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Variant: <Code>&quot;inverse&quot;</Code>, PY: <Code>&#123;&#123; base: 20, md: 32 &#125;&#125;</Code>, MaxWidth: <Code>&quot;none&quot;</Code> (full-width), TextAlign: <Code>&quot;right&quot;</Code></CustomText>
            <Section variant="inverse" py={{ base: 20, md: 32 }} containerMaxWidth="none" textAlign="right">
              <Container maxW="container.lg"> 
                <Box bg={useColorModeValue("gray.700", "gray.200")} p={4} borderWidth="1px" borderColor={useColorModeValue("gray.600", "gray.300")} borderRadius="md">
                  <CustomText color={useColorModeValue("whiteAlpha.900", "gray.800")}>Inverse section with right-aligned text (content manually containerized for demo).</CustomText>
                </Box>
              </Container>
            </Section>
          </Box>
        </Box>

        <Box id="content-section-component-showcase">
          <CustomHeading as="h3" size="lg" mb={4}>ContentSection Component</CustomHeading>
          <CustomText fontSize="sm" color="gray.600" mb={4}>
            Location: <Code>@/src/components/common/content-section.tsx</Code>
          </CustomText>

          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Default props, CTA with icon:</CustomText>
            <ContentSection
              id="cs-demo-default"
              headline="Default ContentSection"
              body="This is the body text for the default content section. It includes a call to action."
              cta="Learn More"
              href="/default-path"
              ctaRightIcon={true}
            />
          </Box>

          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Variant: <Code>&quot;subtle&quot;</Code>, no CTA icon, custom CTA color, left-aligned, large maxW:</CustomText>
            <ContentSection
              id="cs-demo-subtle"
              variant="subtle"
              headline="Subtle & Customized ContentSection"
              subheadline="With a subheadline instead of body, and custom CTA styling."
              cta="Explore Features"
              href="/features"
              ctaColorScheme="purple"
              ctaRightIcon={false}
              textAlign="left"
              maxW="2xl"
              headlineSize="xl"
              bodyFontSize="md"
            />
          </Box>
          
          <Box mb={6}>
            <CustomText mb={2} fontWeight="medium">Variant: <Code>&quot;inverse&quot;</Code>, no CTA, with children:</CustomText>
            <ContentSection
              id="cs-demo-inverse"
              variant="inverse"
              headline="Inverse ContentSection with Children"
              body="This section uses the inverse style."
              textAlign="center"
            >
              <Box mt={4} p={4} bg={inverseContentChildBg} borderRadius="md" w="full">
                <CustomText color={inverseContentChildColor}>This is custom child content within the ContentSection.</CustomText>
                <Button mt={3} colorScheme="pink" variant="solid">Child Button</Button>
              </Box>
            </ContentSection>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}