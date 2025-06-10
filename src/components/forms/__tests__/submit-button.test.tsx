// FINAL: Mocks the 'useFormStatus' hook from 'react-dom' to resolve the runtime error in the test environment.
import React from 'react';
import { describe, it, expect, vi, type MockedFunction, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { SubmitButton } from '../submit-button';
import baseTheme from '@/src/lib/theme';
import { useFormStatus, type FormStatus } from 'react-dom';

// Mock the useFormStatus hook from react-dom
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

const mockedUseFormStatus = useFormStatus as MockedFunction<() => FormStatus>;

const renderWithChakraInForm = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { 
        initialColorMode: colorMode, 
        useSystemColorMode: false 
      },
    }
  );
  return render(<ChakraProvider theme={theme}><form>{ui}</form></ChakraProvider>);
};

describe('SubmitButton Accessibility', () => {
  beforeEach(() => {
    // Default mock implementation for a non-pending state
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

  it('should have no a11y violations in pending state (light mode)', async () => {
    // Override mock for this specific test
    mockedUseFormStatus.mockImplementationOnce(() => ({
      pending: true,
      data: new FormData(), 
      method: 'POST',       
      action: () => {},     
    }));

    const { container } = renderWithChakraInForm(<SubmitButton pendingText="Saving...">Save</SubmitButton>, 'light');
    expect(screen.getByRole('button', { name: /Saving.../i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});