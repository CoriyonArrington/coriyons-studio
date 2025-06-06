// src/components/navigation/__tests__/header-auth.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import AuthButton from '../header-auth'; // Corrected import path
import baseTheme from '@/src/lib/theme';
import type { User } from "@supabase/supabase-js";

interface AppActions {
  signOutAction: () => Promise<void>;
}

vi.mock('@/src/app/actions', async (importOriginal) => {
  try {
    const actual = await importOriginal<Partial<AppActions>>();
    return {
      ...actual,
      signOutAction: '/mocked-sign-out-action',
    };
  } catch (_e) {
    return {
      signOutAction: '/mocked-sign-out-action-fallback',
    };
  }
});

let mockableHasEnvVarsValue = true;
vi.mock('@/src/utils/supabase/check-env-vars', () => ({
  get hasEnvVars() { return mockableHasEnvVarsValue; }
}));

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('AuthButton Accessibility', () => {
  const mockUserNull: User | null = null;
  const mockUserPopulated = {
    id: 'test-user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
    email_confirmed_at: new Date().toISOString(), // Added to satisfy User type
    last_sign_in_at: new Date().toISOString(),   // Added
    phone: '',                                   // Added
    role: 'authenticated',                       // Added
    updated_at: new Date().toISOString(),        // Added
    identities: [],                              // Added
  } as User;

  beforeEach(() => {
    mockableHasEnvVarsValue = true;
  });

  it('should have no a11y violations when logged out (light mode)', async () => {
    const { container } = renderWithChakra(<AuthButton user={mockUserNull} />, 'light');
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations when logged out (dark mode)', async () => {
    const { container } = renderWithChakra(<AuthButton user={mockUserNull} />, 'dark');
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations when logged in (light mode)', async () => {
    const { container } = renderWithChakra(<AuthButton user={mockUserPopulated} />, 'light');
    expect(screen.getByText(/Hey, test@example.com!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations when logged in (dark mode)', async () => {
    const { container } = renderWithChakra(<AuthButton user={mockUserPopulated} />, 'dark');
    expect(screen.getByText(/Hey, test@example.com!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations when env vars are missing (light mode)', async () => {
    mockableHasEnvVarsValue = false;
    const { container } = renderWithChakra(<AuthButton user={mockUserNull} />, 'light');
    expect(screen.getByText(/Please update .env.local/i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});