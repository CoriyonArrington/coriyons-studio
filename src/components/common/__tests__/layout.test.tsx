// src/components/common/__tests__/layout.test.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import Layout from '../layout'; 
import baseTheme from '@/src/lib/theme'; 
import type { User } from "@supabase/supabase-js"; // Ensure User type is imported

// Mock SiteHeader and SiteFooter
vi.mock('../site-header', () => ({
  default: ({ user }: { user?: User | null }) => ( // Use the actual User type here for the prop
    <header>
      Mocked SiteHeader {user ? `(User: ${user.email})` : '(No User)'}
    </header>
  ),
}));

vi.mock('../site-footer', () => ({
  default: () => <footer>Mocked SiteFooter</footer>,
}));

const renderWithChakra = (ui: React.ReactElement, colorMode: 'light' | 'dark' = 'light') => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: colorMode, useSystemColorMode: false },
  });
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('Layout Component', () => {
  const childText = 'Main Content Area';
  
  // Corrected mockUser to align with the Supabase User type
  const mockUser: User = {
    id: 'test-user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'test@example.com', // Your existing email
    // Add any other required fields from the User type with appropriate mock values
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    phone: '', // Or a mock phone number
    role: 'authenticated', // Or a mock role
    updated_at: new Date().toISOString(),
  };

  it('should render SiteHeader, children, and SiteFooter', () => {
    renderWithChakra(
      <Layout user={mockUser}>
        <div>{childText}</div>
      </Layout>
    );
    expect(screen.getByText(`Mocked SiteHeader (User: ${mockUser.email})`)).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
    expect(screen.getByText('Mocked SiteFooter')).toBeInTheDocument();
  });

  it('should render correctly without a user prop', () => {
    renderWithChakra(
      <Layout> {/* user prop is optional in Layout component, so this is fine */}
        <div>{childText}</div>
      </Layout>
    );
    expect(screen.getByText('Mocked SiteHeader (No User)')).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
    expect(screen.getByText('Mocked SiteFooter')).toBeInTheDocument();
  });

  it('should have no a11y violations in light mode', async () => {
    const { container } = renderWithChakra(
      <Layout user={mockUser}>
        <div>{childText}</div>
      </Layout>,
      'light'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations in dark mode', async () => {
    const { container } = renderWithChakra(
      <Layout user={mockUser}>
        <div>{childText}</div>
      </Layout>,
      'dark'
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});