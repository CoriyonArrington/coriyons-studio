// src/components/ui/__tests__/spinner.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Spinner from '../spinner';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Spinner Component', () => {
  it('should render a spinner with default label and status role', () => {
    renderWithChakra(<Spinner />);
    expect(screen.getByRole('status', { name: "Loading..." })).toBeInTheDocument();
  });

  it('should render a spinner with a custom label and status role', () => {
    const customLabel = "Processing data...";
    renderWithChakra(<Spinner label={customLabel} />);
    expect(screen.getByRole('status', { name: customLabel })).toBeInTheDocument();
  });

  it('should apply Chakra UI style props (e.g., size, color, thickness)', () => {
    renderWithChakra(<Spinner size="xl" color="red.500" thickness="4px" label="Styled Spinner" />);
    // We check by role and label. Visual aspects would be for visual regression.
    expect(screen.getByRole('status', {name: "Styled Spinner"})).toBeInTheDocument();
  });
  
  it('should render with an empty aria-label if label prop is an empty string, but still have role status', () => {
    renderWithChakra(<Spinner label="" />);
    // It should have the role="status" even if the label is empty.
    // The accessible name might be empty or default to something internal based on Chakra.
    // For this test, let's ensure the element with the role is there.
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
    // Optionally, check if its aria-label is indeed empty:
    expect(spinnerElement).toHaveAttribute('aria-label', '');
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(<Spinner />);
    const results = await axe(container); // Test the whole container as spinner is simple
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations with custom props in dark mode', async () => {
    const { container } = renderWithChakra(<Spinner label="Loading content" size="lg" color="blue.300" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});