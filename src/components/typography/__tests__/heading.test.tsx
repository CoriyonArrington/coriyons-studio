// src/components/typography/__tests__/heading.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Heading from '../heading'; // Adjust path as necessary
import baseTheme from '@/src/lib/theme'; // Your base theme

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Heading Component', () => {
  it('should render children correctly', () => {
    const textContent = 'This is a heading';
    renderWithChakra(<Heading>{textContent}</Heading>);
    expect(screen.getByText(textContent)).toBeInTheDocument();
  });

  it('should render as h1 when as="h1" is provided', () => {
    const textContent = 'H1 Heading';
    renderWithChakra(<Heading as="h1">{textContent}</Heading>);
    const headingElement = screen.getByRole('heading', { name: textContent, level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H1');
  });

  it('should render as h2 by default', () => {
    const textContent = 'Default H2 Heading';
    renderWithChakra(<Heading>{textContent}</Heading>);
    const headingElement = screen.getByRole('heading', { name: textContent, level: 2 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
  });

  it('should apply Chakra UI style props (e.g., size)', () => {
    const textContent = 'Large Heading';
    // Note: Chakra's 'size' prop for Heading might map to specific styles/classNames
    // We'll check for the content, and visual regression tests would confirm actual styling.
    // Here, we're primarily ensuring the component renders and accepts the prop.
    renderWithChakra(<Heading size="xl">{textContent}</Heading>);
    expect(screen.getByText(textContent)).toBeInTheDocument();
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <Heading as="h3" size="lg">Accessibility Test Heading</Heading>,
      'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(
      <Heading as="h4">Another Test Heading</Heading>,
      'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});