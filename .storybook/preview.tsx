// .storybook/preview.tsx

import * as React from 'react';
import type { Preview } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useGlobals } from '@storybook/preview-api';
import chakraTheme from '../src/lib/theme';
import '../src/app/globals.css';

// ✅ Decorator 1: Chakra UI theme wrapper
const withChakra = (Story: React.FC) => (
  <ChakraProvider theme={chakraTheme}>
    <Story />
  </ChakraProvider>
);

// ✅ Decorator 2: Dynamically toggle Tailwind `.dark` class
const withTailwindDarkMode = (Story: React.FC) => {
  const [{ backgrounds }] = useGlobals();

  useEffect(() => {
    const isDark = backgrounds?.value === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [backgrounds]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withChakra, withTailwindDarkMode],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },        // Your light mode background
        { name: 'dark', value: '#0f172a' },         // Your dark mode token: --background (slate-900)
      ],
    },
    a11y: {
      disable: false,
      manual: false,
      context: '#storybook-root',
    },
  },
};

export default preview;
