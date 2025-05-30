// src/components/ui/spinner.tsx
"use client";

import React from 'react'; // Added React import
import { Spinner as ChakraSpinner, SpinnerProps as ChakraSpinnerProps } from '@chakra-ui/react';

export interface SpinnerProps extends ChakraSpinnerProps {
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ label = "Loading...", ...props }) => {
  // Explicitly add role="status" for loading indicators
  return <ChakraSpinner role="status" aria-label={label} {...props} />;
};

export default Spinner;