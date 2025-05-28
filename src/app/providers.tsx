// src/app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from '@/src/lib/theme'; // Your custom theme object

export function Providers({ children }: { children: React.ReactNode }) {
  // Pass your custom theme object to the 'theme' prop of ChakraProvider
  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
}