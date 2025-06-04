// src/components/admin/__tests__/layout-primitives-showcase.test.tsx
// FINAL: Using refined NextLink mock.
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import LayoutPrimitivesShowcase from '../layout-primitives-showcase';
import baseTheme from '@/src/lib/theme';

// MODIFIED NextLink Mock:
// This version assumes that if 'children' is a React element,
// it should handle the 'href' and render the anchor tag itself.
// This prevents the mock from wrapping an element child (like a Button)
// with an additional <a> tag, thus avoiding the nested <a> warning.
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    passHref, // Prop is still declared as it's part of NextLink's API
    legacyBehavior, // Prop is still declared
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: unknown;
  }) => {
    if (React.isValidElement(children)) {
      // If the child is a React element (e.g., a Chakra Button or custom Button),
      // clone it and pass the href. This assumes the child component
      // (e.g., <Button as="a"> or a custom button that renders <a> with href)
      // will correctly render the anchor tag.
      return React.cloneElement(children as React.ReactElement, { href, ...rest });
    }
    // If children is not a React element (e.g., a simple string),
    // then the Link mock itself should render the <a> tag.
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
    expect(screen.getByRole('link', {name: /Learn More/i})).toBeInTheDocument(); // This link should now render correctly
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