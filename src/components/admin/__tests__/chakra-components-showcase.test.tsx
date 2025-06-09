// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ChakraComponentsShowcase from '../chakra-components-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { initialColorMode: 'light', useSystemColorMode: false },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ChakraComponentsShowcase Component', () => {
  it('should render the main "Chakra Components" heading', () => {
    renderWithChakra(<ChakraComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Chakra Components/i, level: 2 })).toBeInTheDocument();
  });

  it('should render "Buttons (Chakra)" subheading and example buttons', () => {
    renderWithChakra(<ChakraComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Buttons \(Chakra\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Default Primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Themed Outline/i })).toBeInTheDocument();
  });

  it('should render "Badges" subheading and example badges', () => {
    renderWithChakra(<ChakraComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Badges/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument(); // Badge text
    expect(screen.getByText('Subtle Yellow')).toBeInTheDocument();
  });

  it('should render "Form Elements (Chakra)" subheading and example form controls', () => {
    renderWithChakra(<ChakraComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Form Elements \(Chakra\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name \(with error\)/i)).toBeInTheDocument();
    expect(screen.getByText('Name is required.')).toBeInTheDocument(); // Error message
  });

  it('should render "Loading States (Skeleton)" subheading and skeleton examples', () => {
    renderWithChakra(<ChakraComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Loading States \(Skeleton\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Skeleton Text:')).toBeInTheDocument();
    expect(screen.getByText('Skeleton Shapes:')).toBeInTheDocument();
    // Skeletons don't have explicit roles usually, presence of text around them is a good indicator
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<ChakraComponentsShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});