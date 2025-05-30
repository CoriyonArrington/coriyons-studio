// src/lib/theme.ts

// Test Details for Menu component dark mode (2025-05-28 16:50 CDT) - ESLint unused 'props' fix (2025-05-28 17:45 CDT)
// - Issue: ESLint warning: 'props' is defined but never used in styles.global.
// - Solution: Renamed 'props' to '_props' in the global style function definition.

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools';

const colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: { // Added destructive color
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  chart: {
    '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))',
    '3': 'hsl(var(--chart-3))', '4': 'hsl(var(--chart-4))',
    '5': 'hsl(var(--chart-5))',
  },
};

const radii = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const chakraTheme = extendTheme({
  config,
  colors,
  radii,
  fonts: {
    heading: 'var(--font-montserrat), sans-serif',
    body: 'var(--font-nunito-sans), sans-serif',
  },
  styles: {
    global: (_props: StyleFunctionProps) => ({
      body: { /* Already handled by globals.css or can be themed here if needed */ },
    }),
  },
  components: {
    Button: {
      variants: {
        "themedOutline": (props: StyleFunctionProps) => ({
          border: "1px solid",
          bg: "transparent",
          borderColor: mode(colors.border, "whiteAlpha.500")(props),
          color: mode(colors.foreground, "whiteAlpha.900")(props),
          _hover: {
            bg: mode("gray.100", "white")(props),
            borderColor: mode(colors.primary.DEFAULT, "gray.200")(props),
            color: mode(colors.primary.DEFAULT, "black")(props),
          },
          _focus: {
            borderColor: mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props),
            boxShadow: `0 0 0 1px ${mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props)}`,
          },
          _active: {
            bg: mode("gray.200", "gray.50")(props),
            borderColor: mode(colors.primary.DEFAULT, "gray.300")(props),
            color: mode(colors.primary.DEFAULT, "black")(props),
          }
        }),
      },
    },
    Menu: {
      baseStyle: (props: StyleFunctionProps) => ({
        list: {
          bg: mode(colors.popover.DEFAULT, "black")(props),
          color: mode(colors.popover.foreground, colors.popover.foreground)(props),
          borderWidth: "1px",
          borderColor: mode(colors.border, colors.border)(props),
          boxShadow: mode("md", "dark-lg")(props),
        },
        item: {
          bg: mode("transparent", "black")(props),
          color: mode(colors.popover.foreground, colors.popover.foreground)(props),
          _hover: {
            bg: mode("gray.100", "white")(props),
            color: mode(colors.popover.foreground, "black")(props),
          },
          _focus: {
            bg: mode("gray.100", "white")(props),
            color: mode(colors.popover.foreground, "black")(props),
          },
          _active: {
            bg: mode("gray.200", "gray.50")(props),
            color: mode(colors.popover.foreground, "black")(props),
          },
          _checked: {
             bg: mode("blue.50", "blue.700")(props),
             color: mode("blue.600", "white")(props),
          }
        },
      }),
    },
  },
});

export default chakraTheme;