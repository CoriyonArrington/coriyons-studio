--- docs/03-design/design-to-code-workflow.md ---
# 🔗 Design-to-Code Workflow – Coriyon’s Studio

This guide shows how to go from Figma designs using our tokens to React components with Chakra UI and Tailwind utility classes.

---

## 🔄 Workflow Steps

1. **Design in Figma** using synced tokens (colors, fonts, radii).  
2. **Inspect** styles in Figma to grab CSS variables (`hsl(var(--primary))`, etc.).  
3. **Implement in Code**  
   - Import `chakraTheme` from `src/lib/theme.ts`.  
   - Wrap app with `<ChakraProvider theme={chakraTheme}>`.  
   - Use `Box`, `Text`, `Button`, etc., or Tailwind classes directly.  
4. **Verify** in Storybook or your dev server: color mode toggles, component variants (e.g. `themedOutline` button).

---

_⏱ Last updated: May 29, 2025_
