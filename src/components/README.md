# 📁 components/ — Reusable UI Components – Coriyon’s Studio

This folder contains all shared and modular UI components for Coriyon’s Studio, built primarily with React and Chakra UI. These components are organized by their domain or function to promote reusability, consistency, and maintainability across the application. They are foundational for building the user interface, from basic elements to more complex structures, and are showcased on the [Design System Page](/admin/design-system).

---

## ✅ Who This Is For

* **Developers:** Building new features, pages, or refining existing UI elements.
* **Designers:** Referencing available components and ensuring design consistency.
* **AI tools or automation:** Analyzing code structure or generating component-related documentation (if applicable).

---

## 📁 Folder Structure or Common Files

The `src/components/` directory is organized as follows, with each sub-directory containing an `index.ts` barrel file for easy importing and a `__tests__/` folder for co-located tests:

| File / Folder     | Purpose                                                                                                | Key Examples                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `common/`         | Shared layout components & global structural wrappers.                                                 | `Layout.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`                                  |
| `features/`       | (Planned) Feature-specific components or modules (e.g., for distinct application functionalities).   | `DBTDiaryCard.tsx`, `HealthTracker.tsx` (from original plan)                    |
| `forms/`          | Components related to form handling, input fields, and form feedback.                                  | `Form.tsx`, `FormField.tsx`, `FormMessage.tsx`, `SubmitButton.tsx`                |
| `navigation/`     | Navigation controls, authentication-related UI, and theme switching components.                        | `HeaderAuth.tsx`, `ThemeSwitcher.tsx`                                             |
| `typography/`     | Components for consistent text styling (headings, paragraphs, inline code, etc.).                      | `Heading.tsx`, `Text.tsx`, `TypographyInlineCode.tsx`                             |
| `ui/`             | Core, generic UI primitives, theme providers, and shared UI utilities (buttons, cards, modals, etc.).  | `Button.tsx`, `UICard.tsx`, `Input.tsx`, `UIModal.tsx`, `Spinner.tsx`, `ThemeProvider.tsx`, `toaster.ts` |
| `*.test.tsx`      | Co-located Vitest tests within `__tests__/` subfolders for corresponding components.                    | N/A                                                                               |
| `index.ts`        | Barrel files within each sub-directory for aggregated exports.                                         | N/A                                                                               |

---

## 🔁 Guidelines or Usage Notes

* **Theming:** Base all component styles on the Chakra UI theme defined in `src/lib/theme.ts` and global CSS variables in `src/app/globals.css`.
* **Chakra UI First:** Utilize Chakra UI components and their props as the foundation for styling, accessibility, and consistency. Custom components should generally wrap or extend Chakra components.
* **Composition:** Favor building smaller, focused components that can be combined to create more complex UIs.
* **State Management:** Keep presentational components as stateless as possible, managing state in parent components, page-level components, or hooks where appropriate.
* **Props & Types:** Define clear TypeScript interfaces or types for component props. For complex components, consider co-locating these in `*.types.ts` files or within the component file itself.
* **Naming Conventions:**
    * Component files: **PascalCase.tsx** (e.g., `SiteHeader.tsx`).
    * Folders (sub-directories within `components/`): **kebab-case** (e.g., `common/`, `ui/`). This is already established, continue this pattern if new top-level categories are added.
* **Exports:** Use `index.ts` barrel files within each subdirectory for cleaner and more organized imports.
* **Testing:** Write unit and integration tests for components. Ensure good test coverage, especially for UI interactions and different states.
* **Design System Page:** When creating or significantly modifying a reusable component, ensure it is showcased with relevant examples on the [Design System Page](/admin/design-system).

---

## ⚙️ How to Contribute or Extend

Ensure new components are well-tested, adhere to established styling and accessibility standards, and are documented on the design system page.

```bash
# Lint files in the components directory
npm run lint ./src/components/

# Run tests related to components (adjust glob if needed)
npm run test -- src/components

---

📌 Related Docs
[suspicious link removed] — Core Chakra UI theme configuration (colors, fonts, radii, component variants).
[suspicious link removed] — Live Design System & Component Showcase.
[suspicious link removed] — Broader project directory structure (if this README is part of it).
Chakra UI Documentation — Official Chakra UI documentation.

⏱ Last updated: May 30, 2025