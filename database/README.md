# 🗃️ `database/` — Supabase Schema & Seed Files

This folder stores database-related assets for Coriyon’s Studio, including:

* 🔍 **Schema dumps** for tracking the live Supabase structure
* 🌱 **Seeding scripts** to populate dev or test environments with sample data
* 🚧 **Migrations** (if adopting Supabase migration workflow in the future)

Maintaining these files ensures you can version-control backend changes and restore environments accurately.

---

## ✅ Who This Is For

* Backend developers managing Supabase tables, policies, and views
* QA/Test engineers resetting staging or local environments
* AI agents or scripts generating TypeScript types from schema

---

## 📂 Folder Structure

| Subfolder  | Purpose                                        |
| ---------- | ---------------------------------------------- |
| `schemas/` | `.sql` exports of the live DB schema (no data) |
| `seed/`    | Insert scripts for dev/test seed data          |

---

## ⚙️ Key Scripts

```bash
# Dump the current Supabase schema to `database/schemas/schema.sql`
./scripts/generate-database-schema.sh

# Regenerate TypeScript types from Supabase schema\ n./scripts/generate-supabase-types.sh
```

> ⚠️ All schema exports are read-only unless you are intentionally applying diffs or restoring backups.

---

## 🔒 Security & Best Practices

* Enforce Row-Level Security (RLS) policies via Supabase dashboard or SQL
* Never commit real user or client data—use anonymized test records only
* Review seed data scripts to ensure no sensitive information is included

---

## 📌 Related Documentation

* **Database Schemas** → `docs/04-development/database-schemas.md`
* **Generated Types** → `types/supabase.ts`
* **Schema Drift Check** → `scripts/check-schema-drift.sh`

---

Use the `database/` folder to keep your backend schema versioned, secure, and easy to restore ✅
