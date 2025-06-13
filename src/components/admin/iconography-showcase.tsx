/*
 FINAL VERSION - Key Changes:
 - Added more diverse icon examples (User, Mail, CheckCircle) to better showcase the library.
 - Included a `ChakraLink` that points directly to the official Lucide icons website for easy Browse.
 - Updated imports to use `Heading` and `Text` directly from '@chakra-ui/react'.
 - Wrapped each icon group in a <WrapItem> to ensure valid HTML and pass accessibility checks.
*/
'use client';

import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Code,
  Heading,
  Text,
  Wrap,
  WrapItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import {
  Home as HomeIconSvg,
  Settings as SettingsIconSvg,
  ExternalLink as ExternalLinkIcon,
  User as UserIcon,
  Mail as MailIcon,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';

export default function IconographyShowcase() {
  return (
    <Box as="section" id="iconography" borderTopWidth="1px" borderColor="border" pt={10}>
      <Heading as="h2" size="xl" mb={6}>
        Iconography
      </Heading>
      <Text mb={4}>
        Using Lucide Icons with Chakra UI&apos;s <Code>Icon</Code> component. You can change the <Code>boxSize</Code>, <Code>color</Code>, and other style props as needed.
      </Text>
      <Text mb={6}>
        Browse the full library here:{' '}
        <ChakraLink href="https://lucide.dev/icons/" isExternal color="blue.500">
          lucide.dev/icons/ <Icon as={ExternalLinkIcon} mx="2px" boxSize="0.8em" />
        </ChakraLink>
      </Text>
      <Wrap spacing={6} align="center">
        <WrapItem>
          <HStack>
            <Icon as={HomeIconSvg} boxSize={5} color="primary.500" />
            <Text>Home Icon (size 5)</Text>
          </HStack>
        </WrapItem>
        <WrapItem>
          <HStack>
            <Icon as={SettingsIconSvg} boxSize={6} color="secondary.500" />
            <Text>Settings Icon (size 6)</Text>
          </HStack>
        </WrapItem>
         <WrapItem>
          <HStack>
            <Icon as={UserIcon} boxSize={5} />
            <Text>User Icon</Text>
          </HStack>
        </WrapItem>
         <WrapItem>
          <HStack>
            <Icon as={MailIcon} boxSize={5} />
            <Text>Mail Icon</Text>
          </HStack>
        </WrapItem>
        <WrapItem>
          <HStack>
            <Icon as={CheckCircleIcon} boxSize={5} color="green.500" />
            <Text>Success Icon</Text>
          </HStack>
        </WrapItem>
        <WrapItem>
          <HStack>
            <Icon as={ExternalLinkIcon} boxSize={4} />
            <Text>External Link</Text>
          </HStack>
        </WrapItem>
      </Wrap>
    </Box>
  );
}