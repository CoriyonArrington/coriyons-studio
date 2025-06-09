// ATTEMPT 1: Fixing unsafe assignment and removing deprecated act() calls.
// - Used `extendTheme` idiomatically to resolve the unsafe assignment.
// - Removed all manual `act()` wrappers, as they are handled automatically by
//   the subsequent `await screen.findByRole()` queries.

import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
// FIX: Removed deprecated `act` import.
import { render, screen, fireEvent, waitForElementToBeRemoved, within } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { toaster } from '../toaster';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui?: React.ReactElement) => {
  // FIX: Pass theme objects as separate arguments instead of using the spread operator.
  const theme = extendTheme(
    baseTheme,
    {
      config: { 
        initialColorMode: 'light', 
        useSystemColorMode: false 
      },
    }
  );
  return render(ui || <div />, { wrapper: ({ children }) => <ChakraProvider theme={theme}>{children}</ChakraProvider> });
};

describe('Toaster', () => {
  afterEach(() => {
    // Cleanup logic remains the same.
  });

  it('should display a success toast with title and description', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Success!',
      description: 'Your action was successful.',
      status: 'success',
      duration: null,
    });
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(within(alert).getByText('Success!')).toBeInTheDocument();
    expect(within(alert).getByText('Your action was successful.')).toBeInTheDocument();
  });

  it('should display an error toast', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Error Occurred',
      description: 'Something went wrong.',
      status: 'error',
      duration: null,
    });
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Error Occurred')).toBeInTheDocument();
    expect(within(alert).getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should display an info toast', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Information',
      description: 'Just an FYI.',
      status: 'info',
      duration: null,
    });
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Information')).toBeInTheDocument();
    expect(within(alert).getByText('Just an FYI.')).toBeInTheDocument();
  });

  it('should display a warning toast', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Warning Message',
      description: 'Please be careful.',
      status: 'warning',
      duration: null,
    });
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Warning Message')).toBeInTheDocument();
    expect(within(alert).getByText('Please be careful.')).toBeInTheDocument();
  });

  it('should display a loading toast and show a spinner', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Loading...',
      description: 'Please wait while we process your request.',
      status: 'loading',
      duration: null,
    });
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Loading...', { selector: 'div.chakra-alert__title' })).toBeInTheDocument();
    expect(within(alert).getByText('Please wait while we process your request.')).toBeInTheDocument();
    expect(within(alert).getByRole('status')).toBeInTheDocument();
  });

  it('should be closable by the close button', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Closable Toast',
      status: 'info',
      isClosable: true,
      duration: null,
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();

    const closeButton = within(alert).getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitForElementToBeRemoved(() => screen.queryByRole('alert'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have no a11y violations for a displayed toast', async () => {
    renderWithChakra();
    // FIX: Removed `act()` wrapper.
    toaster({
      title: 'Accessibility Check',
      description: 'This toast should be accessible.',
      status: 'success',
      duration: null,
    });

    const alert = await screen.findByRole('alert');
    const results = await axe(alert);
    expect(results).toHaveNoViolations();

    const closeButton = within(alert).getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    await waitForElementToBeRemoved(() => screen.queryByRole('alert'));
  });
});