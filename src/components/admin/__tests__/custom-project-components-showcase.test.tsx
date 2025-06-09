// ATTEMPT #7: Re-introducing the mock for `useFormStatus`.
// Change 1: Added a `vi.mock` for the 'react-dom' module to provide a dummy implementation for the `useFormStatus` hook.
// Change 2: This mock resolves the "useFormStatus is not a function" TypeError, which was causing the entire component to crash during the test render.
// Change 3: Added a `beforeEach` block to reset the mock's return value before each test, ensuring a clean state.

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import CustomProjectComponentsShowcase from '../custom-project-components-showcase';
import baseTheme from '@/src/lib/theme';
import { useFormStatus } from 'react-dom';

// FIX: Mock the 'react-dom' module to provide `useFormStatus`
vi.mock('react-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-dom')>();
    return {
        ...actual,
        useFormStatus: vi.fn(),
    };
});

// This helper function is correct and remains unchanged.
const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { initialColorMode: 'light', useSystemColorMode: false },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('CustomProjectComponentsShowcase Component (Simplified Test)', () => {
    // FIX: Reset the mock before each test
    beforeEach(() => {
        (useFormStatus as Mock).mockReturnValue({ pending: false, data: null, method: null, action: null });
    });

  it('should render the main "Custom Project Components" heading', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Custom Project Components/i, level: 2 })).toBeInTheDocument();
  });

  it('should have no a11y violations on a basic render', async () => {
    const { container } = renderWithChakra(<CustomProjectComponentsShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});