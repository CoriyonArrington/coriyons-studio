// src/components/admin/__tests__/custom-project-components-showcase.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import CustomProjectComponentsShowcase from '../custom-project-components-showcase';
import baseTheme from '@/src/lib/theme';
import { useFormStatus, type FormStatus } from 'react-dom';
import SiteFooter from '@/src/components/common/site-footer';
import SiteHeader from '@/src/components/common/site-header';

vi.mock('react-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-dom')>();
  return { ...actual, useFormStatus: vi.fn() };
});

vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

vi.mock('@/src/components/common/site-footer', () => ({
  default: vi.fn(() => <div data-testid="mock-site-footer">Mocked SiteFooter</div>),
}));

vi.mock('@/src/components/navigation/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="mock-theme-switcher">ThemeSwitcher Mock</div>,
}));

vi.mock('@/src/components/common/site-header', () => ({
    default: vi.fn(() => <div data-testid="mock-site-header">Mocked SiteHeader</div>)
}));

const renderWithChakra = (ui: React.ReactElement) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: 'light', useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('CustomProjectComponentsShowcase Component', () => {
  beforeEach(() => {
    vi.mocked(useFormStatus as () => Pick<FormStatus, "pending">).mockReturnValue({
        pending: false,
    });
    vi.mocked(SiteFooter).mockClear();
    vi.mocked(SiteHeader).mockClear();
  });

  it('should render the main "Custom Project Components" heading', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Custom Project Components/i, level: 2 })).toBeInTheDocument();
  });

  it('should render the SiteHeader showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /^SiteHeader$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByTestId('mock-site-header')).toBeInTheDocument();
  });

  it('should render the Form Components showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    const section = screen.getByRole('heading', { name: /Form Components/i, level: 3 }).parentElement;
    expect(within(section!).getByRole('heading', { name: /Example Form/i, level: 4 })).toBeInTheDocument();
    expect(within(section!).getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(within(section!).getByRole('heading', { name: /FormMessage States/i, level: 4 })).toBeInTheDocument();
  });

  it('should render the HeroCtaButton showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /HeroCtaButton/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Free Consultation/i })).toBeInTheDocument();
  });

  it('should render the Card Components showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    const section = screen.getByRole('heading', { name: /Card Components/i, level: 3 }).parentElement;
    expect(within(section!).getByRole('heading', { name: /Unified PostCard/i, level: 4 })).toBeInTheDocument();
    expect(within(section!).getByRole('heading', { name: /FeatureCard/i, level: 4 })).toBeInTheDocument();
  });
  
  it('should render the Navigation & Auth showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    const section = screen.getByRole('heading', { name: /Navigation & Auth/i, level: 3 }).parentElement;
    expect(within(section!).getByRole('heading', { name: /HeaderAuth/i, level: 4 })).toBeInTheDocument();
    expect(within(section!).getByRole('heading', { name: /ThemeSwitcher/i, level: 4 })).toBeInTheDocument();
  });
  
  it('should render the Utility Components showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    const section = screen.getByRole('heading', { name: /Utility Components/i, level: 3 }).parentElement;
    expect(within(section!).getByRole('heading', { name: /Toaster \(Toast Utility\)/i, level: 4 })).toBeInTheDocument();
    expect(within(section!).getByRole('button', {name: /Show Info Toast/i})).toBeInTheDocument();
  });

  it('should render the SiteFooter showcase', async () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /^SiteFooter$/i, level: 3 })).toBeInTheDocument();
    expect(await screen.findByTestId('mock-site-footer')).toBeInTheDocument();
  });
  
  // Note: One accessibility issue related to form labels may persist depending
  // on the implementation of the custom <FormField> component.
  // The `list` violation, however, has been fixed.
  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<CustomProjectComponentsShowcase />);
    await screen.findByTestId('mock-site-footer');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});