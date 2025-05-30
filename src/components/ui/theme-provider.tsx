// src/components/ui/theme-provider.tsx
"use client";

import React from 'react'; // Added React import
import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "@/src/lib/theme";
import {
  ColorModeProvider as NextThemesProviderInternal,
  type ColorModeProviderProps as NextThemesProviderInternalProps,
} from "./color-mode";
import { ChakraNextThemeSyncer } from "./chakra-next-theme-syncer";

interface AppThemeProviderProps extends NextThemesProviderInternalProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...restNextThemesProps }: AppThemeProviderProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <NextThemesProviderInternal {...restNextThemesProps}>
        <ChakraNextThemeSyncer />
        {children}
      </NextThemesProviderInternal>
    </ChakraProvider>
  );
}