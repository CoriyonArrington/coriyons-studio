// ATTEMPT #1: Using `extendTheme` idiomatically to resolve unsafe assignment.
// Change 1: Refactored the `extendTheme` call to pass `baseTheme` as a separate argument instead of using the spread operator. This is the idiomatic and type-safe way to extend the theme in Chakra UI and resolves the `no-unsafe-assignment` error.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import AnimationsMotionShowcase from '../animations-motion-showcase';
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

describe('AnimationsMotionShowcase Component', () => {
  it('should render the main "Animations & Motion" heading', () => {
    renderWithChakra(<AnimationsMotionShowcase />);
    expect(screen.getByRole('heading', { name: /Animations & Motion/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about transitions and animation libraries', () => {
    renderWithChakra(<AnimationsMotionShowcase />);
    expect(screen.getByText(/Chakra UI supports transitions/i)).toBeInTheDocument();
  });

  it('should render the hover transition example box and its accompanying text', () => {
    renderWithChakra(<AnimationsMotionShowcase />);
    expect(screen.getByText(/Hover the box for transition/i)).toBeInTheDocument();
    expect(screen.getByTestId('hover-box')).toBeInTheDocument();
  });

  it('should render the pulse animation example heading and box', () => {
    renderWithChakra(<AnimationsMotionShowcase />);
    expect(screen.getByRole('heading', { name: /Pulse Example \(CSS Keyframe\)/i, level: 3 })).toBeInTheDocument();
    const pulseBox = screen.getByTestId('pulse-box');
    expect(pulseBox).toBeInTheDocument();
    expect(pulseBox).toHaveStyle('animation: pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite');
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<AnimationsMotionShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});