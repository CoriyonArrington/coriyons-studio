# 🛡️ `supabase/` — Supabase Project Config & Roles

This folder contains custom SQL, policies, and migration helpers for the Supabase backend powering Coriyon’s Studio. Use it to define and document access rules, views, and functions.

---

## ✅ Who This Is For

* Backend developers managing table schemas, RLS policies, and SQL views
* Security and compliance reviewers ensuring data protection and HIPAA-aware practices
* Contributors scripting migrations or edge functions

---

## 📂 Suggested Structure

| File / Folder  | Purpose                                                      |
| -------------- | ------------------------------------------------------------ |
| `roles.sql`    | Define RLS roles (`client`, `therapist`, `admin`) and grants |
| `policies.sql` | SQL scripts to create Row-Level Security policies            |
| `views.sql`    | Materialized or standard views (e.g., entry summaries)       |
| `functions/`   | RPCs or edge functions (custom stored procedures)            |
| `migrations/`  | Optional Flyway/pgm migrations for versioned schema changes  |

---

## 🔒 Role-Based Access (RLS)

Supabase enforces RLS on all sensitive tables. This folder documents:

* **Roles:** `client`, `therapist`, `admin` with specific privileges
* **Policies:** Insert, select, update, and delete rules per role
* **Shared Data:** How templates and synchronized trackers are exposed

---

## ⚙️ Related Scripts

```bash
# Regenerate TypeScript types after updating views or functions
npm run types:generate
# Dump live schema to SQL files
./scripts/generate-database-schema.sh
```

---

## 📌 Related Documentation

* Database Schemas → `docs/04-development/database-schemas.md`
* Supabase Types → `types/supabase.ts`
* SQL Exports → `database/schemas/`

---

Use the `supabase/` folder as the source of truth for backend security rules and database logic ✅
