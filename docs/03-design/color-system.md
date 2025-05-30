# 🎨 Color System – Coriyon’s Studio

Exact mapping of our Chakra theme’s color tokens (in `src/lib/theme.ts`) to CSS variables and Tailwind classes.

---

## 🌈 CSS Variable Definitions

In `app/globals.css` you define:

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
  --background:  0  0%   3.9%;
  --foreground:  0  0%  98%;
  /* … */
}
```

---

## 🏷️ Semantic Roles & Utilities

| Role         | CSS Var                      | Tailwind Class                 | Usage                       |
| ------------ | ---------------------------- | ------------------------------ | --------------------------- |
| Background   | `--background`               | `bg-background`                | Page & section backgrounds  |
| Text         | `--foreground`               | `text-foreground`              | Default text color          |
| Border       | `--border`                   | `border`                       | Inputs, cards, dividers     |
| Input BG     | `--input`                    | `bg-input`                     | Form field backgrounds      |
| Ring         | `--ring`                     | `ring-ring`                    | Focus outlines              |
| Primary BG   | `--primary`                  | `bg-primary`                   | Buttons, accents            |
| Primary Text | `--primary-foreground`       | `text-primary-foreground`      | Text on primary backgrounds |
| Popover BG   | `--popover`                  | `bg-popover`                   | Dropdowns, popovers         |
| Popover Text | `--popover-foreground`       | `text-popover-foreground`      | Text inside popovers        |
| Card BG      | `--card`                     | `bg-card`                      | Card containers             |
| Card Text    | `--card-foreground`          | `text-card-foreground`         | Text inside cards           |
| Chart 1–5    | `--chart-1` … `--chart-5`    | `bg-chart-1` … `bg-chart-5`    | Data visualizations         |

---

## ⚠️ Accessibility

Ensure ≥4.5:1 contrast for text on background roles. Test with `axe-core` and manual checks.

---

_⏱ Last updated: May 29, 2025_