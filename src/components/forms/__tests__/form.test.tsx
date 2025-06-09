// ATTEMPT 1: Fixing unsafe assignment and a confusing void expression.
// - Used `extendTheme` idiomatically to resolve the unsafe assignment.
// - Added curly braces to the handleSubmit mock function to make its return explicit.

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Form from '../form';
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

describe('Form Component', () => {
  it('should render children correctly', () => {
    renderWithChakra(
      <Form>
        <input type="text" aria-label="test input" />
        <button type="submit">Submit</button>
      </Form>
    );
    expect(screen.getByLabelText('test input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should call onSubmit when submitted', () => {
    // FIX: Added curly braces to the arrow function body.
    const handleSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    renderWithChakra(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should pass through HTML form attributes', () => {
    renderWithChakra(
      <Form action="/test-action" method="post" data-testid="custom-form">
        <button type="submit">Submit</button>
      </Form>
    );
    const formElement = screen.getByTestId('custom-form');
    expect(formElement).toHaveAttribute('action', '/test-action');
    expect(formElement).toHaveAttribute('method', 'post');
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <Form>
        <label htmlFor="test-input">Test</label>
        <input id="test-input" type="text" />
      </Form>, 'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(
      <Form>
        <label htmlFor="test-input-dark">Test Dark</label>
        <input id="test-input-dark" type="text" />
      </Form>, 'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});