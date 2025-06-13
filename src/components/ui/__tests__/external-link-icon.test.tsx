// src/components/ui/__tests__/external-link-icon.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ExternalLinkIcon from '../external-link-icon';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ExternalLinkIcon Component', () => {
  it('should render an svg icon', () => {
    const { container } = renderWithChakra(<ExternalLinkIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<ExternalLinkIcon />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});