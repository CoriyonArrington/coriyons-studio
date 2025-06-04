// src/components/ui/external-link-icon.tsx
'use client'; // Mark as a client component

import { Icon } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export default function ExternalLinkIcon() {
  // You can customize props here if needed, or pass them down
  return <Icon as={ArrowForwardIcon} boxSize={3} verticalAlign="middle" ml={1} />;
}