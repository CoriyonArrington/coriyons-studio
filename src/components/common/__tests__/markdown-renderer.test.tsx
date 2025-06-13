import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import MarkdownRenderer from '../markdown-renderer';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('MarkdownRenderer', () => {
  it('should render an unordered list with two separate items', () => {
    // This is the failing test case. We are changing the assertion logic.
    renderWithChakra(<MarkdownRenderer content={"* Item 1\n* Item 2"} />);

    // INSTEAD of getByText, we will get all elements with the role 'listitem' (which corresponds to <li>)
    const listItems = screen.getAllByRole('listitem');
    
    // NOW, we make robust assertions on the structure and content.
    // 1. Assert that exactly TWO list items were rendered.
    expect(listItems).toHaveLength(2);
    
    // 2. Assert the content of each item individually.
    expect(listItems[0]).toHaveTextContent('Item 1');
    expect(listItems[1]).toHaveTextContent('Item 2');
  });

  // --- Other tests remain for regression checking ---

  it('should render heading 1 correctly', () => {
    renderWithChakra(<MarkdownRenderer content="# Hello World" />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Hello World' });
    expect(heading).toBeInTheDocument();
  });

  it('should render a paragraph correctly', () => {
    renderWithChakra(<MarkdownRenderer content="This is a paragraph." />);
    const paragraph = screen.getByText('This is a paragraph.');
    expect(paragraph.tagName).toBe('P');
  });

  it('should render inline code correctly', () => {
    renderWithChakra(<MarkdownRenderer content="This is `inline code`." />);
    const codeElement = screen.getByText('inline code');
    expect(codeElement.tagName).toBe('CODE');
    expect(codeElement.closest('pre')).toBeNull();
  });

  it('should render a fenced code block correctly', () => {
    const markdown = "```js\nconst x = 1;\n```";
    renderWithChakra(<MarkdownRenderer content={markdown} />);
    const codeElement = screen.getByText('const x = 1;');
    expect(codeElement.closest('pre')).toBeInTheDocument();
  });

  it('should have no a11y violations with various markdown elements', async () => {
    const comprehensiveMarkdown = `
# Main Title
* List item 1
* List item 2

[A link to somewhere](https://example.com)
    `;
    const { container } = renderWithChakra(<MarkdownRenderer content={comprehensiveMarkdown} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});