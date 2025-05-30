// src/components/ui/provider.tsx
"use client"

import { ChakraProvider } from "@chakra-ui/react"
import chakraTheme from "@/src/lib/theme";
import {
  ColorModeProvider as NextThemesProviderInternal, // Aliased for clarity
  type ColorModeProviderProps as NextThemesProviderInternalProps,
} from "./color-mode"; // This file exports next-themes' ThemeProvider as ColorModeProvider
import { ChakraNextThemeSyncer } from "../chakra-next-theme-syncer";

// Define props for your main Provider, ensuring it accepts children
// and the props required by next-themes' ThemeProvider.
interface AppProviderProps extends NextThemesProviderInternalProps {
  children: React.ReactNode;
}

export function Provider({ children, ...restNextThemesProps }: AppProviderProps) {
  return (
    // ChakraProvider is the outermost provider for Chakra UI context and theme
    <ChakraProvider theme={chakraTheme}>
      {/* NextThemesProviderInternal (next-themes' ThemeProvider) wraps both the syncer and app children */}
      {/* It receives props like 'attribute', 'defaultTheme', etc. */}
      <NextThemesProviderInternal {...restNextThemesProps}>
        <ChakraNextThemeSyncer /> {/* Syncer is now a child of both providers */}
        {children}                {/* Your application content */}
      </NextThemesProviderInternal>
    </ChakraProvider>
  );
}