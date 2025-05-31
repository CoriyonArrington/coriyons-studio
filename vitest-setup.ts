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
  href: string | object; // href can also be an object
  children: React.ReactElement; // Expects a single ReactElement child
  legacyBehavior?: boolean;
  passHref?: boolean;
  // Add other Next.js Link specific props if you use them, e.g.:
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | 'intent';
  locale?: string | false;
  [key: string]: any; // For any other HTML attributes or custom props
};

vi.mock('next/link', () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, NextLinkMockProps>((props, ref) => {
    // Destructure Next.js specific props to prevent them from being spread
    // onto the child DOM element.
    const {
      href,
      children,
      passHref,         // Consumed, not spread via htmlAnchorProps
      legacyBehavior,   // Consumed, not spread via htmlAnchorProps
      replace,          // Example: also consumed if used
      scroll,           // Example: also consumed if used
      prefetch,         // Example: also consumed if used
      locale,           // Example: also consumed if used
      ...htmlAnchorProps // Remaining props are likely intended for the anchor
    } = props;

    // The mock's job is to pass the href and other valid anchor attributes
    // to the child, letting the child render the actual <a> tag.
    // This is consistent with how passHref and legacyBehavior often work
    // with component libraries.

    if (React.isValidElement(children)) {
      const childProps: Record<string, any> = {
        // Ensure href is a string for the DOM element,
        // Next.js Link's href can be an object.
        href: typeof href === 'string' ? href : String(href),
        ...htmlAnchorProps, // Spread the remaining safe props
      };
      if (ref) { // Only add ref if it's provided
        childProps.ref = ref;
      }
      return React.cloneElement(children, childProps);
    }

    // Fallback rendering, though typically Link has a single element child.
    // This path is less common for the patterns causing the warning.
    const fallbackProps: Record<string, any> = {
      'data-mock-href': typeof href === 'string' ? href : String(href),
      ...htmlAnchorProps,
    };
    if (ref) {
      fallbackProps.ref = ref;
    }
    return React.createElement('span', fallbackProps, children);
  }),
}));