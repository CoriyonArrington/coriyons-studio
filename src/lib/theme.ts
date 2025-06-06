// src/lib/theme.ts

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools';

// 🎨 Color palette using CSS variables from globals.css (:root)
// These allow dynamic theming and HSL flexibility (like Tailwind)
const colors = {
  background: 'hsl(var(--background))',             // Figma: page background
  foreground: 'hsl(var(--foreground))',             // Figma: primary text
  border: 'hsl(var(--border))',                     // Figma: divider lines or subtle outlines
  input: 'hsl(var(--input))',                       // Figma: input background
  ring: 'hsl(var(--ring))',                         // Figma: focus ring color

  // ✅ Primary brand color for CTAs, links, key actions
  primary: {
    DEFAULT: 'hsl(var(--primary))',                 // Figma: green #2FB67C
    foreground: 'hsl(var(--primary-foreground))',   // Figma: white #FFFFFF
  },

  // Secondary brand usage (e.g., less prominent buttons or accents)
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },

  // Destructive actions (e.g., delete, error states)
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },

  // Muted surfaces (e.g., subtle cards, side panels)
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },

  // Accents (tags, callouts, interactive UI)
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },

  // Popover/tooltip surfaces
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },

  // Card surfaces (used for visual grouping, UI modules)
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },

  // Chart token colors (optional for data viz theming)
  chart: {
    '1': 'hsl(var(--chart-1))',
    '2': 'hsl(var(--chart-2))',
    '3': 'hsl(var(--chart-3))',
    '4': 'hsl(var(--chart-4))',
    '5': 'hsl(var(--chart-5))',
  },
};

// 🧱 Radius system using dynamic CSS variable (--radius)
const radii = {
  sm: 'calc(var(--radius) - 4px)', // For small UI: pills, badges
  md: 'calc(var(--radius) - 2px)', // For inputs, form fields
  lg: 'var(--radius)',             // For cards, modals, buttons
};

// 🌗 Theme config for respecting system preference
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

// 📐 Full theme extension: colors, fonts, global styles, components
const chakraTheme = extendTheme({
  config,
  colors,
  radii,

  // 🔤 Font tokens pulled via CSS vars (defined in globals.css or Tailwind theme)
  fonts: {
    heading: 'var(--font-montserrat), sans-serif',      // Figma: Montserrat
    body: 'var(--font-nunito-sans), sans-serif',        // Figma: Nunito Sans
  },

  // 🌍 Global styles fallback (mostly handled by Tailwind already)
  styles: {
    global: (_props: StyleFunctionProps) => ({
      body: {
        // Optional: handled by Tailwind's base layer or globals.css
      },
    }),
  },

  // 🧩 Component-level customizations
  components: {
    Button: {
      variants: {
        themedOutline: (props: StyleFunctionProps) => ({
          border: '1px solid',
          bg: 'transparent',
          borderColor: mode(colors.border, 'whiteAlpha.500')(props),
          color: mode(colors.foreground, 'whiteAlpha.900')(props),
          _hover: {
            bg: mode('gray.100', 'white')(props),
            borderColor: mode(colors.primary.DEFAULT, 'gray.200')(props),
            color: mode(colors.primary.DEFAULT, 'black')(props),
          },
          _focus: {
            borderColor: mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props),
            boxShadow: `0 0 0 1px ${mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props)}`,
          },
          _active: {
            bg: mode('gray.200', 'gray.50')(props),
            borderColor: mode(colors.primary.DEFAULT, 'gray.300')(props),
            color: mode(colors.primary.DEFAULT, 'black')(props),
          },
        }),
      },
    },

    Menu: {
      baseStyle: (props: StyleFunctionProps) => ({
        list: {
          bg: mode(colors.popover.DEFAULT, 'black')(props),
          color: mode(colors.popover.foreground, colors.popover.foreground)(props),
          borderWidth: '1px',
          borderColor: mode(colors.border, colors.border)(props),
          boxShadow: mode('md', 'dark-lg')(props),
        },
        item: {
          bg: mode('transparent', 'black')(props),
          color: mode(colors.popover.foreground, colors.popover.foreground)(props),
          _hover: {
            bg: mode('gray.100', 'white')(props),
            color: mode(colors.popover.foreground, 'black')(props),
          },
          _focus: {
            bg: mode('gray.100', 'white')(props),
            color: mode(colors.popover.foreground, 'black')(props),
          },
          _active: {
            bg: mode('gray.200', 'gray.50')(props),
            color: mode(colors.popover.foreground, 'black')(props),
          },
          _checked: {
            bg: mode('blue.50', 'blue.700')(props),
            color: mode('blue.600', 'white')(props),
          },
        },
      }),
    },
  },
});

export default chakraTheme;
