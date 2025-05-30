# 📁 components/ — Shared UI Components – Coriyon’s Studio

This folder contains modular UI components used across Coriyon’s Studio, built with React and Chakra UI. These components support various parts of the application, including portfolio pages, interactive tools, and admin dashboard interfaces. The focus is on creating reusable, consistent, and accessible UI elements.

---

## ✅ Who This Is For

* Frontend developers crafting new UI or refactoring existing components.
* Designers and maintainers ensuring consistent application of design tokens and UI patterns.
* AI tools or automation involved in code analysis or generation (if applicable).

---

## 📁 Folder Structure or Common Files

The `src/components/` directory is organized as follows:

| File / Folder                | Purpose                                                            |
| ---------------------------- | ------------------------------------------------------------------ |
| `ui/`                        | Core UI utilities (Chakra provider, color mode management, toaster). |
| `layout/`                    | Structural components for page layouts (e.g., SiteHeader, SiteFooter). |
| `typography/`                | Custom typography-related components (e.g., TypographyInlineCode).   |
| `chakra-next-theme-syncer.tsx` | Synchronizes Chakra UI's color mode with Next.js themes.            |
| `form-message.tsx`           | Displays user feedback messages (errors, success, info).           |
| `header-auth.tsx`            | Handles authentication display (e.g., user info, sign-in/out buttons) in the header. |
| `submit-button.tsx`          | A specialized button for form submissions, often handling pending states. |
| `theme-switcher.tsx`         | Allows users to switch between light, dark, and system color themes.   |
| `*.test.tsx`                 | Co-located Vitest tests for corresponding components.                  |
| `README.md`                  | This file, providing an overview of the components directory.        |

---

## 🔁 Guidelines or Usage Notes

* Base all component styles on the Chakra UI theme defined in `src/lib/theme.ts` and global CSS variables in `src/app/globals.css`.
* Utilize Chakra UI components and their props for styling, accessibility, and consistency.
* Favor composition: build smaller, focused components that can be combined to create more complex UIs.
* Keep components as stateless as possible, managing state in parent components or hooks where appropriate.
* Co-locate complex prop type definitions within component files or in adjacent `*.types.ts` files.
* Follow naming conventions: folders in **kebab-case** (if any sub-folders beyond the current ones are added) and component files in **PascalCase.tsx**.
* Consider using an `index.ts` file within subdirectories (like `ui/`, `layout/`) for cleaner exports if they grow larger.

---

## ⚙️ How to Contribute or Extend

Ensure new components are well-tested and adhere to the established styling and accessibility standards.

```bash
# Lint files in the components directory
npm run lint ./src/components/

# Run tests related to components (adjust glob if needed)
npm run test -- src/components