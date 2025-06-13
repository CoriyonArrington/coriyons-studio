// .storybook/preview.tsx

import React from 'react';
// 👇 1. Use the original, correct import for Preview from '@storybook/react'
import type { Preview } from '@storybook/react';

// Import the providers and fonts used in your app's layout
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { montserrat, nunito_sans } from '../src/lib/fonts';
import chakraTheme from '../src/lib/theme';
import '../src/app/globals.css';

// Decorator to apply your app's fonts
const withFonts = (Story: React.FC) => (
  <div className={`${montserrat.variable} ${nunito_sans.variable}`}>
    <Story />
  </div>
);

// Decorator for the Next.js Theme Provider
const withNextThemes = (Story: React.FC) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <Story />
  </NextThemesProvider>
);

// Decorator for the Chakra Provider
const withChakra = (Story: React.FC) => (
  <ChakraProvider theme={chakraTheme}>
    <Story />
  </ChakraProvider>
);

// 👇 2. Define the preview object using the simpler 'Preview' type
const preview: Preview = {
  // Apply decorators in order: fonts -> next-themes -> chakra
  decorators: [withFonts, withNextThemes, withChakra],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // The "backgrounds" addon is no longer needed for theme switching
    backgrounds: {
      disable: true,
    },
    a11y: {
      disable: false,
      manual: false,
      context: '#storybook-root',
    },
  },
};

export default preview;