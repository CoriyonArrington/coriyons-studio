// src/components/common/__tests__/section.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Section from '../section';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Section Component', () => {
  it('should render its children correctly', () => {
    const childText = 'This is the section content.';
    renderWithChakra(
      <Section>
        <p>{childText}</p>
      </Section>
    );
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('should wrap children in a Container by default', () => {
    const childText = 'Child content';
    const { container } = renderWithChakra(
      <Section>
        <p>{childText}</p>
      </Section>
    );
    // Chakra's Container component usually has a `max-width` style.
    // The wrapper of the child content should be the Container.
    const childElement = screen.getByText(childText);
    const containerElement = childElement.parentElement;
    expect(containerElement).toHaveClass('chakra-container');
  });

  it('should not wrap children in a Container when containerMaxWidth is "none"', () => {
    const childText = 'Full-width content';
    renderWithChakra(
      <Section containerMaxWidth="none">
        <p>{childText}</p>
      </Section>
    );
    const childElement = screen.getByText(childText);
    const parentElement = childElement.parentElement;
    // The direct parent should be the section Box, not a Container
    expect(parentElement).not.toHaveClass('chakra-container');
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(
      <Section>
        <p>Accessible content</p>
      </Section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});