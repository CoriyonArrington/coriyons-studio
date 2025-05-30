// src/components/ui/color-mode.tsx
"use client";

// Removed chakra, IconButton, Skeleton imports as they were for the button
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import * as React from "react";
// Removed LuMoon, LuSun imports as they were for the icon

export type ColorModeProviderProps = NextThemesProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  // Pass NextThemesProviderProps to next-themes' ThemeProvider.
  // Props like 'attribute="class"' and 'defaultTheme' will be passed via ThemeProvider component.
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode | undefined; // Resolved theme from next-themes
  setColorMode: (colorMode: ColorMode) => void; // To set the theme directly
  toggleColorMode: () => void; // To toggle between light/dark
  // You can add other values from next-themes' useTheme if needed, like 'systemTheme', 'themes', etc.
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme(); // `theme` is the active theme, `resolvedTheme` is what's actually applied (e.g. system preference resolved to light/dark)
  
  const colorMode = resolvedTheme as ColorMode | undefined;

  const toggleColorMode = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const setColorModeHandler = React.useCallback((newMode: ColorMode) => {
    setTheme(newMode);
  }, [setTheme]);

  return {
    colorMode,
    setColorMode: setColorModeHandler,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode(); // Uses the custom hook above

  // Handle initial undefined state (before client has mounted and resolved theme)
  if (colorMode === undefined) {
    // Attempt to use system preference as a fallback on the client before hydration, if desired.
    // Note: `window.matchMedia` is only available on the client.
    // next-themes typically handles this initial resolution, so this could be simplified
    // if next-themes' resolvedTheme already correctly reflects system preference after mounting.
    if (typeof window !== "undefined") {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light;
    }
    // Default to light if window is not available (SSR or pre-hydration)
    // or if no system preference can be determined yet.
    return light; 
  }
  return colorMode === "dark" ? dark : light;
}

// Removed ColorModeIcon, ColorModeButton, and ClientOnly components