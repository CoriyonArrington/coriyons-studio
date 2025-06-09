// ATTEMPT 1: Using extendTheme idiomatically to resolve unsafe assignment.
// - Instead of spreading `baseTheme`, it is now passed as a separate argument
//   to `extendTheme`, which is the intended and type-safe usage pattern.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme, Input } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import FormField from '../form-field'; 
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

describe('FormField Component', () => {
  const defaultLabel = 'Test Label';
  const defaultId = 'test-input';

  it('should render the label and children correctly', () => {
    renderWithChakra(
      <FormField label={defaultLabel} id={defaultId}>
        <Input id={defaultId} data-testid="child-input" />
      </FormField>
    );
    expect(screen.getByText(defaultLabel)).toBeInTheDocument();
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
    expect(screen.getByLabelText(defaultLabel)).toBe(screen.getByTestId('child-input'));
  });

  it('should display an error message when error prop is provided', () => {
    const errorMessage = 'This field is required.';
    renderWithChakra(
      <FormField label={defaultLabel} id={defaultId} error={errorMessage}>
        <Input id={defaultId} />
      </FormField>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: defaultLabel })).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display helper text when provided and no error', () => {
    const helperMessage = 'This is some helper text.';
    renderWithChakra(
      <FormField label={defaultLabel} id={defaultId} helperText={helperMessage}>
        <Input id={defaultId} />
      </FormField>
    );
    expect(screen.getByText(helperMessage)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  
  it('should not display helper text if an error is present', () => {
    const helperMessage = 'This is some helper text.';
    const errorMessage = 'Error occurred!';
    renderWithChakra(
      <FormField label={defaultLabel} id={defaultId} helperText={helperMessage} error={errorMessage}>
        <Input id={defaultId} />
      </FormField>
    );
    expect(screen.queryByText(helperMessage)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should mark field as required when isRequired prop is true', () => {
    renderWithChakra(
      <FormField label={defaultLabel} id={defaultId} isRequired>
        <Input id={defaultId} />
      </FormField>
    );
    const labelElement = screen.getByText(defaultLabel);
    expect(labelElement.querySelector('.chakra-form__required-indicator')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: defaultLabel })).toBeRequired();
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <FormField label="Email Address" id="email-light">
        <Input type="email" id="email-light" />
      </FormField>, 'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations with error in dark mode', async () => {
    const { container } = renderWithChakra(
      <FormField label="Password" id="password-dark" error="Password too short">
        <Input type="password" id="password-dark" />
      </FormField>, 'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});