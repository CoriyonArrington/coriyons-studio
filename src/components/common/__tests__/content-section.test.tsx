// src/components/common/__tests__/content-section.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ContentSection, { type ContentSectionProps } from '../content-section';
import baseTheme from '@/src/lib/theme';

// Updated NextLink mock
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    passHref, // Explicitly list known props
    legacyBehavior, // Explicitly list known props
    ...props     // For any other props
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: unknown; // Use unknown for other dynamic props
  }) => {
    // If the child is a component that will render its own anchor (e.g., Button as="a"),
    // NextLink should just pass props to it.
    if (React.isValidElement(children) && React.Children.count(children) === 1) {
        return React.cloneElement(children as React.ReactElement, { href, ...props });
    }
    // Fallback for string children or multiple children
    return <a href={href} {...props}>{children}</a>;
  },
}));

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ContentSection Component', () => {
  const defaultProps: ContentSectionProps = {
    id: 'test-section',
    headline: 'Test Headline',
    body: 'This is the test body content.',
    cta: 'Click Me',
    href: '/test-path',
  };

  it('should render headline, body, and CTA correctly', () => {
    renderWithChakra(<ContentSection {...defaultProps} />);
    expect(screen.getByRole('heading', { name: defaultProps.headline })).toBeInTheDocument();
    expect(screen.getByText(defaultProps.body!)).toBeInTheDocument();
    const ctaButton = screen.getByRole('link', { name: defaultProps.cta! });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', defaultProps.href);
  });

  it('should render an icon in CTA when ctaRightIcon is true', () => {
    renderWithChakra(<ContentSection {...defaultProps} ctaRightIcon={true} />);
    const button = screen.getByRole('link', { name: defaultProps.cta! });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should not render an icon in CTA when ctaRightIcon is false or undefined', () => {
    const { rerender } = renderWithChakra(
      <ContentSection {...defaultProps} ctaRightIcon={false} />
    );
    let button = screen.getByRole('link', { name: defaultProps.cta! });
    expect(button.querySelector('svg')).not.toBeInTheDocument();

    rerender(<ContentSection {...defaultProps} />);
    button = screen.getByRole('link', { name: defaultProps.cta! });
    expect(button.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should render without optional body and CTA', () => {
    renderWithChakra(<ContentSection id="minimal" headline="Minimal Headline" />);
    expect(screen.getByRole('heading', { name: 'Minimal Headline' })).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.body!)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: defaultProps.cta! })).not.toBeInTheDocument();
  });

  it('should render children when provided', () => {
    const childText = "Custom child content";
    renderWithChakra(
      <ContentSection id="with-children" headline="Headline with Children">
        <div>{childText}</div>
      </ContentSection>
    );
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(
      <ContentSection {...defaultProps} ctaRightIcon={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});