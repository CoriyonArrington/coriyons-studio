// src/components/common/__tests__/markdown-renderer.test.tsx

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import MarkdownRenderer from '../markdown-renderer'; // Adjust path as needed

// Minimal base theme for testing (can be shared or simplified if needed)
const baseTheme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    'blue.500': 'blue',
    'gray.50': '#FAFAFA',
    'gray.700': '#4A5568',
    // Add other colors your components might rely on from theme
  },
  components: {
    // Add base styles for Heading, Text, List, Code etc. if your components
    // rely on specific theme variants or defaults that aren't universally applied.
  },
  styles: {
    global: {},
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
  },
  fontSizes: {
    '0.9em': '0.9em', // For inline code
    // Add other font sizes used by Heading, Text etc.
    xl: '2rem', // Corresponds to h1 size="xl"
    lg: '1.5rem', // Corresponds to h2 size="lg"
    md: '1.25rem', // Corresponds to h3 size="md"
  },
  lineHeights: {
    // For Text lineHeight="tall"
    tall: '1.7',
  },
  space: {
    // For my={N} and pl={N}
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
  },
  borderWidths: {
    // For borderWidth="1px"
    '1px': '1px',
  },
  radii: {
    // For borderRadius="md"
    md: '0.375rem',
  },
};

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('MarkdownRenderer', () => {
  it('should render heading 1 correctly', () => {
    renderWithChakra(<MarkdownRenderer content="# Hello World" />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello World' });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading 2 correctly', () => {
    renderWithChakra(<MarkdownRenderer content="## Sub Heading" />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Sub Heading' });
    expect(heading).toBeInTheDocument();
  });

  it('should render heading 3 correctly', () => {
    renderWithChakra(<MarkdownRenderer content="### Smaller Sub Heading" />);
    const heading = screen.getByRole('heading', { level: 3, name: 'Smaller Sub Heading' });
    expect(heading).toBeInTheDocument();
  });

  it('should render paragraph correctly', () => {
    renderWithChakra(<MarkdownRenderer content="This is a paragraph." />);
    const paragraph = screen.getByText('This is a paragraph.');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe('P');
  });

  it('should render unordered list correctly', () => {
    const markdown = `
* Item 1
* Item 2
    * Nested Item A
`;
    renderWithChakra(<MarkdownRenderer content={markdown} />);
    expect(screen.getByText('Item 1').tagName).toBe('LI');
    expect(screen.getByText('Item 2').tagName).toBe('LI');
    expect(screen.getByText('Nested Item A').tagName).toBe('LI');
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render ordered list correctly', () => {
    const markdown = `
1. First
2. Second
    1. Nested First
`;
    renderWithChakra(<MarkdownRenderer content={markdown} />);
    expect(screen.getByText('First').tagName).toBe('LI');
    expect(screen.getByText('Second').tagName).toBe('LI');
    expect(screen.getByText('Nested First').tagName).toBe('LI');
    const lists = screen.getAllByRole('list');
    expect(lists.some((list) => list.tagName === 'OL')).toBe(true);
  });

  it('should render link correctly', () => {
    renderWithChakra(<MarkdownRenderer content="[Google](https://google.com)" />);
    const link = screen.getByRole('link', { name: 'Google' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://google.com');
  });

  it('should render inline code correctly', () => {
    renderWithChakra(<MarkdownRenderer content="This is `inline code`." />);
    const codeElement = screen.getByText('inline code');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');
  });

  it('should render code block correctly', () => {
    const markdown = "```javascript\nconst foo = 'bar';\nconsole.log(foo);\n```";
    renderWithChakra(<MarkdownRenderer content={markdown} />);

    // Use a regex matcher to capture both lines regardless of exact whitespace
    const codeBlockRegex = /const foo = 'bar';\s*console\.log\(foo\);/;
    const codeBlockNode = screen.getByText((content) => codeBlockRegex.test(content));
    expect(codeBlockNode).toBeInTheDocument();

    const preElement = codeBlockNode.closest('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.querySelector('code.language-javascript')).toBeInTheDocument();
  });

  it('should render code block without language correctly', () => {
    const markdown = "```\nplain text block\n```";
    renderWithChakra(<MarkdownRenderer content={markdown} />);
    const codeBlockContent = "plain text block";
    expect(screen.getByText(codeBlockContent)).toBeInTheDocument();
    const preElement = screen.getByText(codeBlockContent).closest('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.querySelector('code')).toBeInTheDocument();
    expect(preElement?.querySelector('code')?.className).not.toContain('language-');
  });

  it('should use remarkGfm for strikethrough', () => {
    renderWithChakra(<MarkdownRenderer content="This is ~~strikethrough~~ text." />);
    const p = screen.getByText(/This is.*text\./);
    expect(p.querySelector('del')).toHaveTextContent('strikethrough');
  });

  describe('Accessibility', () => {
    it('should have no a11y violations with various markdown elements', async () => {
      const comprehensiveMarkdown = `
# Main Title
Some introductory text.

## Subtitle
* List item 1
* List item 2

[A link to somewhere](https://example.com)

\`\`\`js
function hello() {
  return "world";
}
\`\`\`

Paragraph with \`inline code\`.
      `;
      const { container } = renderWithChakra(<MarkdownRenderer content={comprehensiveMarkdown} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with empty content', async () => {
      const { container } = renderWithChakra(<MarkdownRenderer content="" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
