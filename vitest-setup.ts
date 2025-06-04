// vitest-setup.ts

// 1) Immediately patch console.error to ignore act() warnings:
const _origError = console.error;
console.error = (...args: any[]) => {
  const msg = typeof args[0] === 'string' ? (args[0] as string) : '';
  if (
    msg.includes('not wrapped in act') ||
    msg.includes('not configured to support act')
  ) {
    return;
  }
  _origError(...args);
};

// 2) Now import everything else as before:
;(global as any).IS_REACT_ACT_ENVIRONMENT = true;

import React from 'react';
import 'react-dom/test-utils';             // registers act()
import '@testing-library/react';           // patches act() for RTL
import '@testing-library/jest-dom/vitest'; // jest-dom matchers

import { expect, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Mock window.matchMedia (Chakra, etc.)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Next.js Link
type NextLinkMockProps = {
  href: string | object;
  children: React.ReactElement;
  legacyBehavior?: boolean;
  passHref?: boolean;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | 'intent';
  locale?: string | false;
  [key: string]: any;
};

vi.mock('next/link', () => {
  const NextLinkMock = React.forwardRef<HTMLAnchorElement, NextLinkMockProps>((props, ref) => {
    const {
      href,
      children,
      passHref,
      legacyBehavior,
      replace,
      scroll,
      prefetch,
      locale,
      ...htmlAnchorProps
    } = props;

    if (React.isValidElement(children)) {
      const childProps: Record<string, any> = {
        href: typeof href === 'string' ? href : String(href),
        ...htmlAnchorProps,
      };
      if (ref) childProps.ref = ref;
      return React.cloneElement(children, childProps);
    }

    const fallbackProps: Record<string, any> = {
      'data-mock-href': typeof href === 'string' ? href : String(href),
      ...htmlAnchorProps,
    };
    if (ref) fallbackProps.ref = ref;
    return React.createElement('span', fallbackProps, children);
  });

  NextLinkMock.displayName = 'NextLinkMock';

  return {
    __esModule: true,
    default: NextLinkMock,
  };
});
