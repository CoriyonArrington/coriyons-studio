// ATTEMPT #2: Correcting the `aria-label` assertion in the test.
// Change 1 & 2: The `ThemeSwitcher` button has a static aria-label of "Switch color theme". The tests were incorrectly looking for dynamic labels ("Switch to light mode" / "Switch to dark mode"). Updated both tests to assert against the correct, static label, which will allow the tests to find the element and proceed with the accessibility check.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { axe } from 'jest-axe';
import { ThemeSwitcher } from '../theme-switcher';
import baseTheme from '@/src/lib/theme';

const renderFullProviders = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light', nextTheme: string = 'light') => {
  const chakraTestTheme = extendTheme(
    baseTheme,
    {
      config: { 
        initialColorMode: colorMode, 
        useSystemColorMode: false 
      },
    }
  );
  return render(
    <NextThemesProvider attribute="class" defaultTheme={nextTheme}>
      <ChakraProvider theme={chakraTestTheme}>{ui}</ChakraProvider>
    </NextThemesProvider>
  );
};

describe('ThemeSwitcher Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    const { container } = renderFullProviders(<ThemeSwitcher />, 'light', 'light');
    // FIX: The component's aria-label is static. Test for the correct label.
    expect(await screen.findByLabelText('Switch color theme')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderFullProviders(<ThemeSwitcher />, 'dark', 'dark');
    // FIX: The component's aria-label is static. Test for the correct label.
    expect(await screen.findByLabelText('Switch color theme')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});