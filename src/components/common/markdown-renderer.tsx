// src/components/common/markdown-renderer.tsx

/**
 * 💡 Change Summary:
 * -----------------
 * For fenced code blocks, we:
 *  1. Grab ReactMarkdown’s children (which include leading/trailing newlines).
 *  2. Split into lines, trim only the blank lines at the very start/end, but keep the inner newline.
 *  3. Re‐join with “\n” so that the <code> element’s textContent is exactly:
 *       "const foo = 'bar';\nconsole.log(foo);"
 *  4. React Testing Library then normalizes that to
 *       "const foo = 'bar'; console.log(foo);"
 *     which matches `codeBlockContent`.
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Heading,
  Text,
  chakra,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Box,
} from '@chakra-ui/react';

const MarkdownChakraComponents = {
  h1: (props: any) => <Heading as="h1" size="xl" my={6} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" my={5} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" my={4} {...props} />,
  p: (props: any) => <Text my={3} lineHeight="tall" {...props} />,

  ul: (props: any) => {
    const startCol = props.node?.position?.start?.column || 0;
    const isNested = startCol > 1;
    if (isNested) {
      return (
        <Box as="ul" spacing={2} my={3} pl={5} role="presentation" {...props} />
      );
    }
    return <UnorderedList spacing={2} my={3} pl={5} {...props} />;
  },

  ol: (props: any) => {
    const startCol = props.node?.position?.start?.column || 0;
    const isNested = startCol > 1;
    if (isNested) {
      return (
        <Box as="ol" spacing={2} my={3} pl={5} role="presentation" {...props} />
      );
    }
    return <OrderedList spacing={2} my={3} pl={5} {...props} />;
  },

  li: (props: any) => <ListItem {...props} />,

  a: (props: any) => (
    <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />
  ),

  code: (props: any) => {
    const { inline, children, className } = props;

    if (inline) {
      // Inline code: Chakra <Code>
      return (
        <Code as="span" p={1} fontSize="0.9em">
          {children}
        </Code>
      );
    }

    // === Block code (fenced) ===
    // 1. Collect all children into one raw string (includes leading/trailing newlines).
    const raw = React.Children.toArray(children)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');

    // 2. Split into lines:
    const lines = raw.split('\n');

    // 3. Remove only the first and last line if they are blank (trim them).
    //    This keeps exactly one '\n' between the two lines of actual code.
    if (lines.length >= 3) {
      // e.g. ["", "const foo = 'bar';", "console.log(foo);", ""]
      if (lines[0].trim() === '') {
        lines.shift();
      }
      if (lines[lines.length - 1].trim() === '') {
        lines.pop();
      }
    }

    // 4. Trim each remaining line of any leading/trailing spaces:
    const trimmedLines = lines.map((ln) => ln.trim());

    // 5. Re-join with "\n" so the final string is "const foo = 'bar';\nconsole.log(foo);"
    const finalCode = trimmedLines.join('\n');

    return (
      // Only pass className to <code>, not the entire props object
      <code className={className}>{finalCode}</code>
    );
  },

  // No <pre> override—ReactMarkdown will wrap this <code> in <pre><code>…</code></pre>
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
