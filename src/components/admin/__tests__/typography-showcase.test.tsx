// src/components/admin/__tests__/typography-showcase.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import TypographyShowcase from '../typography-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('TypographyShowcase Component', () => {
  it('should render the main "Typography" heading', () => {
    renderWithChakra(<TypographyShowcase />);
    expect(screen.getByRole('heading', { name: /Typography/i, level: 2 })).toBeInTheDocument();
  });

  it('should render various heading levels', () => {
    renderWithChakra(<TypographyShowcase />);
    expect(screen.getByRole('heading', { name: /Heading 1/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Heading 2/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Heading 3/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Heading 4/i, level: 4 })).toBeInTheDocument();
  });

  it('should render standard paragraph text and blockquote', () => {
    renderWithChakra(<TypographyShowcase />);
    expect(screen.getByText(/This is a standard paragraph/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a blockquote/i)).toBeInTheDocument();
  });

  it('should render an unordered and ordered list', () => {
    renderWithChakra(<TypographyShowcase />);
    expect(screen.getByRole('heading', { name: /^Unordered List$/i, level: 4 })).toBeInTheDocument();
    expect(screen.getByText('List item one')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Ordered List$/i, level: 4 })).toBeInTheDocument(); 
    expect(screen.getByText('First item')).toBeInTheDocument();
  });

  it('should render an example of ChakraLink', () => {
    renderWithChakra(<TypographyShowcase />);
    expect(screen.getByRole('link', { name: /ChakraLink/i})).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<TypographyShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});