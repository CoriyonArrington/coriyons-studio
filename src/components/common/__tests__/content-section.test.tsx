// src/components/common/__tests__/content-section.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import ContentSection, { type ContentSectionProps } from '../content-section';
import baseTheme from '@/src/lib/theme';
import type { LinkProps as NextLinkProps } from 'next/link';

// FIX: A fully type-safe mock for the Next.js Link component with displayName and proper href handling.
vi.mock('next/link', () => {
  const MockLink = React.forwardRef<
    HTMLAnchorElement,
    NextLinkProps & { children: React.ReactNode }
  >(({ children, href, ...props }, ref) => {
    
    // This handles href being an object, which prevents the '[object Object]' error.
    const linkHref = typeof href === 'string' ? href : href.pathname || '';
    
    return (
      <a href={linkHref} {...props} ref={ref}>
        {children}
      </a>
    );
  });
  
  // This resolves the 'missing display name' error.
  MockLink.displayName = 'MockNextLink';

  return { default: MockLink };
});


const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
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