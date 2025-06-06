# 🎨 Figma → Code Integration: Tailwind + Chakra + CSS Variables

This guide walks you through a **professional-grade design token setup** using Tailwind CSS, Chakra UI, and global CSS variables. It ensures your Figma styles are seamlessly mapped to your coded design system, supports theme switching, and scales well with future changes.

---

## 🔧 PART 1: Speed Up Text Style Edits in Figma

### ✅ Recommended Plugins

* **Batch Styler**: Quickly update multiple text or color styles at once
* **Design Tokens**: Export Figma styles as JSON
* **Figma Tokens by Jan Six**: Manage tokens with version control (Pro-level!)

### ⌨️ Keyboard Tips

* `Cmd/Ctrl + A` inside a frame → select all text
* `Option + Click` to drill into nested layers
* `Cmd/Ctrl + /` to search for "Edit Text Style"

### ✍️ Rename Style Tips

Rename Figma styles semantically to mirror code:

* `Heading / XL` → `heading-xl`
* `Body / Base` → `body-base`
* `Label / Small` → `label-sm`

Use tokens like [Atlassian's system](https://atlassian.design/components/tokens/all-tokens) as a naming reference:

* `font.body.medium`
* `color.text.inverse`
* `spacing.200`

---

## 🧩 PART 2: Design Token Sync (Tailwind + Chakra + CSS Vars)

### 🪄 Global CSS Variables (globals.css)

```css
:root {
  /* Primary Brand */
  --primary: 158 64% 47%;            /* #2FB67C */
  --primary-foreground: 0 0% 100%;   /* #FFFFFF */

  /* Backgrounds & Surfaces */
  --background: 0 0% 100%;           /* white */
  --foreground: 222.2 47.4% 11.2%;   /* slate-900 */
  --muted: 210 40% 96.1%;            /* gray-100 */
}

[data-theme="dark"] {
  --primary: 158 64% 45%;
  --primary-foreground: 0 0% 100%;
  --background: 222.2 47.4% 11.2%;
  --foreground: 210 40% 98%;
  --muted: 215 19% 35%;
}
```

---

### ⚙️ Tailwind Config (tailwind.config.ts)

```ts
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      borderRadius: {
        md: '0.375rem',
      },
      fontFamily: {
        sans: ['Nunito Sans', ...fontFamily.sans],
        heading: ['Montserrat', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 🌈 Chakra Theme (theme.ts)

```ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      500: '#2FB67C',
      600: '#249B66',
    },
    background: '#FFFFFF',
    foreground: '#0F172A',
    muted: '#E5E7EB',
  },
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Nunito Sans, sans-serif',
  },
  radii: {
    md: '0.375rem',
  },
});

export default theme;
```

---

## ✅ Token Flow Summary

| Source               | Used By       | Purpose                      |
| -------------------- | ------------- | ---------------------------- |
| `:root` CSS vars     | Tailwind + UI | Dynamic theme tokens (HSL)   |
| `tailwind.config.ts` | Tailwind      | Utility class generation     |
| `theme.ts`           | Chakra UI     | Component theming            |
| Figma styles         | Designers     | Visual reference + structure |

---

Would you like a visual diagram that maps the Figma tokens to Tailwind/Chakra/CSS output?
