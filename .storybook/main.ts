// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',  // ✅ Adds Docs, Controls, Actions, Viewport, Backgrounds, Toolbars
    '@storybook/addon-a11y',        // ✅ Adds Accessibility tab
    '@storybook/addon-interactions' // ✅ Enables interaction testing if you add later
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
};

export default config;
