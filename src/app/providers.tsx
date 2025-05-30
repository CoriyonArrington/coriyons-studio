// src/app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "@/src/lib/theme"; // Ensure this path is correct
import { ChakraNextThemeSyncer
  
 } from "../components/ui/chakra-next-theme-syncer";
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <ChakraNextThemeSyncer />
      {children} {/* Your application content */}
    </ChakraProvider>
  );
}