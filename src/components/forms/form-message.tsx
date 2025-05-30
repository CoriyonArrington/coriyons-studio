// components/form-message.tsx

"use client";

import React from 'react'; // Added this line
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  BoxProps, // For passing common Chakra style props
} from '@chakra-ui/react';

// Extended Message type to optionally include a title for all message types
export type Message =
  | { success: string; title?: string }
  | { error: string; title?: string }
  | { message: string; title?: string }; // Neutral message

// Allow passing common Chakra style props like 'mt', 'mb', 'w', etc.
interface FormMessageProps extends BoxProps {
  message: Message;
}

export function FormMessage({ message, ...rest }: FormMessageProps) {
  if ("success" in message) {
    return (
      <Alert status="success" borderRadius="md" variant="subtle" {...rest}>
        <AlertIcon />
        {message.title && <AlertTitle mr={2} fontSize="sm">{message.title}</AlertTitle>}
        <AlertDescription fontSize="sm">{message.success}</AlertDescription>
      </Alert>
    );
  }

  if ("error" in message) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle" {...rest}>
        <AlertIcon />
        {message.title && <AlertTitle mr={2} fontSize="sm">{message.title}</AlertTitle>}
        <AlertDescription fontSize="sm">{message.error}</AlertDescription>
      </Alert>
    );
  }

  if ("message" in message) {
    // For a neutral message, 'info' status is often appropriate, or use a simple Box/Text
    return (
      <Alert status="info" borderRadius="md" variant="subtle" {...rest}>
        <AlertIcon />
        {message.title && <AlertTitle mr={2} fontSize="sm">{message.title}</AlertTitle>}
        <AlertDescription fontSize="sm">{message.message}</AlertDescription>
      </Alert>
    );
  }

  return null;
}