// src/components/common/__tests__/site-footer.test.tsx
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

// NOTE: This mock is not used by the SiteFooter component as it receives props directly.
// It is left here in case it's intended for other tests or future refactors.
vi.mock('@/src/lib/data/pages', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/src/lib/data/pages')>();
  return {
    ...originalModule,
    getCategorizedFooterPages: vi.fn(), 
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

  // Although the mock is set, the component under test uses props, not this function.
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

  it('should handle cases where some link categories are empty', async () => {
    const partialData = {
      ...sampleFooterData,
      RESOURCES: [], 
    };
    renderWithChakra(<SiteFooter footerPages={partialData} />, 'light');

    expect(screen.getByText('Home Test')).toBeInTheDocument();
    expect(screen.queryByText('Blog Test')).not.toBeInTheDocument();
    expect(screen.getByText('FAQ Test')).toBeInTheDocument();
  });

  it('should render support column with placeholder if no support links', async () => {
    const noSupportData = {
        ...emptyFooterData,
        SUPPORT: [] 
    };
    renderWithChakra(<SiteFooter footerPages={noSupportData} />, 'light');
    expect(screen.getByText('Support')).toBeInTheDocument(); 
    expect(screen.getByText('(No support links yet)')).toBeInTheDocument();
  });
});