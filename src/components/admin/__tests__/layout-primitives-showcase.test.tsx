// src/components/admin/__tests__/layout-primitives-showcase.test.tsx
// FINAL: Using refined NextLink mock.
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import LayoutPrimitivesShowcase from '../layout-primitives-showcase';
import baseTheme from '@/src/lib/theme';

// Refined NextLink Mock
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    passHref,
    legacyBehavior,
    ...rest 
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: unknown;
  }) => {
    if (passHref) {
      if (React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement, { href, ...rest });
      }
      return <>{children}</>;
    }
    return <a href={href} {...rest}>{children}</a>;
  },
}));

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('LayoutPrimitivesShowcase Component', () => {
  it('should render the main "Layout & Sectioning" heading', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', { name: /Layout & Sectioning/i, level: 2 })).toBeInTheDocument();
  });

  it('should render subheading for "Section Component"', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', { name: /^Section Component$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Default section content.')).toBeInTheDocument();
  });

  it('should render subheading for "ContentSection Component"', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', { name: /^ContentSection Component$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Default ContentSection/i})).toBeInTheDocument();
  });

  it('should display examples for Section component with different variants', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByText(/Default section content./i)).toBeInTheDocument();
    expect(screen.getByText(/Subtle section with centered text/i)).toBeInTheDocument();
    expect(screen.getByText(/Inverse section with right-aligned text/i)).toBeInTheDocument();
  });

  it('should display examples for ContentSection component with different configurations', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', {name: /Default ContentSection/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /Learn More/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Subtle & Customized ContentSection/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Inverse ContentSection with Children/i})).toBeInTheDocument();
    expect(screen.getByText(/This is custom child content/i)).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<LayoutPrimitivesShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});