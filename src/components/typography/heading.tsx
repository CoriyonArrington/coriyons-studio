// src/components/typography/heading.tsx
"use client";

import React from 'react';
import { Heading as ChakraHeading, HeadingProps as ChakraHeadingProps } from '@chakra-ui/react';

// Define the HTML elements that can be used for the 'as' prop for semantic headings
type HeadingAsValues = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export interface HeadingProps extends Omit<ChakraHeadingProps, 'as'> {
  as?: HeadingAsValues; // Override 'as' to be more specific for semantic HTML
  children: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ children, as = 'h2', ...props }) => {
  // Default 'as' to 'h2' if not provided, a common practice.
  // You can adjust or remove the default 'as' prop if you prefer it to be always explicitly set.
  return (
    <ChakraHeading as={as} {...props}>
      {children}
    </ChakraHeading>
  );
};

export default Heading;