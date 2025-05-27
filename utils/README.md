# 🧩 `utils/` — General Utility Functions

This folder contains pure helper functions used across Coriyon’s Studio. Utilities here are **stateless**, **testable**, and **framework-agnostic**.

---

## ✅ Who This Is For

* Developers creating common logic for formatting, validation, or transformations
* Contributors reducing duplication in both client and server code

---

## 📁 Folder Purpose

* Isolate logic that doesn’t belong in React components or server actions
* Standardize data transformations used across pages and scripts
* Encourage single-responsibility, pure functions for ease of testing

---

## 📂 Common Examples

| File             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `slugify.ts`     | Convert strings into URL‑friendly kebab‑case slugs |
| `format-date.ts` | Format dates consistently (e.g. `MM/DD/YYYY`)      |
| `validate.ts`    | Generic validators (email, URL, required fields)   |
| `truncate.ts`    | Truncate text to a given length with ellipsis      |

---

## ✅ Guidelines

* Each file exports a single function or small set of related functions
* All utilities should be pure (no side‑effects)
* Write unit tests alongside in `tests/unit/` for 100% coverage
* Name files descriptively to reflect functionality

---

## 📌 Related Docs

* Test Coverage → `docs/08-testing/README.md`
* Type Definitions → `docs/07-reference/types.md`
* Shared Logic → `lib/helpers`

Use `utils/` for reliable building blocks that power your app’s data transformations ✅
