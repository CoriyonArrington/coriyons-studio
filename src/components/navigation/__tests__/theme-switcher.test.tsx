// src/components/navigation/__tests__/theme-switcher.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { axe } from 'jest-axe';
import { ThemeSwitcher } from '../theme-switcher'; // Corrected import path
import baseTheme from '@/src/lib/theme';

const renderFullProviders = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light', nextTheme: string = 'light') => {
  const chakraTestTheme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(
    <NextThemesProvider attribute="class" defaultTheme={nextTheme}>
      <ChakraProvider theme={chakraTestTheme}>{ui}</ChakraProvider>
    </NextThemesProvider>
  );
};

describe('ThemeSwitcher Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    const { container } = renderFullProviders(<ThemeSwitcher />, 'light', 'light');
    // Wait for mounted state if button appearance is conditional
    expect(await screen.findByLabelText('Switch color theme')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderFullProviders(<ThemeSwitcher />, 'dark', 'dark');
    expect(await screen.findByLabelText('Switch color theme')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});