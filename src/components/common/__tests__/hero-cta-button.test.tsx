// src/components/common/__tests__/hero-cta-button.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import HeroCtaButton from '../hero-cta-button';
import baseTheme from '@/src/lib/theme';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme(baseTheme);
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('HeroCtaButton Component', () => {
  const defaultProps = {
    href: '/contact',
    children: 'Get Started',
  };

  it('should render a link with the correct href and text', () => {
    renderWithChakra(<HeroCtaButton {...defaultProps} />);
    const linkElement = screen.getByRole('link', { name: /get started/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', defaultProps.href);
  });

  it('should display the icon by default', () => {
    const { container } = renderWithChakra(<HeroCtaButton {...defaultProps} />);
    // Chakra UI icons are often rendered as SVGs
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should not display the icon when showIcon is false', () => {
    const { container } = renderWithChakra(<HeroCtaButton {...defaultProps} showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<HeroCtaButton {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});