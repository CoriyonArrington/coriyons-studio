// src/components/ui/__tests__/chakra-next-theme-syncer.test.tsx
import React from 'react';
// Removed 'afterEach' from vitest import
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
// Removed 'useChakraColorModeActual' alias from @chakra-ui/react import
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// Removed 'useNextThemeActual' alias from next-themes import
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ChakraNextThemeSyncer } from '../chakra-next-theme-syncer';
import baseTheme from '@/src/lib/theme';

// Mock an object to hold current mock states
const mockState = {
  nextResolvedTheme: undefined as string | undefined,
  chakraColorMode: 'light' as 'light' | 'dark',
  mockSetChakraColorMode: vi.fn(),
};

// Mock 'next-themes'
vi.mock('next-themes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-themes')>();
  return {
    ...actual,
    useTheme: () => ({
      resolvedTheme: mockState.nextResolvedTheme,
      theme: mockState.nextResolvedTheme,
      setTheme: vi.fn(),
      themes: ['light', 'dark'],
    }),
  };
});

// Mock '@chakra-ui/react' for useColorMode
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@chakra-ui/react')>();
  return {
    ...actual,
    useColorMode: () => ({
      colorMode: mockState.chakraColorMode,
      setColorMode: mockState.mockSetChakraColorMode,
      toggleColorMode: vi.fn(),
    }),
  };
});


// A wrapper to provide necessary contexts for testing the syncer
const TestWrapper: React.FC<{ children: React.ReactNode, initialNextTheme?: string }> = ({ children, initialNextTheme = "light" }) => {
  const theme = extendTheme({
    ...baseTheme,
    config: { ...baseTheme.config, initialColorMode: mockState.chakraColorMode, useSystemColorMode: false },
  });

  return (
    <NextThemesProvider attribute="class" defaultTheme={initialNextTheme}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </NextThemesProvider>
  );
};


describe('ChakraNextThemeSyncer', () => {
  beforeEach(() => {
    mockState.nextResolvedTheme = undefined;
    mockState.chakraColorMode = 'light';
    mockState.mockSetChakraColorMode.mockClear();
  });

  it('should call Chakra UI setColorMode when next-themes resolves to dark and Chakra is light', () => {
    mockState.nextResolvedTheme = 'dark';
    mockState.chakraColorMode = 'light';

    render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });

    expect(mockState.mockSetChakraColorMode).toHaveBeenCalledWith('dark');
  });

  it('should call Chakra UI setColorMode when next-themes resolves to light and Chakra is dark', () => {
    mockState.nextResolvedTheme = 'light';
    mockState.chakraColorMode = 'dark';

    render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });

    expect(mockState.mockSetChakraColorMode).toHaveBeenCalledWith('light');
  });

  it('should NOT call Chakra UI setColorMode if themes are already in sync (dark)', () => {
    mockState.nextResolvedTheme = 'dark';
    mockState.chakraColorMode = 'dark';

    render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });

    expect(mockState.mockSetChakraColorMode).not.toHaveBeenCalled();
  });

  it('should NOT call Chakra UI setColorMode if themes are already in sync (light)', () => {
    mockState.nextResolvedTheme = 'light';
    mockState.chakraColorMode = 'light';

    render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });

    expect(mockState.mockSetChakraColorMode).not.toHaveBeenCalled();
  });
  
  it('should NOT call Chakra UI setColorMode if next-themes resolvedTheme is initially undefined', () => {
    mockState.nextResolvedTheme = undefined;
    mockState.chakraColorMode = 'light';
    
    render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });
    
    expect(mockState.mockSetChakraColorMode).not.toHaveBeenCalled();
  });

  it('should react to changes in resolvedTheme from next-themes', () => {
    mockState.nextResolvedTheme = 'light';
    mockState.chakraColorMode = 'light';

    const { rerender } = render(<ChakraNextThemeSyncer />, { wrapper: TestWrapper });
    expect(mockState.mockSetChakraColorMode).not.toHaveBeenCalled();

    act(() => {
      mockState.nextResolvedTheme = 'dark';
    });
    rerender(<ChakraNextThemeSyncer />);
    
    expect(mockState.mockSetChakraColorMode).toHaveBeenCalledWith('dark');
  });
});