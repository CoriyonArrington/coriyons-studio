// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ShadowsShowcase from '../shadows-showcase';
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

describe('ShadowsShowcase Component', () => {
  it('should render the main "Shadows" heading', () => {
    renderWithChakra(<ShadowsShowcase />);
    expect(screen.getByRole('heading', { name: /Shadows/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about Chakra UI shadow scale', () => {
    renderWithChakra(<ShadowsShowcase />);
    expect(screen.getByText(/Chakra UI provides a default shadow scale/i)).toBeInTheDocument();
  });

  it('should render example boxes for different shadow styles', () => {
    renderWithChakra(<ShadowsShowcase />);
    expect(screen.getByText('shadow="sm"')).toBeInTheDocument();
    expect(screen.getByText('shadow="md"')).toBeInTheDocument();
    expect(screen.getByText('shadow="lg"')).toBeInTheDocument();
    expect(screen.getByText('shadow="xl"')).toBeInTheDocument();
    expect(screen.getByText('shadow="2xl"')).toBeInTheDocument();
    expect(screen.getByText('shadow="inner"')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<ShadowsShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});