# 🧾 `types/` — TypeScript Definitions

This folder contains shared **TypeScript types and interfaces** used across Coriyon’s Studio. These types ensure:

* Strongly typed components, hooks, and server actions
* End-to-end Supabase integration with type safety
* Consistency between frontend and backend data flows

---

## ✅ Who This Is For

* TypeScript developers working on both client and server code
* AI tools and IDEs relying on type inference and autocomplete

---

## 📁 Folder Purpose

* Enable auto-completion for Supabase queries and mutations
* Prevent runtime errors from mismatched types
* Share application-wide types (e.g., entries, trackers, moods, roles)

---

## 📂 Common Files

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `supabase.ts` | Auto-generated from Supabase schema (do **not** edit manually) |
| `tracker.ts`  | Interfaces for tracker templates and daily log entries         |
| `user.ts`     | Types for user roles, sessions, and meta data                  |
| `ui.ts`       | Types for modals, notifications, and settings menu props       |

---

## 🔁 Type Generation

Use the following script to regenerate types after database schema changes:

```bash
./scripts/generate-supabase-types.sh
```

> This command overwrites `types/supabase.ts` with the latest schema definitions.

---

## 📌 Related Docs

* **Database Schemas** → `docs/04-development/database-schemas.md`
* **Supabase Helpers** → `lib/supabase/`
* **Test Coverage** → `tests/README.md`

Use `types/` to build with safety, clarity, and scale ✅
