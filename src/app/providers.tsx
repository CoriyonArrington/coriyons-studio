/*
 FINAL VERSION - Key Changes:
 - This component now correctly sets up both NextThemesProvider and ChakraProvider in the proper nested order.
 - The ChakraNextThemeSyncer component is included to keep both libraries synchronized.
 - This centralized approach resolves the hydration errors for good.
*/
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import chakraTheme from '@/src/lib/theme';
import { ChakraNextThemeSyncer } from '../components/ui/chakra-next-theme-syncer';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ChakraProvider theme={chakraTheme}>
        <ChakraNextThemeSyncer />
        {children}
      </ChakraProvider>
    </NextThemesProvider>
  );
}