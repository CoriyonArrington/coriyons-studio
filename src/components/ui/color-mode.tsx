// src/components/ui/color-mode.tsx
"use client"

import type { IconButtonProps, HTMLChakraProps } from "@chakra-ui/react"
// Removed Box from this import as it was unused
import { chakra, IconButton, Skeleton } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

// Simple ClientOnly component definition
const ClientOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
};

export type ColorModeProviderProps = NextThemesProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode | undefined;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
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
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  if (colorMode === undefined) {
    if (typeof window !== "undefined") {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light;
    }
    return light;
  }
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  if (!colorMode) return null;
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

type ColorModeButtonInternalProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonInternalProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  const fallback = <Skeleton boxSize="8" borderRadius="md" />;

  return (
    <ClientOnly fallback={fallback}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          svg: {
            width: "1.25rem",
            height: "1.25rem",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
});

export const LightMode = React.forwardRef<HTMLSpanElement, HTMLChakraProps<'span'>>(
  function LightMode(props, ref) {
    return (
      <chakra.span
        color="var(--foreground)"
        display="contents"
        data-theme="light"
        className="chakra-theme-light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, HTMLChakraProps<'span'>>(
  function DarkMode(props, ref) {
    return (
      <chakra.span
        color="var(--foreground)"
        display="contents"
        data-theme="dark"
        className="chakra-theme-dark"
        ref={ref}
        {...props}
      />
    )
  },
)