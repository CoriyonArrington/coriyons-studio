// src/components/common/__tests__/site-footer.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest'; // Added vi
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SiteFooter from '../site-footer';
import baseTheme from '@/src/lib/theme';

// Mock NextLink for testing purposes as it's used in SiteFooter
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string; }) => (
    // Simulating how ChakraLink might render with a mock href
    // Or more simply, just render children if href interaction isn't key to this specific test's assertion
    <span data-mock-href={href}>{children}</span>
  ),
}));


const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SiteFooter Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(<SiteFooter />, 'light');
    // Updated text to search for
    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(<SiteFooter />, 'dark');
    // Updated text to search for
    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});