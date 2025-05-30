// src/components/ui/chakra-next-theme-syncer.tsx
"use client";

import { useTheme } from 'next-themes';
import { useColorMode as useChakraColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

/**
 * This component ensures that Chakra UI's internal color mode is synchronized
 * with the theme managed by `next-themes`.
 */
export function ChakraNextThemeSyncer() {
  const { resolvedTheme } = useTheme(); // from next-themes
  const { setColorMode: setChakraColorMode, colorMode: chakraColorMode } = useChakraColorMode(); // from Chakra

  useEffect(() => {
    if (resolvedTheme) { // Only proceed if resolvedTheme has a value ('light' or 'dark')
      const targetChakraMode = resolvedTheme === 'dark' ? 'dark' : 'light';
      // Only call setChakraColorMode if the modes are actually different to avoid loops/unnecessary re-renders.
      if (chakraColorMode !== targetChakraMode) {
        setChakraColorMode(targetChakraMode);
      }
    }
  }, [resolvedTheme, setChakraColorMode, chakraColorMode]);

  return null; // This component does not render anything
}