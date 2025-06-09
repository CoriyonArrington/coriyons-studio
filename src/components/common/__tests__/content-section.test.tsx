import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ContentSection, { type ContentSectionProps } from '../content-section';
import baseTheme from '@/src/lib/theme';

// Define a clear interface for the mock Link's props
interface MockLinkProps {
  children: React.ReactNode;
  href: string;
  [key: string]: any; // Allow any other props
}

vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, MockLinkProps>(
      ({ children, href, ...props }, ref) => {
          if (React.isValidElement(children)) {
              return React.cloneElement(children as React.ReactElement, { ...props, href, ref });
          }
          return (
              <a href={href} ref={ref} {...props}>
                  {children}
              </a>
          );
      }
  )
}));
(vi.mocked(require('next/link')) as any).default.displayName = 'MockNextLink';


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

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(
      <ContentSection {...defaultProps} ctaRightIcon={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});