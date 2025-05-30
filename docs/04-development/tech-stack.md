--- docs/04-development/tech-stack.md ---
# 🛠️ Tech Stack – Coriyon’s Studio

An overview of the tools and frameworks powering our application.

---

## ⚛️ Frontend

- **Next.js 14** (App Router) — SSR/SSG, layouts, API routes  
- **TypeScript** — Typesafety across client & server  
- **Chakra UI** — Component library with theming from `src/lib/theme.ts`  
- **Tailwind CSS** — Utility-first styles synced via CSS vars  
- **lucide-react** — Accessible primitives & icons

## 🗄️ Backend & Database

- **Supabase** — PostgreSQL, Auth, Storage, Edge Functions  
- **Supabase CLI** & **Migrations** — `database/` folder for schema

## 🚀 Deployment

- **Vercel** — Preview, staging, and production environments  
- **Edge Functions** — For webhooks and real-time integrations  
- **GitHub Actions** (`.github/workflows/ci.yml`) — CI pipeline with tests

## 🔐 Security

- **RLS Policies** on all tables  
- **Preflight Checks** for env, schema, and type consistency  

## 🧪 Testing & QA

- **Vitest** — Unit & integration tests (`tests/`)  
- **Playwright** (planned) — End-to-end testing  

---

### 📦 Dev Tools

- **Preflight Script** — `scripts/preflight-check.sh`  
- **Type Generation** — `scripts/update-supabase-types.sh`, `scripts/verify-schema-types.sh`  
- **Directory Export** — `scripts/generate-directory-structure.sh`

_⏱ Last updated: May 29, 2025_