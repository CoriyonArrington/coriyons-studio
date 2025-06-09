// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SpacingLayoutShowcase from '../spacing-layout-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { initialColorMode: 'light', useSystemColorMode: false },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SpacingLayoutShowcase Component', () => {
  it('should render the main "Spacing & Layout" heading', () => {
    renderWithChakra(<SpacingLayoutShowcase />);
    expect(screen.getByRole('heading', { name: /Spacing & Layout/i, level: 2 })).toBeInTheDocument();
  });

  it('should render subheadings for Padding, Margin, and Gap examples', () => {
    renderWithChakra(<SpacingLayoutShowcase />);
    expect(screen.getByRole('heading', { name: /Padding Example/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Margin Example/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Gap Example \(SimpleGrid\)/i, level: 3 })).toBeInTheDocument();
  });

  it('should render example elements for padding', () => {
    renderWithChakra(<SpacingLayoutShowcase />);
    expect(screen.getByText('p="1"')).toBeInTheDocument();
    expect(screen.getByText('p="8"')).toBeInTheDocument();
  });

  it('should render example elements for margin', () => {
    renderWithChakra(<SpacingLayoutShowcase />);
    expect(screen.getByText('No margin')).toBeInTheDocument();
    expect(screen.getByText('mt="4"')).toBeInTheDocument();
  });

  it('should render example elements for gap with SimpleGrid', () => {
    renderWithChakra(<SpacingLayoutShowcase />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<SpacingLayoutShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});