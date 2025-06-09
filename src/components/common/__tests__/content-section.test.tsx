// ATTEMPT #4: Updating the Next.js Link mock to support `ref` forwarding.
// Change 1: The mock for `next/link` is now wrapped in `React.forwardRef`.
// Change 2: The `ref` is now correctly passed to the underlying cloned element.
// This resolves the "Function components cannot be given refs" warning by correctly simulating the behavior of the real Next.js Link component.

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ContentSection, { type ContentSectionProps } from '../content-section';
import baseTheme from '@/src/lib/theme';

// FIX: Updated NextLink mock to use React.forwardRef
vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, { children: React.ReactNode; href: string;[key: string]: unknown; }>(
      ({ children, href, ...props }, ref) => {
          if (React.isValidElement(children)) {
              return React.cloneElement(children, { ...props, href, ref });
          }
          return (
              <a href={href} ref={ref} {...props}>
                  {children}
              </a>
          );
      }
  )
}));
// Add a displayName for better debugging
vi.mocked(require('next/link').default).displayName = 'MockNextLink';


const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
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
    
    if (defaultProps.body) {
      expect(screen.getByText(defaultProps.body)).toBeInTheDocument();
    }
    if (defaultProps.cta && defaultProps.href) {
      const ctaButton = screen.getByRole('link', { name: defaultProps.cta });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveAttribute('href', defaultProps.href);
    }
  });

  it('should render an icon in CTA when ctaRightIcon is true', () => {
    if (defaultProps.cta) {
      renderWithChakra(<ContentSection {...defaultProps} ctaRightIcon={true} />);
      const button = screen.getByRole('link', { name: defaultProps.cta });
      expect(button.querySelector('svg')).toBeInTheDocument();
    }
  });

  it('should not render an icon in CTA when ctaRightIcon is false or undefined', () => {
    if (defaultProps.cta) {
      const { rerender } = renderWithChakra(
        <ContentSection {...defaultProps} ctaRightIcon={false} />
      );
      let button = screen.getByRole('link', { name: defaultProps.cta });
      expect(button.querySelector('svg')).not.toBeInTheDocument();

      rerender(<ContentSection {...defaultProps} />);
      button = screen.getByRole('link', { name: defaultProps.cta });
      expect(button.querySelector('svg')).not.toBeInTheDocument();
    }
  });

  it('should render without optional body and CTA', () => {
    renderWithChakra(<ContentSection id="minimal" headline="Minimal Headline" />);
    expect(screen.getByRole('heading', { name: 'Minimal Headline' })).toBeInTheDocument();

    if (defaultProps.body) {
      expect(screen.queryByText(defaultProps.body)).not.toBeInTheDocument();
    }
    if (defaultProps.cta) {
      expect(screen.queryByRole('link', { name: defaultProps.cta })).not.toBeInTheDocument();
    }
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