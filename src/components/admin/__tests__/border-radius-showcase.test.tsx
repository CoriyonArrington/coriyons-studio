// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import BorderRadiusShowcase from '../border-radius-showcase';
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

describe('BorderRadiusShowcase Component', () => {
  it('should render the main "Border Radius" heading', () => {
    renderWithChakra(<BorderRadiusShowcase />);
    expect(screen.getByRole('heading', { name: /Border Radius/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about theme configuration', () => {
    renderWithChakra(<BorderRadiusShowcase />);
    expect(screen.getByText(/Defined in/i)).toBeInTheDocument();
    expect(screen.getByText('src/lib/theme.ts')).toBeInTheDocument();
    expect(screen.getByText('--radius')).toBeInTheDocument();
  });

  it('should render example boxes for different border radii', () => {
    renderWithChakra(<BorderRadiusShowcase />);
    expect(screen.getByText('sm')).toBeInTheDocument();
    expect(screen.getByText('md')).toBeInTheDocument();
    expect(screen.getByText('lg')).toBeInTheDocument();
    expect(screen.getByText('full')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<BorderRadiusShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});