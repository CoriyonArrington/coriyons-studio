// src/components/typography/inline-code.tsx
"use client"; // Add if it's a client component, often good for UI pieces

import { Code, CodeProps } from "@chakra-ui/react"; // Import Chakra's Code and its props
import * as React from "react";

export interface TypographyInlineCodeProps extends CodeProps {
  // children is already part of CodeProps if it extends HTMLAttributes
  children: React.ReactNode;
}

export function TypographyInlineCode({
  children,
  ...props // Pass any other CodeProps
}: TypographyInlineCodeProps) {
  return (
    // Use Chakra's Code component.
    // Default styling can be applied here (like px, py, borderRadius)
    // or globally by styling the Code component in your src/lib/theme.ts
    <Code
      px="0.4em" // Example padding, adjust as needed
      py="0.15em" // Example padding
      borderRadius="md"
      fontWeight="semibold" // Matching your previous Tailwind style
      fontSize="sm"         // Matching your previous Tailwind style
      {...props}          // Spread any additional CodeProps
    >
      {children}
    </Code>
  );
}