// src/components/ui/card.tsx
"use client";

import React from 'react';
import {
  Card as ChakraUICard, // Aliased to avoid potential naming conflicts if Card was also imported directly
  CardProps as ChakraCardProps,
  CardHeader as ChakraCardHeader, // Aliased
  CardHeaderProps as ChakraCardHeaderProps,
  CardBody as ChakraCardBody,     // Aliased
  CardBodyProps as ChakraCardBodyProps,
  CardFooter as ChakraCardFooter, // Aliased
  CardFooterProps as ChakraCardFooterProps,
  Heading, // For CardHeader convenience
  Text    // For CardBody/Footer convenience
} from '@chakra-ui/react';

// Props type alias (correctly fixed the empty interface error)
export type UICardProps = ChakraCardProps;

const UICard: React.FC<UICardProps> = ({ children, ...props }) => {
  return <ChakraUICard {...props}>{children}</ChakraUICard>;
};

// Props type alias
export type UICardHeaderProps = ChakraCardHeaderProps;

const UICardHeader: React.FC<UICardHeaderProps> = ({ children, ...props }) => {
  return <ChakraCardHeader {...props}>{children}</ChakraCardHeader>;
};

// Props type alias
export type UICardBodyProps = ChakraCardBodyProps;

const UICardBody: React.FC<UICardBodyProps> = ({ children, ...props }) => {
  return <ChakraCardBody {...props}>{children}</ChakraCardBody>;
};

// Props type alias
export type UICardFooterProps = ChakraCardFooterProps;

const UICardFooter: React.FC<UICardFooterProps> = ({ children, ...props }) => {
  return <ChakraCardFooter {...props}>{children}</ChakraCardFooter>;
};

// Re-exporting Chakra's Heading and Text aliased for specific use within cards if desired,
// or consumers can import them directly from Chakra or your typography components.
export { UICard, UICardHeader, UICardBody, UICardFooter, Heading as UICardHeading, Text as UICardText };