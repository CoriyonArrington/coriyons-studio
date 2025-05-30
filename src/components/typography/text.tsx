// src/components/typography/text.tsx
"use client";

import React from 'react';
import { Text as ChakraText, TextProps as ChakraTextProps } from '@chakra-ui/react';

// Define potential 'as' prop values for semantic flexibility, if needed.
// Chakra's Text component is quite flexible with 'as' already.
type TextAsValues = 'p' | 'span' | 'div' | 'label' | 'caption' | 'strong' | 'em'; // Add more as needed

export interface TextProps extends Omit<ChakraTextProps, 'as'> {
  as?: TextAsValues; // Offer a more specific list or rely on Chakra's default 'as' typing
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <ChakraText {...props}>
      {children}
    </ChakraText>
  );
};

export default Text;