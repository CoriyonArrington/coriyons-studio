// lib/theme.ts
import {
  createSystem,
  defaultConfig, // This is Chakra's base theme configuration + recipes
  type SystemContext,
} from "@chakra-ui/react"; // Or import createSystem, SystemContext from '@chakra-ui/system'
                           // and defaultConfig from '@chakra-ui/react'

// Your custom token definitions remain the same
const yourFoundations = {
  tokens: { // This 'tokens' key is part of your custom structure for organization
    colors: {
      border: { value: "var(--border)" }, input: { value: "var(--input)" }, ring: { value: "var(--ring)" },
      background: { value: "var(--background)" }, foreground: { value: "var(--foreground)" },
      primary: { "500": { value: "var(--primary)" }, foreground: { value: "var(--primary-foreground)" } },
      secondary: { "500": { value: "var(--secondary)" }, foreground: { value: "var(--secondary-foreground)" } },
      destructive: { "500": { value: "var(--destructive)" }, foreground: { value: "var(--destructive-foreground)" } },
      success: { "500": { value: "var(--success)" }, foreground: { value: "var(--success-foreground)" } },
      muted: { "500": { value: "var(--muted)" }, foreground: { value: "var(--muted-foreground)" } },
      accent: { "500": { value: "var(--accent)" }, foreground: { value: "var(--accent-foreground)" } },
      popover: { "500": { value: "var(--popover)" }, foreground: { value: "var(--popover-foreground)" } },
      card: { "500": { value: "var(--card)" }, foreground: { value: "var(--card-foreground)" } },
    },
    fonts: {
      body: { value: "var(--font-nunito-sans)" }, heading: { value: "var(--font-montserrat)" },
    },
    space: {
      "1": { value: "0.25rem" }, "2": { value: "0.5rem" }, "3": { value: "0.75rem" }, "4": { value: "1rem" },
      "5": { value: "1.25rem" }, "6": { value: "1.5rem" }, "7": { value: "1.75rem" }, "8": { value: "2rem" },
      "9": { value: "2.25rem" }, "10": { value: "2.5rem" }, "11": { value: "2.75rem" }, "12": { value: "3rem" },
      "14": { value: "3.5rem" }, "16": { value: "4rem" }, "18": { value: "4.5rem" }, "20": { value: "5rem" },
      "22": { value: "5.5rem" }, "24": { value: "6rem" }, "26": { value: "6.5rem" }, "28": { value: "7rem" },
      "30": { value: "7.5rem" },
    },
    radii: {
      lg: { value: "var(--radius)" }, md: { value: "calc(var(--radius) - 2px)" }, sm: { value: "calc(var(--radius) - 4px)" },
    },
    // Add other token categories like sizes, zIndices etc. under yourFoundations.tokens if needed
  },
  // semanticTokens: { colors: { ... } } // Your semantic tokens if any
};

// Create the theme using defaultConfig and structuring overrides as seen in sandboxes
const chakraTheme: SystemContext = createSystem(defaultConfig, {
  // The second argument to createSystem is an "extension" config.
  // Custom tokens are nested under `theme.tokens` here.
  theme: {
    tokens: yourFoundations.tokens, // Your colors, fonts, space, radii
    // semanticTokens: yourFoundations.semanticTokens, // Your semantic tokens
    // You can also add/override other theme scales like textStyles, layerStyles here
    // textStyles: { h1: { fontSize: '2xl', fontWeight: 'bold' } },
  },
  // components: { /* Your component style overrides (recipes) if any */ },
  // globalCss: { /* Global styles if this structure supports it, TBD */ }
});

export default chakraTheme;