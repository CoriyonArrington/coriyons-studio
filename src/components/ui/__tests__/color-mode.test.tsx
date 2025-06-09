// ATTEMPT 1: Removing deprecated `act` calls.
// - Removed the explicit `act()` wrappers. The `renderHook` utility from
//   React Testing Library handles wrapping state updates automatically.

import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
// FIX: Removed deprecated `act` import.
import { renderHook } from '@testing-library/react';
import { useColorMode, useColorModeValue } from '../color-mode';
import { useTheme as useNextTheme } from 'next-themes';

// Mock the underlying 'next-themes' hook
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Cast the mock for type safety
const mockedUseNextTheme = useNextTheme as Mock;

describe('Color Mode Hooks', () => {
  describe('useColorMode', () => {
    it('should return correct colorMode and toggle correctly', () => {
      const setTheme = vi.fn();
      mockedUseNextTheme.mockReturnValue({ resolvedTheme: 'light', setTheme });

      const { result } = renderHook(() => useColorMode());

      expect(result.current.colorMode).toBe('light');

      // FIX: Removed the `act()` wrapper.
      result.current.toggleColorMode();

      expect(setTheme).toHaveBeenCalledWith('dark');
    });

    it('should set color mode directly', () => {
      const setTheme = vi.fn();
      mockedUseNextTheme.mockReturnValue({ resolvedTheme: 'light', setTheme });

      const { result } = renderHook(() => useColorMode());

      // FIX: Removed the `act()` wrapper.
      result.current.setColorMode('dark');

      expect(setTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('useColorModeValue', () => {
    it('should return the light value in light mode', () => {
      mockedUseNextTheme.mockReturnValue({ resolvedTheme: 'light', setTheme: vi.fn() });
      const { result } = renderHook(() => useColorModeValue('light-value', 'dark-value'));
      expect(result.current).toBe('light-value');
    });

    it('should return the dark value in dark mode', () => {
      mockedUseNextTheme.mockReturnValue({ resolvedTheme: 'dark', setTheme: vi.fn() });
      const { result } = renderHook(() => useColorModeValue('light-value', 'dark-value'));
      expect(result.current).toBe('dark-value');
    });
  });
});