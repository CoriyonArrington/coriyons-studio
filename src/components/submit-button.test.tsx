/// <reference types="vitest/globals" />
import React from 'react';
import { describe, it, expect, vi, type MockedFunction } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { SubmitButton } from './submit-button';
import baseTheme from '@/src/lib/theme';
import { useFormStatus, type FormStatus } from 'react-dom';

type MockedUseFormStatus = () => FormStatus;

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom') as typeof import('react-dom');
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

const mockedUseFormStatus = useFormStatus as MockedFunction<MockedUseFormStatus>;

const renderWithChakraInForm = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}><form>{ui}</form></ChakraProvider>);
};

describe('SubmitButton Accessibility', () => {
  beforeEach(() => {
    mockedUseFormStatus.mockImplementation(() => ({
      pending: false,
      data: null,
      method: null,
      action: null, 
    }));
  });

  it('should have no a11y violations in default state (light mode)', async () => {
    const { container } = renderWithChakraInForm(<SubmitButton>Submit</SubmitButton>, 'light');
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in default state (dark mode)', async () => {
    const { container } = renderWithChakraInForm(<SubmitButton>Submit</SubmitButton>, 'dark');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in pending state (light mode)', async () => {
    mockedUseFormStatus.mockImplementationOnce(() => ({
      pending: true,
      data: new FormData(),
      method: 'POST',
      action: () => {}, 
    }));

    const { container } = renderWithChakraInForm(<SubmitButton pendingText="Saving...">Save</SubmitButton>, 'light');
    // Corrected the query to match the actual accessible name when isLoading
    expect(screen.getByRole('button', { name: /Loading... Saving.../i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});