// src/components/layout/site-footer.test.tsx
import React from 'react'; // Ensure React is imported
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SiteFooter from '../site-footer';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SiteFooter Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    // If act warnings persist for NextLink, wrapping render might be an option, but often not necessary if test passes
    // await act(async () => {
    //   renderWithChakra(<SiteFooter />, 'light');
    // });
    const { container } = renderWithChakra(<SiteFooter />, 'light');
    expect(screen.getByText(/your awesome project/i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    // await act(async () => {
    //  renderWithChakra(<SiteFooter />, 'dark');
    // });
    const { container } = renderWithChakra(<SiteFooter />, 'dark');
    expect(screen.getByText(/your awesome project/i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});