// src/components/common/__tests__/prev-next-navigation.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import PrevNextNavigation, { type NavLinkInfo } from '../prev-next-navigation'; // Adjust path as needed

// Minimal base theme for testing
const baseTheme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    border: 'gray.200',
    foreground: 'black',
    'muted.foreground': 'gray.500',
  },
  components: {}, // Add any essential component styles if needed
  styles: {
    global: {}, // Add global styles if components depend on them
  },
  fonts: { // Add default fonts if needed
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
  },
  fontSizes: {
    xs: '0.75rem',
    md: '1rem',
    lg: '1.125rem',
  },
  space: { // Add spacing tokens if needed
    1: '0.25rem',
    2: '0.5rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    16: '4rem',
  },
  sizes: { // Add size tokens if needed
    container: {
      lg: '1024px',
    }
  }
};

// Mock NextLink (consistent with your example)
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    // If children is a single valid React element (like ChakraLink), clone it with the href.
    if (React.isValidElement(children) && React.Children.count(children) === 1) {
      return React.cloneElement(children as React.ReactElement, { href, ...props });
    }
    // Otherwise, wrap children in an anchor tag.
    return <a href={href} {...props}>{children}</a>;
  },
}));

// ───────────────────────────────────────────────────────────────────────────────
// Replace renderWithChakra with this “optional” version:
const renderWithChakra = (
  ui: React.ReactElement,
  options?: { skipChakra?: boolean; colorMode?: 'light' | 'dark' }
) => {
  // If skipChakra=true, render the UI directly (no ChakraProvider around it).
  if (options?.skipChakra) {
    return render(ui);
  }

  // Otherwise, wrap in ChakraProvider
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: options?.colorMode ?? 'light' },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};
// ───────────────────────────────────────────────────────────────────────────────

const mockPrevPage: NavLinkInfo = {
  slug: 'previous-article',
  title: 'Previous Article Title',
  categoryLabel: 'Tutorials',
};

const mockNextPage: NavLinkInfo = {
  slug: 'next-article',
  title: 'Next Article Title',
  categoryLabel: 'Guides',
};

describe('PrevNextNavigation', () => {
  it('should render null if no previous or next page is provided', () => {
    // ◀ For this one test, we set skipChakra: true so that NOTHING is rendered at all.
    const { container } = renderWithChakra(<PrevNextNavigation />, { skipChakra: true });
    expect(container.firstChild).toBeNull();
  });

  it('should render only previous page link if only previousPage is provided', () => {
    // Wrapped normally in ChakraProvider (skipChakra defaults to false)
    renderWithChakra(<PrevNextNavigation previousPage={mockPrevPage} />);
    expect(screen.getByText(mockPrevPage.categoryLabel)).toBeInTheDocument();
    expect(screen.getByText(mockPrevPage.slug.replace(/-/g, ' '))).toBeInTheDocument();
    expect(screen.queryByText(mockNextPage.categoryLabel)).not.toBeInTheDocument();
  });

  it('should render only next page link if only nextPage is provided', () => {
    renderWithChakra(<PrevNextNavigation nextPage={mockNextPage} />);
    expect(screen.getByText(mockNextPage.categoryLabel)).toBeInTheDocument();
    expect(screen.getByText(mockNextPage.slug.replace(/-/g, ' '))).toBeInTheDocument();
    expect(screen.queryByText(mockPrevPage.categoryLabel)).not.toBeInTheDocument();
  });

  it('should render both page links if both are provided', () => {
    renderWithChakra(<PrevNextNavigation previousPage={mockPrevPage} nextPage={mockNextPage} />);
    expect(screen.getByText(mockPrevPage.categoryLabel)).toBeInTheDocument();
    expect(screen.getByText(mockPrevPage.slug.replace(/-/g, ' '))).toBeInTheDocument();
    expect(screen.getByText(mockNextPage.categoryLabel)).toBeInTheDocument();
    expect(screen.getByText(mockNextPage.slug.replace(/-/g, ' '))).toBeInTheDocument();
  });

  it('should construct href correctly with default basePath', () => {
    renderWithChakra(<PrevNextNavigation previousPage={mockPrevPage} nextPage={mockNextPage} />);
    const prevLink = screen.getByText(mockPrevPage.slug.replace(/-/g, ' ')).closest('a');
    const nextLink = screen.getByText(mockNextPage.slug.replace(/-/g, ' ')).closest('a');
    expect(prevLink).toHaveAttribute('href', `/previous-article`);
    expect(nextLink).toHaveAttribute('href', `/next-article`);
  });

  it('should construct href correctly with custom basePath', () => {
    renderWithChakra(
      <PrevNextNavigation previousPage={mockPrevPage} nextPage={mockNextPage} basePath="/blog" />
    );
    const prevLink = screen.getByText(mockPrevPage.slug.replace(/-/g, ' ')).closest('a');
    const nextLink = screen.getByText(mockNextPage.slug.replace(/-/g, ' ')).closest('a');
    expect(prevLink).toHaveAttribute('href', `/blog/previous-article`);
    expect(nextLink).toHaveAttribute('href', `/blog/next-article`);
  });

  it('should construct href correctly with custom basePath ending with a slash', () => {
    renderWithChakra(
      <PrevNextNavigation previousPage={mockPrevPage} nextPage={mockNextPage} basePath="/blog/" />
    );
    const prevLink = screen.getByText(mockPrevPage.slug.replace(/-/g, ' ')).closest('a');
    const nextLink = screen.getByText(mockNextPage.slug.replace(/-/g, ' ')).closest('a');
    expect(prevLink).toHaveAttribute('href', `/blog/previous-article`);
    expect(nextLink).toHaveAttribute('href', `/blog/next-article`);
  });

  it('should replace multiple slashes in href', () => {
    const pageWithSlashes: NavLinkInfo = {
      slug: '/some//path',
      title: 'Slashes Path',
      categoryLabel: 'Test',
    };
    renderWithChakra(
      <PrevNextNavigation previousPage={pageWithSlashes} basePath="//base/" />
    );
    // The regex in the component replaces multiple slashes with one AFTER joining base and slug.
    // So `//base/` + `/some//path` -> `//base//some//path` -> `/base/some/path`
    const prevLink = screen.getByText(pageWithSlashes.slug.replace(/-/g, ' ')).closest('a');
    expect(prevLink).toHaveAttribute('href', `/base/some/path`);
  });

  describe('Accessibility', () => {
    it('should have no a11y violations with both links', async () => {
      const { container } = renderWithChakra(
        <PrevNextNavigation previousPage={mockPrevPage} nextPage={mockNextPage} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with only previous link', async () => {
      const { container } = renderWithChakra(<PrevNextNavigation previousPage={mockPrevPage} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with only next link', async () => {
      const { container } = renderWithChakra(<PrevNextNavigation nextPage={mockNextPage} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
