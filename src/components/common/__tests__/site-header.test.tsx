// ATTEMPT 1: Applying our standard fixes for test files.
// - Used `extendTheme` idiomatically to resolve the unsafe assignment.
// - Added fallbacks to template literals to handle potentially undefined values.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SiteHeader from '../site-header';
import baseTheme from '@/src/lib/theme';
import type { User } from "@supabase/supabase-js";

// Mock NextLink
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    passHref,
    legacyBehavior,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    passHref?: boolean;
    legacyBehavior?: boolean;
    [key: string]: unknown;
  }) => {
    if (React.isValidElement(children) && React.Children.count(children) === 1) {
        return React.cloneElement(children as React.ReactElement, { href, ...props });
    }
    return <a href={href} {...props}>{children}</a>;
  }
}));

vi.mock('../../navigation/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="mock-theme-switcher">ThemeSwitcher</div>,
}));
vi.mock('../../navigation/header-auth', () => ({
  default: ({ user }: { user?: User | null }) => (
    <div data-testid="mock-auth-button">
      {/* FIX: Added fallback for potentially undefined email. */}
      {user ? `User: ${user.email || ''}` : 'No User'}
    </div>
  ),
}));

let currentMockHasEnvVars = true;
vi.mock('@/src/utils/supabase/check-env-vars', () => ({
  get hasEnvVars() { return currentMockHasEnvVars; }
}));

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  // FIX: Pass theme objects as separate arguments instead of using the spread operator.
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

describe('SiteHeader Accessibility', () => {
  const mockUserNull: User | null = null;
  const mockUserPopulated: User = {
    id: 'test-user-id',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Test User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    phone: '',
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [{
      identity_id: 'test-identity-id',
      id: 'test-user-id',
      user_id: 'test-user-id',
      identity_data: {},
      provider: 'email',
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }],
  };

  beforeEach(() => {
    currentMockHasEnvVars = true;
  });

  it('should have no a11y violations in light mode when user is logged out', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserNull} />, 'light');
    const logoHeading = screen.getByRole('heading', { name: /coriyon's studio/i, level: 2 });
    expect(logoHeading).toBeInTheDocument();
    expect(logoHeading).toHaveAttribute('href', '/');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode when user is logged out', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserNull} />, 'dark');
    const logoHeading = screen.getByRole('heading', { name: /coriyon's studio/i, level: 2 });
    expect(logoHeading).toBeInTheDocument();
    expect(logoHeading).toHaveAttribute('href', '/');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in light mode when user is logged in', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserPopulated} />, 'light');
    // FIX: Added fallback for potentially undefined email.
    expect(screen.getByTestId('mock-auth-button')).toHaveTextContent(`User: ${mockUserPopulated.email || ''}`);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode when user is logged in', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserPopulated} />, 'dark');
    // FIX: Added fallback for potentially undefined email.
    expect(screen.getByTestId('mock-auth-button')).toHaveTextContent(`User: ${mockUserPopulated.email || ''}`);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});