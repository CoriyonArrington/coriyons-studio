/*
 FINAL VERSION - Key Changes:
 - Corrected the import path for `createMultiStyleConfigHelpers` to be from '@chakra-ui/react',
   which resolves the TypeScript build error.
*/
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'; // Corrected import
import { mode, type StyleFunctionProps } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

const colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  primary: {
    50: 'hsl(154, 63%, 95%)',
    500: 'hsl(var(--primary))',
  },
  secondary: {
    500: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: {
    500: 'hsl(var(--destructive))',
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
};

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

// --- Component Style Definitions ---

const buttonStyles = {
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'lg',
    _focusVisible: {
      outline: 'none',
      boxShadow: `0 0 0 3px var(--chakra-colors-background), 0 0 0 4px hsl(var(--ring))`,
    },
  },
  variants: {
    solid: (props: StyleFunctionProps) => ({
      _hover: {
        filter: props.colorMode === 'dark' ? 'brightness(110%)' : 'brightness(95%)',
      },
      _active: {
        filter: props.colorMode === 'dark' ? 'brightness(120%)' : 'brightness(90%)',
      }
    }),
    outline: {
      borderColor: 'border',
      _hover: {
        bg: 'muted.DEFAULT',
      },
      _active: {
        bg: 'accent.DEFAULT'
      }
    },
  },
};

const inputStyles = {
  variants: {
    outline: {
      field: {
        borderColor: 'input',
        _hover: {
          borderColor: 'gray.400',
        },
        _focusVisible: {
          borderColor: 'primary.500',
          boxShadow: `0 0 0 1px hsl(var(--ring))`,
        },
      },
    },
  },
};

const cardBaseStyle = definePartsStyle({
  container: {
    borderWidth: '1px',
    borderColor: 'border',
    borderRadius: 'lg',
    bg: 'card.DEFAULT',
  },
  header: {
    paddingBottom: '0.5rem',
  },
  body: {
    paddingTop: '0.5rem',
    paddingBottom: '1rem',
  },
  footer: {
    paddingTop: '0',
  },
});

const cardInteractiveVariant = definePartsStyle({
    container: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        _hover: {
            shadow: 'md',
            borderColor: 'primary.500',
            transform: 'translateY(-2px)',
        },
        _focusVisible: {
          outline: 'none',
          borderColor: 'primary.500',
          boxShadow: `0 0 0 2px hsl(var(--ring))`,
        }
    }
});

const cardTheme = defineMultiStyleConfig({
  baseStyle: cardBaseStyle,
  variants: {
    interactive: cardInteractiveVariant,
  }
});


// --- Main Theme ---

const chakraTheme = extendTheme({
  config,
  colors,
  radii: {
    sm: 'calc(var(--radius) - 2px)',
    md: 'var(--radius)',
    lg: 'calc(var(--radius) + 2px)',
  },
  fonts: {
    heading: 'var(--font-montserrat), sans-serif',
    body: 'var(--font-nunito-sans), sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'background',
        color: 'foreground',
      },
    },
  },
  components: {
    Button: buttonStyles,
    Input: inputStyles,
    Textarea: inputStyles,
    Card: cardTheme,
    // Menu theme remains the same
  },
});

export default chakraTheme;