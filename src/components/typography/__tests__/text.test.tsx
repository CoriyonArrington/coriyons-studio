// src/components/typography/__tests__/text.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Text from '../text'; // Adjust path as necessary
import baseTheme from '@/src/lib/theme'; // Your base theme

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Text Component', () => {
  it('should render children correctly', () => {
    const textContent = 'This is a paragraph of text.';
    renderWithChakra(<Text>{textContent}</Text>);
    expect(screen.getByText(textContent)).toBeInTheDocument();
  });

  it('should render as a p tag by default (Chakra Text default)', () => {
    const textContent = 'Default paragraph';
    renderWithChakra(<Text>{textContent}</Text>);
    // Chakra's Text defaults to <p> unless 'as' is specified
    const element = screen.getByText(textContent);
    expect(element.tagName).toBe('P');
  });

  it('should render as a span when as="span" is provided', () => {
    const textContent = 'Span text';
    renderWithChakra(<Text as="span">{textContent}</Text>);
    const element = screen.getByText(textContent);
    expect(element.tagName).toBe('SPAN');
  });

  it('should apply Chakra UI style props (e.g., fontSize)', () => {
    const textContent = 'Small text';
    renderWithChakra(<Text fontSize="sm">{textContent}</Text>);
    // Visual verification for actual size would be via storybook/manual check or visual regression.
    // Test confirms component accepts prop and renders.
    expect(screen.getByText(textContent)).toBeInTheDocument();
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <Text>Accessibility test text.</Text>,
      'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode with a different element', async () => {
    const { container } = renderWithChakra(
      <Text as="div">Div text for a11y check.</Text>,
      'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});