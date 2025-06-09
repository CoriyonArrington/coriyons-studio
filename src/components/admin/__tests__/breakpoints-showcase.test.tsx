// ATTEMPT #6: Using `getAllByText` to handle multiple matching elements.
// Change 1: Replaced the failing `getByText('base')` query, which was ambiguous, with `getAllByText('base')`.
// Change 2: The test now explicitly selects the first element from the returned array (`codeElements[0]`), which corresponds to the "0px+" line in the DOM.
// Change 3: It then asserts that the parent element of this specific `<code>` tag contains the expected ": 0px+" text. This robustly verifies the correct line and resolves the test failure.

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import BreakpointsShowcase from '../breakpoints-showcase';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(
    baseTheme,
    {
      config: { initialColorMode: 'light', useSystemColorMode: false },
    }
  );
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('BreakpointsShowcase Component', () => {
  it('should render the main "Breakpoints" heading', () => {
    renderWithChakra(<BreakpointsShowcase />);
    expect(screen.getByRole('heading', { name: /Breakpoints/i, level: 2 })).toBeInTheDocument();
  });

  it('should render introductory text about testing by resizing', () => {
    renderWithChakra(<BreakpointsShowcase />);
    expect(screen.getByText(/Test by resizing your browser window/i)).toBeInTheDocument();
  });

  it('should render the breakpoint key and base demonstration box', () => {
    renderWithChakra(<BreakpointsShowcase />);
    
    const keyHeading = screen.getByRole('heading', { name: /Breakpoint Key/i, level: 3 });
    const keySection = keyHeading.parentElement;
    expect(keySection).toBeInTheDocument();

    if (keySection) {
      // FIX: Find all "base" elements and assert on the first one's parent.
      const codeElements = within(keySection).getAllByText('base');
      expect(codeElements[0]).toBeInTheDocument();
      
      const parentParagraph = codeElements[0].parentElement;
      expect(parentParagraph).toHaveTextContent(/: 0px\+/);
    }
    
    expect(screen.getByRole('heading', { name: /Mobile View \(`base`\)/i, level: 3 })).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<BreakpointsShowcase />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});