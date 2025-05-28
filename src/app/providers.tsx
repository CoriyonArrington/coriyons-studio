// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
// Assuming chakraTheme from '@/lib/theme' is correctly typed as SystemContext
import chakraTheme from '@/src/lib/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  // Use the 'value' prop as defined in ChakraProviderProps
  return <ChakraProvider value={chakraTheme}>{children}</ChakraProvider>
}