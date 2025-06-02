// src/components/common/markdown-renderer.tsx
// - Client component to ensure Chakra components within Markdown render correctly.
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
    Heading, Text, chakra, UnorderedList, OrderedList, ListItem, Code, Box 
} from '@chakra-ui/react'; // Ensure all Chakra components used are imported

// Define MarkdownComponents here as it uses Chakra components
const MarkdownChakraComponents = {
  h1: (props: any) => <Heading as="h1" size="xl" my={6} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" my={5} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" my={4} {...props} />,
  p: (props: any) => <Text my={3} lineHeight="tall" {...props} />,
  ul: (props: any) => <UnorderedList spacing={2} my={3} pl={5} {...props} />,
  ol: (props: any) => <OrderedList spacing={2} my={3} pl={5} {...props} />,
  li: (props: any) => <ListItem {...props} />,
  a: (props: any) => <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
  code: (props: any) => { 
    const {node, inline, className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      // You might want a proper syntax highlighter here for code blocks
      <Box as="pre" p={3} borderWidth="1px" my={4} borderRadius="md" overflowX="auto" bg="gray.50" _dark={{bg: "gray.700"}}>
        <code className={className} {...rest}>{children}</code>
      </Box>
    ) : (
      <Code p={1} fontSize="0.9em" {...rest}>{children}</Code>
    );
  },
  pre: (props: any) => {
    // Chakra's <Code> or <Box as="pre"> handles block code styling if used in `code` mapper above
    // This `pre` mapper might not be strictly necessary if `code` handles block contexts.
    // If used, ensure it renders children correctly.
    const {node, ...rest} = props;
    return <Box as="pre" p={3} borderWidth="1px" my={4} borderRadius="md" overflowX="auto" bg="gray.50" _dark={{bg: "gray.700"}} {...rest} />;
  }
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