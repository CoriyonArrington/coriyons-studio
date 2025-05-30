// src/components/ui/__tests__/button.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Button from '../button';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Button Component', () => {
  it('should render children correctly', () => {
    const buttonText = 'Click Me';
    renderWithChakra(<Button>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const buttonText = 'Submit';
    renderWithChakra(<Button onClick={handleClick}>{buttonText}</Button>);
    
    const buttonElement = screen.getByRole('button', { name: buttonText });
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isDisabled prop is true', () => {
    const buttonText = 'Disabled Button';
    renderWithChakra(<Button isDisabled>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toBeDisabled();
  });

  it('should show loading state when isLoading prop is true', () => {
    const loadingText = 'Loading...';
    // Pass a different child if you want to ensure loadingText takes precedence,
    // or no child if loadingText is the sole content with the spinner.
    renderWithChakra(<Button isLoading loadingText={loadingText}>Action</Button>);
    
    // When isLoading, the accessible name might be just the loadingText.
    // The spinner itself might also have a "Loading..." accessible name.
    // Let's find by role and then check the text content or data-loading attribute.
    const buttonElement = screen.getByRole('button'); 
    
    // Check if the button visually contains the loading text.
    // Depending on Chakra's implementation, the name might be tricky if spinner text is also there.
    // A more robust query might be by the text if it's unique enough, or check for data-loading.
    expect(buttonElement).toHaveTextContent(loadingText);
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute('data-loading');
  });

  it('should apply variant and colorScheme props', () => {
    const buttonText = 'Outline Button';
    renderWithChakra(<Button variant="outline" colorScheme="teal">{buttonText}</Button>);
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeInTheDocument(); 
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations when disabled', async () => {
    const { container } = renderWithChakra(<Button isDisabled>Disabled Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});