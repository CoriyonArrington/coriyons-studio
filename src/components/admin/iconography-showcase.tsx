// src/components/admin/iconography-showcase.tsx
'use client';

import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Code,
} from '@chakra-ui/react';
import { Home as HomeIconSvg, Settings as SettingsIconSvg, ExternalLinkIcon } from 'lucide-react';
import { default as CustomHeading } from '@/src/components/typography/heading';
import { default as CustomText } from '@/src/components/typography/text';

export default function IconographyShowcase() {
  return (
    <Box as="section" id="iconography" borderTopWidth="1px" borderColor="border" pt={10}>
      <CustomHeading as="h2" size="xl" mb={6}>
        Iconography
      </CustomHeading>
      <CustomText mb={6}>
        Using Lucide Icons with Chakra UI&apos;s <Code>Icon</Code> component.
      </CustomText>
      <HStack alignItems="center" spacing={6} flexWrap="wrap"> {/* Added flexWrap */}
        <HStack>
          <Icon as={HomeIconSvg} boxSize={5} color="primary.DEFAULT" />{' '}
          <CustomText>Home Icon (size 5)</CustomText>
        </HStack>
        <HStack>
          <Icon as={SettingsIconSvg} boxSize={6} color="secondary.foreground" />{' '}
          <CustomText>Settings Icon (size 6)</CustomText>
        </HStack>
        <HStack>
          <Icon as={ExternalLinkIcon} boxSize={4} /> <CustomText>External Link (default color)</CustomText>
        </HStack>
      </HStack>
    </Box>
  );
}