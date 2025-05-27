# 🧭 `app/` — Next.js App Router Entry

This folder contains the top-level **Next.js 14 App Router** layouts, pages, and route groups for Coriyon’s Studio. All route-based UI originates here, branching into client-facing portfolio and services, interactive playground tools, and the secure admin dashboard.

---

## ✅ Who This Is For

* Frontend developers working with Next.js App Router and React Server Components
* Contributors managing global layouts, metadata, and SSR/CSR boundaries

---

## 📁 Folder & File Structure

| File / Folder | Purpose                                                             |
| ------------- | ------------------------------------------------------------------- |
| `layout.tsx`  | Root layout wrapper: shared `<head>`, header, footer, and providers |
| `page.tsx`    | Optional root-level homepage or redirect to `/work`                 |
| `globals.css` | Base Tailwind CSS imports, custom font definitions                  |
| `work/`       | Dynamic case studies: `/work/[slug]`                                |
| `services/`   | CMS-driven service pages: `/services/[slug]`                        |
| `playground/` | Interactive tools: DBT Diary Card, Health Tracker, Quiz             |
| `dashboard/`  | Admin dashboard: content CRUD, user management (SSR-enabled)        |
| `api/`        | Route handlers for server-side logic and webhooks                   |

```bash
app/
├── layout.tsx      # Root RSC layout & providers
├── page.tsx        # Homepage or redirect logic
├── globals.css     # Global styles and fonts
├── work/           # Portfolio case study routes
│   └── [slug]/     # Dynamic work page
│       └── page.tsx
├── services/       # Services pages from CMS
│   └── [slug]/     # Dynamic service page
│       └── page.tsx
├── playground/     # Interactive feature routes
│   └── [tool]/     # Each playground tool sub-route
├── dashboard/      # Admin interface routes
│   ├── layout.tsx
│   └── page.tsx
└── api/            # API endpoints and webhook handlers
```

---

## ⚙️ Rendering Guidelines

* **Server-Side Rendering (SSR):** Prefer SSR for data-driven pages (dashboard, case studies, services).
* **Client Components:** Use `"use client"` only when you need React state or browser-only APIs (e.g. interactive quizzes).
* **API Isolation:** Keep API routes under `app/api/` for clear separation of concerns.

---

## 📌 Related Documentation

* Directory Structure → `docs/04-development/directory-structure.md`
* API Routes Reference → `docs/04-development/api-routes.md`
* Design System & Tokens → `docs/03-design/design-tokens-sheet.md`

Use this `app/` folder as the routing brain of your studio platform 🚀
