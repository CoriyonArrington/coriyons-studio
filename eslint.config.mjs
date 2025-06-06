// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc"; //
import path from "node:path"; //
import { fileURLToPath } from "node:url"; //
import tseslint from "typescript-eslint"; //
// It's good practice to ensure @next/eslint-plugin-next is available,
// though compat.extends often handles it.
// import eslintPluginNext from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url); //
const __dirname = path.dirname(__filename); //

const compat = new FlatCompat({ //
  baseDirectory: __dirname, //
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = tseslint.config(
  // 1. Global ignores
  {
    ignores: [ //
      "node_modules/**", //
      ".next/**", //
      "out/**",
      "dist/**",
      // Add any build/dist folders if needed
    ],
  },

  // 2. TypeScript specific configurations from tseslint
  // These enable type-aware linting rules.
  // 'strictTypeChecked' includes 'stylisticTypeChecked' and 'recommendedTypeChecked'.
  ...tseslint.configs.strictTypeChecked, // Using strictTypeChecked for comprehensive checks.

  // 3. Parser options for type-aware linting.
  // This tells typescript-eslint where to find your tsconfig.json.
  {
    languageOptions: {
      parserOptions: {
        project: true, // Autodetect tsconfig.json
        tsconfigRootDir: __dirname, // Set to project root where tsconfig.json is
      },
    },
  },

  // 4. Next.js recommended rules (core-web-vitals) via compatibility layer
  // Ensure these apply broadly or to specific Next.js files as intended.
  ...compat.extends("next/core-web-vitals").map(config => ({ //
    ...config,
    files: ["src/**/*.{js,jsx,ts,tsx}", "*.{js,mjs,cjs,ts}"], // Apply to relevant files
    // If you face issues with the Next.js plugin not loading,
    // you might need to explicitly add it:
    // plugins: {
    //   ...config.plugins,
    //   '@next/next': eslintPluginNext,
    // }
  })),

  // 5. Custom rules and overrides for your project files in src/
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"], //
    // Plugins like "@typescript-eslint" are typically already set up by tseslint.configs.*
    rules: {
      // Your existing @typescript-eslint/no-unused-vars rule
      "@typescript-eslint/no-unused-vars": [ //
        "warn",
        {
          vars: "all", //
          args: "after-used", //
          ignoreRestSiblings: true, //
          varsIgnorePattern: "^_", //
          argsIgnorePattern: "^_", //
          caughtErrorsIgnorePattern: "^_", //
        },
      ],
      // Your existing no-restricted-syntax rule for colors
      "no-restricted-syntax": [ //
        "warn",
        {
          selector:
            "JSXAttribute[name.name=/^(color|bg|backgroundColor|borderColor|fill|stroke|bgColor|emptyColor)$/] > Literal[value=/^#([0-9a-fA-F]{3,4}){1,2}$|^(rgb|hsl)a?\\s*\\(|^(red|blue|green|yellow|black|white|purple|orange|cyan|magenta|lime|pink|teal|lavender|brown|beige|maroon|navy|olive|silver|gold)$/i]", //
          message:
            "Avoid using literal color values. Use theme tokens from Chakra UI instead (e.g., 'primary.DEFAULT', 'border', 'foreground', 'red.500').", //
        },
      ],
      // Your existing override for Next.js rule
      "@next/next/no-duplicate-head": "off", //

      // Consider adding more type-aware rules if not covered by strictTypeChecked,
      // or to adjust severity:
      // "@typescript-eslint/no-floating-promises": "error",
      // "@typescript-eslint/no-misused-promises": "error",
      // Example: If strictTypeChecked is too noisy for a specific rule:
      // "@typescript-eslint/no-unsafe-assignment": "warn",
    },
  },

  // 6. Specific rules for configuration files (optional)
  {
    files: ["eslint.config.mjs", "next.config.mjs", "postcss.config.js", "tailwind.config.ts", "vitest.config.ts"], //
    // No specific rule changes needed here based on original config.
    rules: { //
        // If you use CommonJS `require` in JS config files:
        // "@typescript-eslint/no-var-requires": "off",
    },
  }
);

export default eslintConfig; //