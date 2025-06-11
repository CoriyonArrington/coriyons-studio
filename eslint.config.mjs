// eslint.config.mjs

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";
// import eslintPluginNext from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = tseslint.config(
  // 1. Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      // FIX: Add auto-generated Supabase types files to the ignore list
      "src/types/supabase.ts",
      "src/types/supabase.gen.ts",
    ],
  },

  // 2. TypeScript specific configurations from tseslint
  ...tseslint.configs.strictTypeChecked,

  // 3. Parser options for type-aware linting.
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 4. Next.js recommended rules
  ...compat.extends("next/core-web-vitals").map(config => ({
    ...config,
    files: ["src/**/*.{js,jsx,ts,tsx}", "*.{js,mjs,cjs,ts}"],
  })),

  // 5. Custom rules and overrides for your project files
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "JSXAttribute[name.name=/^(color|bg|backgroundColor|borderColor|fill|stroke|bgColor|emptyColor)$/] > Literal[value=/^#([0-9a-fA-F]{3,4}){1,2}$|^(rgb|hsl)a?\\s*\\(|^(red|blue|green|yellow|black|white|purple|orange|cyan|magenta|lime|pink|teal|lavender|brown|beige|maroon|navy|olive|silver|gold)$/i]",
          message:
            "Avoid using literal color values. Use theme tokens from Chakra UI instead (e.g., 'primary.DEFAULT', 'border', 'foreground', 'red.500').",
        },
      ],
      "@next/next/no-duplicate-head": "off",
    },
  },

  // 6. Specific rules for configuration files
  {
    files: ["eslint.config.mjs", "next.config.mjs", "postcss.config.js", "tailwind.config.ts", "vitest.config.ts"],
    rules: {
        // Example: "@typescript-eslint/no-var-requires": "off",
    },
  }
);

export default eslintConfig;