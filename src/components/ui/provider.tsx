// src/components/ui/provider.tsx
"use client"

import { ChakraProvider } from "@chakra-ui/react" // Removed defaultSystem
import chakraTheme from "@/src/lib/theme"; // Import your custom theme
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    // Use the 'theme' prop with your custom theme
    <ChakraProvider theme={chakraTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}