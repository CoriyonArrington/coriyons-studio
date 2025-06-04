// src/components/common/__tests__/site-footer.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'; 
import { render, screen /*, waitFor*/ } from '@testing-library/react'; // waitFor removed
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

// Mock the getCategorizedFooterPages function from the pages data module
vi.mock('@/src/lib/data/pages', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/src/lib/data/pages')>();
  return {
    ...originalModule,
    getCategorizedFooterPages: vi.fn(), // Create a Vitest mock function
  };
});

// Cast the mocked function for type safety with mockResolvedValue etc.
const mockedGetCategorizedFooterPages = getCategorizedFooterPages as MockedFunction<typeof getCategorizedFooterPages>;

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
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
    const SiteFooterComponent = await SiteFooter(); 
    const { container } = renderWithChakra(SiteFooterComponent, 'light');

    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();

    expect(await screen.findByText('Home Test')).toBeInTheDocument();
    expect(screen.getByText('Blog Test')).toBeInTheDocument();
    expect(screen.getByText('FAQ Test')).toBeInTheDocument();
    expect(screen.getByText('Privacy Test')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode and render dynamic links', async () => {
    const SiteFooterComponent = await SiteFooter(); 
    const { container } = renderWithChakra(SiteFooterComponent, 'dark');

    expect(screen.getByText(/coriyon's studio. all rights reserved./i)).toBeInTheDocument();
    expect(await screen.findByText('Home Test')).toBeInTheDocument();
    expect(screen.getByText('Privacy Test')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle cases where some link categories are empty', async () => {
    mockedGetCategorizedFooterPages.mockResolvedValue({
      ...sampleFooterData,
      RESOURCES: [], 
    });
    const SiteFooterComponent = await SiteFooter();
    renderWithChakra(SiteFooterComponent, 'light');

    expect(screen.getByText('Home Test')).toBeInTheDocument();
    expect(screen.queryByText('Blog Test')).not.toBeInTheDocument();
    expect(screen.getByText('FAQ Test')).toBeInTheDocument();
  });

  it('should render support column with placeholder if no support links', async () => {
    mockedGetCategorizedFooterPages.mockResolvedValue({
        ...emptyFooterData,
        SUPPORT: [] 
    });
    const SiteFooterComponent = await SiteFooter();
    renderWithChakra(SiteFooterComponent, 'light');
    expect(screen.getByText('Support')).toBeInTheDocument(); 
    expect(screen.getByText('(No support links yet)')).toBeInTheDocument();
  });
});