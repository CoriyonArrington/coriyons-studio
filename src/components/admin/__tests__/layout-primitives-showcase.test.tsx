// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import LayoutPrimitivesShowcase from '../layout-primitives-showcase';
import baseTheme from '@/src/lib/theme';

// This mock is kept for completeness, though the primary buttons in the
// showcase use `as="a"` and are not wrapped in <NextLink>.
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, { href, ...rest });
    }
    return <a href={href} {...rest}>{children}</a>;
  },
}));

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { initialColorMode: 'light', useSystemColorMode: false },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('LayoutPrimitivesShowcase Component', () => {
  it('should render the main "Layout & Sectioning" heading', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', { name: /Layout & Sectioning/i, level: 2 })).toBeInTheDocument();
  });

  it('should render subheadings for component showcases', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    expect(screen.getByRole('heading', { name: /^Section Component$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^ContentSection Component$/i, level: 3 })).toBeInTheDocument();
  });

  it('should display examples for ContentSection with the correct, shared content', () => {
    renderWithChakra(<LayoutPrimitivesShowcase />);
    
    const headlineText = /Let’s Build Something Meaningful Together/i;
    const bodyText = /Your patients deserve a seamless experience/i;
    const ctaProjectText = /Start a Project/i;
    const ctaConsultText = /Book a Free 20-Minute Consult/i;

    // Check that the headline is rendered for all three sections
    const headlines = screen.getAllByRole('heading', { name: headlineText });
    expect(headlines).toHaveLength(3);

    // Check that the body paragraph is rendered in all three sections
    const bodyParagraphs = screen.getAllByText(bodyText);
    expect(bodyParagraphs).toHaveLength(3);

    // Check that the CTA buttons/links are rendered for all three sections
    const projectLinks = screen.getAllByRole('link', { name: ctaProjectText });
    expect(projectLinks).toHaveLength(3);

    const consultLinks = screen.getAllByRole('link', { name: ctaConsultText });
    expect(consultLinks).toHaveLength(3);
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<LayoutPrimitivesShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});