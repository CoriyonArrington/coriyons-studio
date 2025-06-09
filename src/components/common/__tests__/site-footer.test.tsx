// ATTEMPT 1: Fixing unsafe assignment and unnecessary async functions.
// - Used `extendTheme` idiomatically to resolve the unsafe assignment.
// - Removed the 'async' keyword from two tests that do not use 'await'.

import React from 'react';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'; 
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SiteFooter from '../site-footer';
import baseTheme from '@/src/lib/theme';
import { getCategorizedFooterPages, type CategorizedFooterPages } from '@/src/lib/data/pages';

// Mock NextLink (already present and good)
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string; }) => (
    <span data-mock-href={href}>{children}</span>
  ),
}));

vi.mock('@/src/lib/data/pages', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/src/lib/data/pages')>();
  return {
    ...originalModule,
    getCategorizedFooterPages: vi.fn(), 
  };
});

const mockedGetCategorizedFooterPages = getCategorizedFooterPages as MockedFunction<typeof getCategorizedFooterPages>;

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  // FIX: Pass theme objects as separate arguments instead of using the spread operator.
  const theme = extendTheme(
    baseTheme,
    {
      config: { 
        initialColorMode: colorMode, 
        useSystemColorMode: false 
      },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SiteFooter Accessibility and Content', () => {
  const sampleFooterData: CategorizedFooterPages = {
    MAIN: [{ title: 'Home Test', href: '/' }, { title: 'About Test', href: '/about' }],
    RESOURCES: [{ title: 'Blog Test', href: '/blog' }],
    SUPPORT: [{ title: 'FAQ Test', href: '/faq' }],
    LEGAL: [{ title: 'Privacy Test', href: '/privacy-policy' }],
  };

  const emptyFooterData: CategorizedFooterPages = {
    MAIN: [],
    RESOURCES: [],
    SUPPORT: [], 
    LEGAL: [],
  };

  beforeEach(() => {
    mockedGetCategorizedFooterPages.mockResolvedValue(sampleFooterData);
  });

  it('should have no a11y violations in light mode and render dynamic links', async () => {
    const { container } = renderWithChakra(<SiteFooter footerPages={sampleFooterData} />, 'light');

    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();

    expect(await screen.findByText('Home Test')).toBeInTheDocument();
    expect(screen.getByText('Blog Test')).toBeInTheDocument();
    expect(screen.getByText('FAQ Test')).toBeInTheDocument();
    expect(screen.getByText('Privacy Test')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode and render dynamic links', async () => {
    const { container } = renderWithChakra(<SiteFooter footerPages={sampleFooterData} />, 'dark');

    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();
    expect(await screen.findByText('Home Test')).toBeInTheDocument();
    expect(screen.getByText('Privacy Test')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // FIX: Removed unnecessary 'async' keyword.
  it('should handle cases where some link categories are empty', () => {
    const partialData = {
      ...sampleFooterData,
      RESOURCES: [], 
    };
    renderWithChakra(<SiteFooter footerPages={partialData} />, 'light');

    expect(screen.getByText('Home Test')).toBeInTheDocument();
    expect(screen.queryByText('Blog Test')).not.toBeInTheDocument();
    expect(screen.getByText('FAQ Test')).toBeInTheDocument();
  });

  // FIX: Removed unnecessary 'async' keyword.
  it('should render support column with placeholder if no support links', () => {
    const noSupportData = {
        ...emptyFooterData,
        SUPPORT: [] 
    };
    renderWithChakra(<SiteFooter footerPages={noSupportData} />, 'light');
    expect(screen.getByText('Support')).toBeInTheDocument(); 
    expect(screen.getByText('(No support links yet)')).toBeInTheDocument();
  });
});