// src/components/admin/__tests__/iconography-showcase.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import IconographyShowcase from '../iconography-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('IconographyShowcase Component', () => {
  it('should render the main "Iconography" heading', () => {
    renderWithChakra(<IconographyShowcase />);
    expect(screen.getByRole('heading', { name: /Iconography/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about Lucide Icons and Chakra Icon component', () => {
    renderWithChakra(<IconographyShowcase />);
    expect(screen.getByText(/Using Lucide Icons with Chakra UI's/i)).toBeInTheDocument();
  });

  it('should render example icons with their descriptions', () => {
    const { container } = renderWithChakra(<IconographyShowcase />);
    expect(screen.getByText(/Home Icon \(size 5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings Icon \(size 6\)/i)).toBeInTheDocument();
    expect(screen.getByText(/External Link \(default color\)/i)).toBeInTheDocument();

    const section = container.querySelector('section#iconography');
    expect(section).toBeInTheDocument();
    if (section) {
      const svgs = section.querySelectorAll('svg.lucide');
      expect(svgs.length).toBeGreaterThanOrEqual(3);
    } else {
      throw new Error("Iconography section not found in the DOM for SVG query.");
    }
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<IconographyShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});