// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // 1. Global ignores: do not lint these folders/files
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      // Add any build/dist folders if needed
    ],
  },

  // 2. Base Next.js rules (core-web-vitals)
  ...compat.extends("next/core-web-vitals"),

  // 3. Any overrides to those base rules
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
      // Add or modify other Next.js rules here if necessary
    },
  },

  // 4. Custom rules for your source code under src/
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
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
    },
  },

  // 5. Specific rules for this config file itself (optional)
  {
    files: ["eslint.config.mjs"],
    // No additional rule adjustments needed here, since using named export
    rules: {},
  },
];

export default eslintConfig;
