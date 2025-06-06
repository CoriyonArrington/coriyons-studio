// src/components/ui/card.tsx
"use client";

import React from 'react';
import {
  Card as ChakraUICard,               // Chakra UI’s Card
  CardProps as ChakraCardProps,
  CardHeader as ChakraCardHeader,
  CardHeaderProps as ChakraCardHeaderProps,
  CardBody as ChakraCardBody,
  CardBodyProps as ChakraCardBodyProps,
  CardFooter as ChakraCardFooter,
  CardFooterProps as ChakraCardFooterProps,
  Heading,
  Text,
} from '@chakra-ui/react';

// Re-exported types
export type UICardProps = ChakraCardProps;
export type UICardHeaderProps = ChakraCardHeaderProps;
export type UICardBodyProps = ChakraCardBodyProps;
export type UICardFooterProps = ChakraCardFooterProps;

// Component wrappers around Chakra’s primitives
export const UICard: React.FC<UICardProps> = ({ children, ...props }) => {
  return <ChakraUICard {...props}>{children}</ChakraUICard>;
};

export const UICardHeader: React.FC<UICardHeaderProps> = ({ children, ...props }) => {
  return <ChakraCardHeader {...props}>{children}</ChakraCardHeader>;
};

export const UICardBody: React.FC<UICardBodyProps> = ({ children, ...props }) => {
  return <ChakraCardBody {...props}>{children}</ChakraCardBody>;
};

export const UICardFooter: React.FC<UICardFooterProps> = ({ children, ...props }) => {
  return <ChakraCardFooter {...props}>{children}</ChakraCardFooter>;
};

// Aliases for consistency
export { Heading as UICardHeading, Text as UICardText };
