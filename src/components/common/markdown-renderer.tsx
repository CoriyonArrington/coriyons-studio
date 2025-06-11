// src/components/common/markdown-renderer.tsx
'use client';

import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Heading,
  chakra,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Box,
} from '@chakra-ui/react';

// The 'p' renderer has been completely removed to fix the parsing conflict.
// The 'ul' and 'li' renderers are simple wrappers for styling.
const MarkdownChakraComponents: Components = {
  h1: ({ node, ...props }) => <Heading as="h1" size="xl" my={6} {...props} />,
  h2: ({ node, ...props }) => <Heading as="h2" size="lg" my={5} {...props} />,
  h3: ({ node, ...props }) => <Heading as="h3" size="md" my={4} {...props} />,
  // 'p' is intentionally omitted to use the library's default.
  
  ul: ({ node, ...props }) => <UnorderedList spacing={2} my={3} pl={5} {...props} />,
  ol: ({ node, ...props }) => <OrderedList spacing={2} my={3} pl={5} {...props} />,
  li: ({ node, ...props }) => <ListItem {...props} />,

  a: ({ node, ...props }) => (
    <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />
  ),

  code: ({ node, className, children, ...props }) => (
      <Code 
        className={className} 
        p={1}
        fontSize="sm"
        {...props}
      >
        {children}
      </Code>
  ),

  pre: ({ node, children, ...props }) => (
    <Box 
      as="pre" 
      p={4} 
      my={4} 
      borderRadius="md" 
      bg="gray.50" 
      _dark={{ bg: "gray.900" }} 
      overflowX="auto" 
      {...props} 
    >
      {children}
    </Box>
  )
};

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown components={MarkdownChakraComponents} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}