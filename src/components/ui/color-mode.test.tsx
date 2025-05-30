// src/components/ui/color-mode.test.tsx
import React from 'react'; // Added React import
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ColorModeProvider, ColorModeButton } from './color-mode';
import { axe } from 'jest-axe';
import baseTheme from '@/src/lib/theme';

const renderFullProviders = (ui: React.ReactElement, initialChakraMode: 'light' | 'dark' = 'light', initialNextTheme: string = 'light') => {
  const chakraTestTheme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: initialChakraMode, useSystemColorMode: false },
  });
  return render(
    <ColorModeProvider defaultTheme={initialNextTheme} attribute="class">
      <ChakraProvider theme={chakraTestTheme}>{ui}</ChakraProvider>
    </ColorModeProvider>
  );
};

describe('ColorModeButton Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    const { container } = renderFullProviders(<ColorModeButton />, 'light', 'light');
    expect(screen.getByLabelText('Toggle color mode')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderFullProviders(<ColorModeButton />, 'dark', 'dark');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});