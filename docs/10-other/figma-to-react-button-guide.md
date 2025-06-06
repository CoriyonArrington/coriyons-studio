# 🧭 Figma → React → Storybook — Button Workflow

This guide walks through how to convert a button from your Figma design system into a live coded component, and then showcase it in Storybook with full design token support.

---

## 🎯 Goal

To ensure your design system stays unified across tools by:

- Designing a button component in Figma with consistent tokens
- Rebuilding that button in React (using Chakra UI + Tailwind tokens)
- Documenting and testing it interactively in Storybook

---

## 🧱 Canvas: Button Component Workflow

| Step | Task | Tool | Output |
|------|------|------|--------|
| 1️⃣ | Create Figma Button | Figma | Figma frame with tokens |
| 2️⃣ | Match Tokens | Figma Tokens → Tailwind/Chakra | Consistent styles |
| 3️⃣ | Build React Button | React + Chakra | `components/ui/button.tsx` |
| 4️⃣ | Write Storybook Stories | Storybook | `button.stories.tsx` |
| 5️⃣ | Visual Test & Iterate | Storybook UI | Live component previews |

---

## 🔧 1. Create the Button in Figma

### ✅ Variants to Include
- States: `Default`, `Hover`, `Disabled`, `Loading`
- Sizes: `Sm`, `Md`, `Lg`
- Styles: `Primary`, `Secondary`, `Ghost`, `Destructive`

### ✅ Apply Tokens
- Background: `primary.500`
- Border radius: `rounded-md`
- Font: `--font-montserrat`
- Padding: `px-4 py-2`

---

## 🧩 2. Match Tokens in Code

Verify your Figma tokens are declared in:

- `tailwind.config.ts`
- `theme.ts` (Chakra custom theme)

### Example:
```ts
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#2FB67C',
    500: '#2FB67C',
  },
},
borderRadius: {
  md: '0.375rem',
},
