# 🧪 Visual Testing Checklist — Button Component

Use this checklist to confirm that your Chakra-based `Button` component visually matches your design tokens and Figma spec. This helps you validate that your design system tokens are successfully applied in both light and dark mode using Storybook.

---

## ✅ Typography

| Element     | What to Check                | How                                          |
| ----------- | ---------------------------- | -------------------------------------------- |
| Font family | Uses `Montserrat`            | Inspect element → `font-family` = Montserrat |
| Font weight | Consistent with Figma styles | Match `semibold` or `bold` where used        |

---

## ✅ Spacing & Layout

| Element       | What to Check               | How                                                    |
| ------------- | --------------------------- | ------------------------------------------------------ |
| Padding       | Matches Figma spacing token | Inspect → `padding` = `px-4 py-2` or `p-4`             |
| Border radius | Uses system token           | Inspect → `border-radius` = `8px` (or `var(--radius)`) |

---

## ✅ Colors — Light Mode

| Token                  | Expected                | How                                               |
| ---------------------- | ----------------------- | ------------------------------------------------- |
| `--primary`            | Green (#2FB67C)         | Inspect → `background-color` on `variant="solid"` |
| `--primary-foreground` | White (#FFFFFF)         | Inspect → `color` (text color)                    |
| `--border`             | Light gray border       | Inspect → border color on `variant="outline"`     |
| `--muted`              | Used for disabled state | Inspect `isDisabled` + opacity/color              |
| `--accent`             | Used in themedOutline   | Inspect `variant="themedOutline"`                 |

---

## ✅ Colors — Dark Mode

| Token                  | Expected                | How                                                    |
| ---------------------- | ----------------------- | ------------------------------------------------------ |
| `--primary`            | Light/white or brand    | Add `.dark` class or toggle in Storybook theme preview |
| `--primary-foreground` | Dark text (on light bg) | Inspect → `color`                                      |
| `--border`             | Darker border color     | Inspect → `border-color` on outline                    |
| `--popover` / `--card` | Neutral dark surface    | Check preview background / tokens visually             |

---

## ✅ States

| State    | What to Confirm                          | How                                               |
| -------- | ---------------------------------------- | ------------------------------------------------- |
| Hover    | Background color changes slightly        | Hover over button (all variants)                  |
| Focus    | Ring outline visible                     | Tab to button → check for outline or `box-shadow` |
| Active   | Slight background shade on click         | Click and hold visually                           |
| Disabled | Appears faded, not clickable             | `isDisabled: true`                                |
| Loading  | Spinner appears + text replaced or added | `isLoading: true`, check text and loader          |

---

## ✅ Visual Token Application Summary

| Visual Feature | Controlled By                      | Token Source             |
| -------------- | ---------------------------------- | ------------------------ |
| Font           | Chakra `fonts.heading`             | `globals.css → --font-*` |
| Colors         | Chakra `colorScheme`               | `theme.ts → colors.*`    |
| Radius         | Chakra `radii.md`                  | `globals.css → --radius` |
| Spacing        | Chakra padding props               | Tailwind or theme values |
| Variants       | `theme.components.Button.variants` | `theme.ts`               |

---

Let me know when you're ready to move on to:

* ✅ Interaction simulation
* ✅ Accessibility testing using `@storybook/addon-a11y`
* or fix compatibility issues with Storybook 9 + addon versions.
