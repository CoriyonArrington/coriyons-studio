// src/components/forms/__tests__/form-message.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { FormMessage, type Message } from '../form-message'; // Corrected import path
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('FormMessage Accessibility', () => {
  const successMessage: Message = { success: 'Operation successful!', title: 'Success' };
  const errorMessage: Message = { error: 'Operation failed.', title: 'Error' };
  const infoMessage: Message = { message: 'This is an informational message.', title: 'Info' };

  it('should have no a11y violations for success message in light mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={successMessage} />, 'light');
    expect(screen.getByText('Operation successful!')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations for success message in dark mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={successMessage} />, 'dark');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations for error message in light mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={errorMessage} />, 'light');
    expect(screen.getByText('Operation failed.')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations for error message in dark mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={errorMessage} />, 'dark');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations for info message in light mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={infoMessage} />, 'light');
    expect(screen.getByText('This is an informational message.')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations for info message in dark mode', async () => {
    const { container } = renderWithChakra(<FormMessage message={infoMessage} />, 'dark');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});