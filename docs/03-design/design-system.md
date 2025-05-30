# 🎨 Design System – Coriyon’s Studio

This document outlines the visual and component design rules used across Coriyon’s Studio. It includes standards for UI components, spacing, colors, typography, accessibility, and usage best practices. All tokens and overrides live in `src/lib/theme.ts`.

---

## 🧩 Component Status

### ✅ Standardized Components
- **Button** – All variants implemented (`@/components/ui/button.tsx`)
- **Typography** – Complete text styles (`@/components/ui/typography.tsx`)
- **Card** – Used in UI & layout sections (`@/components/ui/card.tsx`)
- **ImageCard** – Responsive content block (`@/components/common/image-card.tsx`)
- **FormField** – With validation states (`@/components/forms/form-field.tsx`)
- **Accordion, Tooltip, Dialog** – Radix-based and styled via ShadCN

### 🛠️ Components Needing Review
- **Tabs** – Basic styling complete, needs accessibility pass  
- **Table** – Needs keyboard navigation and responsive cleanup  
- **Navigation** – Mobile drawer needs animation polish  

---

## 🎨 Color Tokens

Refer to `chakraTheme.colors` in `src/lib/theme.ts`:  
```ts
colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  border:     'hsl(var(--border))',
  input:      'hsl(var(--input))',
  ring:       'hsl(var(--ring))',
  primary:    { DEFAULT: 'hsl(var(--primary))',    foreground: 'hsl(var(--primary-foreground))' },
  // … secondary, muted, accent, popover, card, chart-1…5
};
```
Use Tailwind classes like `bg-background`, `text-foreground`, `border`, and Chakra’s `mode()` function in component variants.

### 🏷️ Semantic Roles & Utilities

| Role        | CSS Var                       | Tailwind Class              | Usage                          |
|-------------|-------------------------------|-----------------------------|--------------------------------|
| Background  | `--background`                | `bg-background`             | Page & section backgrounds     |
| Text        | `--foreground`                | `text-foreground`           | Default text color             |
| Border      | `--border`                    | `border`                    | Inputs, cards, dividers        |
| Input BG    | `--input`                     | `bg-input`                  | Form field backgrounds         |
| Ring        | `--ring`                      | `ring-ring`                 | Focus outlines                 |
| Primary BG  | `--primary`                   | `bg-primary`                | Buttons, accents               |
| Primary Text| `--primary-foreground`        | `text-primary-foreground`   | Text on primary backgrounds    |
| Popover BG  | `--popover`                   | `bg-popover`                | Dropdowns, popovers            |
| Popover Text| `--popover-foreground`        | `text-popover-foreground`   | Text inside popovers           |
| Card BG     | `--card`                      | `bg-card`                   | Card containers                |
| Card Text   | `--card-foreground`           | `text-card-foreground`      | Text inside cards              |
| Chart 1–5   | `--chart-1` … `--chart-5`     | `bg-chart-1` … `bg-chart-5` | Data visualizations            |

---

## 📐 Spacing & Radii

- **Spacing**: Defined in Tailwind’s `theme.extend.spacing` to match `--radius` increments.  
- **Radii**: From `chakraTheme.radii`:
  ```ts
  radii = {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
  };
  ```
  Apply via `rounded-sm`, `rounded-md`, `rounded-lg`, or Chakra props.

---

## ✍️ Typography Tokens

In `src/lib/theme.ts`:
```ts
fonts = {
  heading: 'var(--font-montserrat), sans-serif',
  body:    'var(--font-nunito-sans), sans-serif',
};
```
Use `font-heading` and `font-body` in Tailwind or Chakra’s `<Heading>` and `<Text>` components.

---

## 🧩 Component Overrides

### Button – `themedOutline`
```ts
components.Button.variants.themedOutline = (props) => ({
  border: '1px solid',
  borderColor: mode(colors.border, 'whiteAlpha.500')(props),
  color:       mode(colors.foreground, 'whiteAlpha.900')(props),
  _hover:      { bg: mode('gray.100','white')(props), /* … */ },
  _focus:      { /* … */ },
  _active:     { /* … */ }
});
```

### Menu – Base Style
```ts
components.Menu.baseStyle = (props) => ({
  list: {
    bg:    mode(colors.popover.DEFAULT,'black')(props),
    color: mode(colors.popover.foreground, colors.popover.foreground)(props),
    /* … */
  },
  item: { /* … */ }
});
```

---

## 🌐 Global Styles

Global CSS largely lives in `app/globals.css`, with `theme.styles.global` left minimal:
```ts
styles.global = (_props) => ({ body: {} });
```

---

_⏱ Last updated: May 29, 2025_