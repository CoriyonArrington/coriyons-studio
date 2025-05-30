// src/components/layout/site-header.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import SiteHeader from './site-header';
import baseTheme from '@/src/lib/theme';
import type { User } from "@supabase/supabase-js";

// Define what the actual module might export for better typing
interface AppActions {
  signOutAction: () => Promise<void>; // Assuming original is an async function
  // If there are other known exports, list them.
  // To avoid 'any' error, if only mocking signOutAction and spreading rest,
  // you can type `actual` as `Record<string, unknown>` or be more specific.
}

// Refined mock for server actions
vi.mock('@/app/actions', async (importOriginal) => {
  try {
    const actual = await importOriginal<Partial<AppActions>>(); // Use Partial<AppActions>
    return {
      ...actual,
      signOutAction: '/mocked-sign-out-action', 
    };
  } catch (_e) { // Prefix 'e' with '_'
    // console.error("Failed to import original @/app/actions for mocking (SiteHeader test):", _e);
    return {
      signOutAction: '/mocked-sign-out-action-fallback',
    };
  }
});

let mockableHasEnvVarsValue_SiteHeaderTest = true;
vi.mock('@/src/utils/supabase/check-env-vars', async () => {
  // No 'any' here, so it should be fine.
  const actual = await vi.importActual('@/src/utils/supabase/check-env-vars') as object;
  return {
    ...actual,
    get hasEnvVars() { return mockableHasEnvVarsValue_SiteHeaderTest; }
  };
});


const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('SiteHeader Accessibility', () => {
  const mockUserNull: User | null = null;
  const mockUserPopulated = {
    id: 'test-user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
  } as User;

  beforeEach(() => {
    mockableHasEnvVarsValue_SiteHeaderTest = true;
  });

  it('should have no a11y violations in light mode when user is logged out', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserNull} />, 'light');
    expect(screen.getByText('YourLogo')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode when user is logged out', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserNull} />, 'dark');
    expect(screen.getByText('YourLogo')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in light mode when user is logged in', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserPopulated} />, 'light');
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode when user is logged in', async () => {
    const { container } = renderWithChakra(<SiteHeader user={mockUserPopulated} />, 'dark');
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});