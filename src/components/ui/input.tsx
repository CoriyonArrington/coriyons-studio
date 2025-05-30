// src/components/ui/input.tsx
"use client";

import React from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';

// When using React.forwardRef, the 'ref' is handled by forwardRef itself
// and should not typically be part of the component's direct props interface
// if those props are then spread to an underlying element that also accepts a ref.
// ChakraInputProps already includes the 'ref' type.
export type InputProps = ChakraInputProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <ChakraInput ref={ref} {...props} />;
  }
);

Input.displayName = "Input";

export default Input;