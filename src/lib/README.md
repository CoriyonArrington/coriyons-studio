# 📚 `lib/` — Application Logic Helpers

The `lib/` folder contains backend-friendly helpers and shared logic for Coriyon’s Studio. It includes:

* Supabase client wrappers and session utilities
* Database query abstractions and filters
* Next.js server actions for form submissions and mutations
* Environment-based utilities (e.g., feature flags)

---

## ✅ Who This Is For

* Full-stack and backend developers implementing data flows
* Contributors writing server actions or API‑integrated logic
* Edge/AI agents invoking Supabase or environment helpers

---

## 📁 Folder Structure

| Subfolder   | Purpose                                                      |
| ----------- | ------------------------------------------------------------ |
| `supabase/` | Supabase client setup, session management, and typed queries |
| `actions/`  | Next.js server actions for CRUD flows and mutations          |
| `helpers/`  | Shared business logic: email senders, slug generators        |
| `config/`   | Environment-aware settings and feature‑flag utilities        |

```bash
lib/
├── supabase/    # Client wrappers & queries
├── actions/     # Server actions for form handling
├── helpers/     # Business‑logic functions
└── config/      # Env‑based settings and flags
```

---

## 🔐 Best Practices

* Use RLS‑friendly queries and role‑based helpers
* Avoid raw SQL; prefer Supabase’s typed client interfaces
* Keep secrets in server/edge code—never expose in client bundle
* Group related helpers under clear subfolders for discoverability

---

## 📌 Related Docs

* API Routes → `docs/04-development/api-routes.md`
* Database Schemas → `docs/04-development/database-schemas.md`
* Supabase Types → `types/supabase.ts`

Use `lib/` to centralize your business logic and keep your code secure and maintainable ✅
