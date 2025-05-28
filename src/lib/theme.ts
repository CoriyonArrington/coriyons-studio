// src/lib/theme.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// 1. Define colors mapping to your CSS variables from globals.css
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
  destructive: {
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
  chart: { // Chart colors from your globals.css
    '1': 'hsl(var(--chart-1))',
    '2': 'hsl(var(--chart-2))',
    '3': 'hsl(var(--chart-3))',
    '4': 'hsl(var(--chart-4))',
    '5': 'hsl(var(--chart-5))',
  }
};

// 2. Define border radii mapping from your globals.css --radius
const radii = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
};

// 3. Chakra UI theme configuration for color mode synchronization
const config: ThemeConfig = {
  initialColorMode: 'system', // Respect system preference
  useSystemColorMode: true,   // Sync with system/next-themes changes
};

// 4. Extend the base Chakra UI theme with your customizations
const chakraTheme = extendTheme({
  config,
  colors,
  radii,
  styles: {
    global: {
      // Your globals.css already applies base background, text, and border colors via Tailwind.
      // If you need Chakra components to specifically use these by default without prop passing,
      // you can add styles here. For example:
      // '*, ::before, ::after': {
      //    borderColor: 'border', // This will use hsl(var(--border))
      // },
      // Given your `* { @apply border-border; }` in globals.css, this might be redundant
      // or you might choose to manage all borders via Tailwind utilities.
    },
  },
  // Optional: Further customize default styles for specific Chakra components
  components: {
    // Example: Making default Button use your primary colors and themed radius
    // Button: {
    //   baseStyle: {
    //     borderRadius: 'lg', // Uses your themed 'lg' radius (var(--radius))
    //   },
    //   variants: {
    //     solid: { // For the default solid button variant
    //       bg: 'primary.DEFAULT',
    //       color: 'primary.foreground',
    //       _hover: {
    //         // Define hover state, e.g., slightly darken/lighten primary.DEFAULT
    //         // For HSL, you might adjust lightness or alpha.
    //         // This is a placeholder; actual hover color would depend on desired effect.
    //         bg: 'primary.DEFAULT', // Replace with actual hover color logic if needed
    //         opacity: 0.85,
    //       },
    //     },
    //   },
    // },
  },
});

export default chakraTheme;