# 🪝 `hooks/` — Custom React Hooks

This folder contains reusable and composable **React hooks** used across Coriyon’s Studio. Hooks abstract logic for:

* Authentication and session management
* Supabase data fetching and mutations
* UI state (modals, forms, outside-click detection)
* Routing and navigation helpers

---

## ✅ Who This Is For

* Frontend developers working in Next.js and ShadCN/UI
* Contributors standardizing logic across portfolio, playground, and dashboard

---

## 📁 Folder Purpose

* Encapsulate common logic: auth state, modal toggles, form handlers, click detection
* Promote reuse between client-facing pages and the admin dashboard
* Reduce duplication of effects, listeners, and component state management

---

## 🧱 Common Examples

| File                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `use-auth.ts`          | Manage Supabase auth session and parse user roles      |
| `use-outside-click.ts` | Detect clicks outside a ref (for modals, dropdowns)    |
| `use-form-state.ts`    | Handle form input state, validation, and submission    |
| `use-cms-page.ts`      | Fetch and cache CMS-managed page content from Supabase |

---

## 🔁 Guidelines

* Prefix filenames with `use-` to denote hooks
* One hook per file; keep single responsibility
* Document return values and inputs with JSDoc or TypeScript types
* Minimize local UI state; favor server state or global stores where appropriate

---

## 📌 Related Docs

* Directory Structure → `docs/04-development/directory-structure.md`
* Supabase Integration → `docs/04-development/database-schemas.md`
* Component Conventions → `docs/developer-handbook.md`

Use these hooks to keep your logic predictable, testable, and DRY ✅
