// ATTEMPT 1: Using extendTheme idiomatically to resolve unsafe assignment.
// - Instead of spreading `baseTheme`, it is now passed as a separate argument
//   to `extendTheme`, which is the intended and type-safe usage pattern.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { TypographyInlineCode } from '../inline-code';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  // FIX: Pass theme objects as separate arguments instead of using the spread operator.
  const theme = extendTheme(
    baseTheme,
    {
      config: { 
        initialColorMode: colorMode, 
        useSystemColorMode: false 
      },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('TypographyInlineCode Accessibility', () => {
  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(<TypographyInlineCode>const x = 10;</TypographyInlineCode>, 'light');
    expect(screen.getByText('const x = 10;')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(<TypographyInlineCode>const y = 20;</TypographyInlineCode>, 'dark');
    expect(screen.getByText('const y = 20;')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});