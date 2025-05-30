// vitest-setup.ts
import React, { type ReactNode, type Ref, type ComponentPropsWithoutRef } from 'react';
import { expect, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom/vitest';

// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;

expect.extend(toHaveNoViolations);

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

// Props for the NextLink mock.
type NextLinkMockProps = {
  href: string;
  children: React.ReactElement; // Expects a single ReactElement child
  legacyBehavior?: boolean; 
  passHref?: boolean;      
  [key: string]: any; 
};

vi.mock('next/link', () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, NextLinkMockProps>((props, ref) => {
    const { href, children, ...rest } = props;
    // This mock clones the child (e.g., ChakraLink or Button as="a") 
    // and passes NextLink's props (like href) to it.
    // The child component is then responsible for rendering the actual <a> tag.
    // This avoids the mock itself creating an <a> tag, preventing nesting.
    if (React.isValidElement(children)) {
        // @ts-ignore - ref can be spread if the child accepts it
        return React.cloneElement(children, { href, ref, ...rest });
    }
    // Fallback, though <Link> usually has a single element child.
    // @ts-ignore
    return React.createElement('span', { ref, 'data-mock-href': href, ...rest }, children);
  }),
}));