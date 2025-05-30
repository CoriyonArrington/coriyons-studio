// src/components/ui/__tests__/input.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, extendTheme, FormControl, FormLabel } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Input from '../input';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Input Component', () => {
  it('should render an input element', () => {
    renderWithChakra(<Input aria-label="test-input" />);
    expect(screen.getByLabelText('test-input')).toBeInTheDocument();
  });

  it('should call onChange handler when typed into', async () => {
    const handleChange = vi.fn();
    renderWithChakra(<Input aria-label="test-input" onChange={handleChange} />);
    
    const inputElement = screen.getByLabelText('test-input');
    fireEvent.change(inputElement, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledWith(expect.anything()); // Check it was called
    expect(inputElement).toHaveValue('hello'); // Check the value
  });

  it('should be disabled when isDisabled prop is true', () => {
    renderWithChakra(<Input aria-label="test-input" isDisabled />);
    expect(screen.getByLabelText('test-input')).toBeDisabled();
  });

  it('should accept a value and reflect it', () => {
    const testValue = "Initial Value";
    renderWithChakra(<Input aria-label="test-input" value={testValue} onChange={() => {}} />);
    expect(screen.getByLabelText('test-input')).toHaveValue(testValue);
  });

  it('should accept placeholder prop', () => {
    const placeholderText = "Enter text here";
    renderWithChakra(<Input aria-label="test-input" placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithChakra(<Input aria-label="test-input" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should have no a11y violations when used with a label', async () => {
    const { container } = renderWithChakra(
      // FormControl now correctly links FormLabel and Input via its own 'id'
      <FormControl id="email-address"> 
        <FormLabel>Email Address</FormLabel>
        {/* Input should not have its own id if FormControl is managing it */}
        <Input type="email" /> 
      </FormControl>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});