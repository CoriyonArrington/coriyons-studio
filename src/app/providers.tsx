// src/app/providers.tsx
// Attempt #9: Revert to a simple client-side provider.

"use client";

import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "@/src/lib/theme";
import { ChakraNextThemeSyncer } from "../components/ui/chakra-next-theme-syncer";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <ChakraNextThemeSyncer />
      {children}
    </ChakraProvider>
  );
}