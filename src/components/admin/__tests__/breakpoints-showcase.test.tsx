// src/components/admin/__tests__/breakpoints-showcase.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import BreakpointsShowcase from '../breakpoints-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('BreakpointsShowcase Component', () => {
  it('should render the main "Breakpoints" heading', () => {
    renderWithChakra(<BreakpointsShowcase />);
    expect(screen.getByRole('heading', { name: /Breakpoints/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about testing by resizing', () => {
    renderWithChakra(<BreakpointsShowcase />);
    expect(screen.getByText(/Test by resizing your browser window/i)).toBeInTheDocument();
  });

  it('should render the breakpoint key and base demonstration box', () => {
    renderWithChakra(<BreakpointsShowcase />);
    expect(screen.getByRole('heading', { name: /Breakpoint Key/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/Base \(0px\+\)/i)).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<BreakpointsShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});