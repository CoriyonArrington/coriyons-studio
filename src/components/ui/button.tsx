// src/components/ui/button.tsx
"use client"; // Enables this component to run in the browser (required for Chakra interactivity)

import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

// 🎯 Create a new type alias for our custom button props
// This allows future extension without losing Chakra's built-in typings
export type ButtonProps = ChakraButtonProps;

// ✅ Component definition using React.FC for children support
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    // 🧩 Base Chakra Button component
    // Automatically inherits theme styles (colors, radius, etc.)
    <ChakraButton {...props}>
      {/* Content inside the button (text, icons, etc.) */}
      {children}
    </ChakraButton>
  );
};

export default Button;
