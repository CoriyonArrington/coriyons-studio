// src/components/ui/__tests__/card.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme, Button as ChakraButton } from '@chakra-ui/react'; // Added Button as ChakraButton
import { axe } from 'jest-axe';
import { UICard, UICardHeader, UICardBody, UICardFooter, UICardHeading, UICardText } from '../card';
import baseTheme from '@/src/lib/theme';

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Card Components', () => {
  describe('UICard', () => {
    it('should render children', () => {
      renderWithChakra(<UICard>Card Content</UICard>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should have no a11y violations', async () => {
      const { container } = renderWithChakra(
        <UICard>
          <UICardHeader><UICardHeading size="md" as="h3">Title</UICardHeading></UICardHeader>
          <UICardBody><UICardText>Body</UICardText></UICardBody>
          <UICardFooter><UICardText>Footer</UICardText></UICardFooter>
        </UICard>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('UICardHeader', () => {
    it('should render children when wrapped in UICard', () => {
      renderWithChakra(
        <UICard>
          <UICardHeader><UICardHeading size="lg" as="h3">Header Title</UICardHeading></UICardHeader>
        </UICard>
      );
      expect(screen.getByRole('heading', { name: 'Header Title', level: 3 })).toBeInTheDocument();
    });
  });

  describe('UICardBody', () => {
    it('should render children when wrapped in UICard', () => {
      renderWithChakra(
        <UICard>
          <UICardBody><UICardText>This is the body.</UICardText></UICardBody>
        </UICard>
      );
      expect(screen.getByText('This is the body.')).toBeInTheDocument();
    });
  });

  describe('UICardFooter', () => {
    it('should render children when wrapped in UICard', () => {
      renderWithChakra(
        <UICard>
          <UICardFooter><ChakraButton>Action</ChakraButton></UICardFooter>
        </UICard>
      );
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  it('should compose correctly', () => {
    const headerText = "Card Title";
    const bodyText = "This is the card's main content.";
    const footerText = "Footer Action";

    renderWithChakra(
      <UICard variant="outline">
        <UICardHeader>
          <UICardHeading size="md" as="h3">{headerText}</UICardHeading>
        </UICardHeader>
        <UICardBody>
          <UICardText>{bodyText}</UICardText>
        </UICardBody>
        <UICardFooter>
          <ChakraButton>{footerText}</ChakraButton>
        </UICardFooter>
      </UICard>
    );

    expect(screen.getByRole('heading', { name: headerText, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(bodyText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: footerText })).toBeInTheDocument();
  });
});