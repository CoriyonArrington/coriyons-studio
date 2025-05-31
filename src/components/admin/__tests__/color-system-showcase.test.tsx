// src/components/admin/__tests__/color-system-showcase.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ColorSystemShowcase from '../color-system-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ColorSystemShowcase Component', () => {
  it('should render the main heading "Color System"', () => {
    renderWithChakra(<ColorSystemShowcase />);
    expect(screen.getByRole('heading', { name: /Color System/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about theme configuration', () => {
    renderWithChakra(<ColorSystemShowcase />);
    expect(screen.getByText(/Defined via CSS variables and mapped to Chakra theme tokens in/i)).toBeInTheDocument();
    expect(screen.getByText('src/lib/theme.ts')).toBeInTheDocument();
  });

  it('should render multiple color swatches, including key ones like "Primary" and "Background"', () => {
    renderWithChakra(<ColorSystemShowcase />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Destructive')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<ColorSystemShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});