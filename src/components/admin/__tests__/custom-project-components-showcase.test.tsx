// src/components/admin/__tests__/custom-project-components-showcase.test.tsx
// FINAL: Addresses unused MockedFunction and ensures robust NextLink mock.
// ADDED: Mock for SiteFooter to prevent "cookies()" error during showcase rendering.
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import CustomProjectComponentsShowcase from '../custom-project-components-showcase';
import baseTheme from '@/src/lib/theme';
// Import useFormStatus (which will be the mocked version) and FormStatus for types
import { useFormStatus, type FormStatus } from 'react-dom';
import SiteFooter from '@/src/components/common/site-footer';

// Define the simplified signature our mock for useFormStatus will adhere to
type UseFormStatusMockSignature = () => Pick<FormStatus, "pending">;

// Mock 'react-dom'. The factory provides a basic vi.fn() for useFormStatus.
vi.mock('react-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-dom')>();
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

// Refined NextLink Mock
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    passHref,
    legacyBehavior,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: unknown;
  }) => {
    // Simulate modern NextLink behavior where it renders its own <a>
    // Children are passed through. passHref and legacyBehavior are noted but not primary drivers here.
    return <a href={href} {...rest}>{children}</a>;
  },
}));

// Mock SiteFooter to prevent it from calling getCategorizedFooterPages (which uses cookies)
vi.mock('@/src/components/common/site-footer', () => ({
  default: vi.fn(() => <div data-testid="mock-site-footer">Mocked SiteFooter</div>),
}));

vi.mock('@/src/components/navigation/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="mock-theme-switcher">ThemeSwitcher Mock</div>,
}));

vi.mock('@/app/actions', async (importOriginal) => {
  const actualAppActionsModule = await importOriginal<typeof import('@/app/actions')>();
  return {
    ...actualAppActionsModule,
    signOutAction: vi.fn(() => Promise.resolve()),
  };
});

vi.mock('@/src/utils/supabase/check-env-vars', () => ({
  hasEnvVars: true,
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
    vi.mocked(useFormStatus as UseFormStatusMockSignature).mockReturnValue({
        pending: false,
    });
    // Reset SiteFooter mock calls if needed, though it's a simple render mock here
    vi.mocked(SiteFooter).mockClear();
  });

  it('should render the main "Custom Project Components" heading', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Custom Project Components/i, level: 2 })).toBeInTheDocument();
  });

  it('should render SiteHeader showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /SiteHeader/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/SiteHeader \(Logged In - Mocked\):/i)).toBeInTheDocument();
  });

  it('should render SiteFooter showcase (mocked)', async () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /SiteFooter/i, level: 3 })).toBeInTheDocument();
    // Check for the mock's content
    expect(await screen.findByTestId('mock-site-footer')).toBeInTheDocument();
    expect(screen.getByText('Mocked SiteFooter')).toBeInTheDocument();
  });

  it('should render Form (Custom Wrapper) showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Form \(Custom Wrapper\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Submit via Custom Form/i})).toBeInTheDocument();
  });

  it('should render FormField showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /FormField \(Custom Wrapper\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address \(via FormField\)/i)).toBeInTheDocument();
  });

  it('should render FormMessage showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /FormMessage/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText("This is a detailed error message.")).toBeInTheDocument();
  });

  it('should render SubmitButton showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /SubmitButton/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Default Submit/i })).toBeInTheDocument();
  });

  it('should render HeaderAuth showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /HeaderAuth \(AuthButton\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/Logged In State \(Mocked\):/i)).toBeInTheDocument();
  });

  it('should render ThemeSwitcher showcase (mocked)', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /ThemeSwitcher/i, level: 3 })).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-theme-switcher').length).toBeGreaterThanOrEqual(1);
  });

  it('should render Button (Custom UI Primitive) showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Button \(Custom UI Primitive\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Primary Action/i })).toBeInTheDocument();
  });

  it('should render HeroCtaButton showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /HeroCtaButton/i, level: 3 })).toBeInTheDocument();
    // Updated to check for the link role and the text content
    const heroCtaLink = screen.getByRole('link', { name: /Get Free Consultation/i });
    expect(heroCtaLink).toBeInTheDocument();
    expect(heroCtaLink).toHaveAttribute('href', '/contact');
  });

  it('should render Card (Custom UI Primitive) showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Card \(Custom UI Primitive\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Card Title \(Outline\)/i })).toBeInTheDocument();
  });

  it('should render Input (Custom UI Primitive) showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Input \(Custom UI Primitive\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \(Custom Input\)/i)).toBeInTheDocument();
  });

  it('should render Modal (Custom UI Primitive) showcase and allow opening', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Modal \(Custom UI Primitive\)/i, level: 3 })).toBeInTheDocument();
    const openButton = screen.getByRole('button', { name: /Open Custom Modal/i });
    expect(openButton).toBeInTheDocument();
    fireEvent.click(openButton);
    expect(screen.getByRole('dialog', { name: /Custom Modal Title/i })).toBeInTheDocument();
  });

  it('should render Spinner (Custom UI Primitive) showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Spinner \(Custom UI Primitive\)/i, level: 3 })).toBeInTheDocument();
    const spinners = screen.getAllByRole('status');
    const defaultSpinner = spinners.find(spinner => spinner.getAttribute('aria-label') === 'Loading...');
    expect(defaultSpinner).toBeInTheDocument();
  });

  it('should render Toaster showcase', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /Toaster \(Toast Utility\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Show Info Toast/i})).toBeInTheDocument();
  });

  it('should render ChakraNextThemeSyncer and ThemeProvider conceptual showcases', () => {
    renderWithChakra(<CustomProjectComponentsShowcase />);
    expect(screen.getByRole('heading', { name: /ChakraNextThemeSyncer/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/This component synchronizes Chakra UI’s theme with Next.js/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ThemeProvider \(App Provider\)/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/This component wraps the application to provide Chakra UI and Next-Themes context/i)).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = renderWithChakra(<CustomProjectComponentsShowcase />);
    // Wait for any async operations within the showcase, like the mocked SiteFooter, to settle
    await screen.findByTestId('mock-site-footer');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});