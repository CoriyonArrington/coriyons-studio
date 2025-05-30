--- docs/03-design/design-system.md ---
# 🎨 Design System – Coriyon’s Studio

This document outlines the visual and component design rules, including tokens and utilities, used across Coriyon’s Studio applications. All tokens and overrides live in `src/lib/theme.ts`.

---

## 🧩 Component Status

### ✅ Standardized Components
- **Button** – Uses the `themedOutline` variant configured in `src/lib/theme.ts`.
- **Menu** – Custom base styles applied via the `Menu` component config.

### 🛠️ Components Needing Review
*(none at this time; only theme-specific components are listed here)*

---

## 🎨 Color Tokens

### 🌈 CSS Variable Definitions

Defined in `src/app/globals.css` and referenced in `src/lib/theme.ts`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0%  3.9%;
  --border:     210 16% 82%;
  --input:      210 16% 95%;
  --ring:       205 100% 57%;
  --primary:             210 100% 50%;
  --primary-foreground:  210 100% 100%;
  /* … secondary, muted, accent, popover, card, chart-1…5 */
}
.dark {
  --background: 0 0%  3.9%;
  --foreground: 0 0% 98%;
  /* … */
}
```

### 🧩 Token Mapping in Theme

In `src/lib/theme.ts`:

```ts
const colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  border:     'hsl(var(--border))',
  input:      'hsl(var(--input))',
  ring:       'hsl(var(--ring))',
  primary:    { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  secondary:  { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
  muted:      { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  accent:     { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
  popover:    { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
  card:       { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
  chart:      {
                '1': 'hsl(var(--chart-1))',
                '2': 'hsl(var(--chart-2))',
                '3': 'hsl(var(--chart-3))',
                '4': 'hsl(var(--chart-4))',
                '5': 'hsl(var(--chart-5))'
              }
};
```

---

## 📐 Radii

Configured in `src/lib/theme.ts` under `radii`:

| Name | CSS Value                   |
|------|-----------------------------|
| sm   | `calc(var(--radius) - 4px)` |
| md   | `calc(var(--radius) - 2px)` |
| lg   | `var(--radius)`             |

---

## 🔠 Typography

Configured fonts in `src/lib/theme.ts`:

```ts
fonts: {
  heading: 'var(--font-montserrat), sans-serif',
  body:    'var(--font-nunito-sans), sans-serif'
}
```

---

## 🌐 Global Styles

Defined in `src/lib/theme.ts`:

```ts
styles: {
  global: (_props) => ({
    body: {
      // global resets or overrides; core visuals live in src/app/globals.css
    }
  })
}
```

---

## 🔧 Component Variants

### Button: `themedOutline`

Defined under `components.Button.variants` in `src/lib/theme.ts`:

```ts
Button: {
  variants: {
    themedOutline: (props) => ({
      border: "1px solid",
      bg: "transparent",
      borderColor: mode(colors.border, "whiteAlpha.500")(props),
      color: mode(colors.foreground, "whiteAlpha.900")(props),
      _hover: {
        bg: mode("gray.100", "white")(props),
        borderColor: mode(colors.primary.DEFAULT, "gray.200")(props),
        color: mode(colors.primary.DEFAULT, "black")(props)
      },
      _focus: {
        borderColor: mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props),
        boxShadow: `0 0 0 1px ${mode(colors.primary.DEFAULT, colors.primary.DEFAULT)(props)}`
      },
      _active: {
        bg: mode("gray.200", "gray.50")(props),
        borderColor: mode(colors.primary.DEFAULT, "gray.300")(props),
        color: mode(colors.primary.DEFAULT, "black")(props)
      }
    })
  }
}
```

### Menu: Custom `baseStyle`

Defined under `components.Menu.baseStyle`:

```ts
Menu: {
  baseStyle: (props) => ({
    list: {
      bg: mode(colors.popover.DEFAULT, "black")(props),
      color: mode(colors.popover.foreground, colors.popover.foreground)(props),
      borderWidth: "1px",
      borderColor: mode(colors.border, colors.border)(props),
      boxShadow: mode("md", "dark-lg")(props)
    },
    item: {
      bg: mode("transparent", "black")(props),
      color: mode(colors.popover.foreground, colors.popover.foreground)(props),
      _hover: { bg: mode("gray.100", "white")(props), color: mode(colors.popover.foreground, "black")(props) },
      _focus: { bg: mode("gray.100", "white")(props), color: mode(colors.popover.foreground, "black")(props) },
      _active: { bg: mode("gray.200", "gray.50")(props), color: mode(colors.popover.foreground, "black")(props) },
      _checked: { bg: mode("blue.50", "blue.700")(props), color: mode("blue.600", "white")(props) }
    }
  })
}
```

---

_⏱ Last updated: May 30, 2025_