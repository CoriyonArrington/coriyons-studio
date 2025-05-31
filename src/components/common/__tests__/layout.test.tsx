// src/components/common/__tests__/layout.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest'; // Removed 'vi'
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Layout from '../layout';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Layout Component (common/layout.tsx)', () => {
  const childText = 'Main Content Area';

  it('should render its children correctly', () => {
    renderWithChakra(
      <Layout>
        <div>{childText}</div>
      </Layout>
    );
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('should have its main structural elements (Flex and Box as main)', () => {
    const { container } = renderWithChakra(
      <Layout>
        <div>{childText}</div>
      </Layout>
    );
    const flexElement = container.firstChild as HTMLElement;
    expect(flexElement).toBeInTheDocument(); // Check if the root Flex element exists
    // expect(flexElement.tagName.toLowerCase()).toBe('div'); // Chakra Flex renders as div
    // Avoid checking for specific Chakra classes like 'chakra-stack' or 'css-b95f0i'
    // Instead, verify its role or that it contains the main content correctly.

    const mainElement = screen.getByRole('main'); // <Box as="main">
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toContainElement(screen.getByText(childText));
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <Layout>
        <div>{childText}</div>
      </Layout>,
      'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(
      <Layout>
        <div>{childText}</div>
      </Layout>,
      'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});