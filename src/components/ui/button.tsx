// src/components/ui/button.tsx
"use client";

import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

// Changed from interface to type alias
export type ButtonProps = ChakraButtonProps;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ChakraButton {...props}>
      {children}
    </ChakraButton>
  );
};

export default Button;