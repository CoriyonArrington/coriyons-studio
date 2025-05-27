# 💻 `src/` — Application Source Code

This folder contains all primary source code for Coriyon’s Studio, including:

* 🎨 **Portfolio & Services** pages (client-facing)
* ⚙️ **Interactive Playground** tools (DBT Diary Card, Health Tracker, Quiz)
* 🔒 **Admin Dashboard** (Therapist & Studio views)

Apps are structured to share common components and logic where possible, reducing duplication and ensuring consistent behavior across experiences.

---

## 🧠 Architecture Overview

| Folder        | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `work/`       | Dynamic case studies: `/work/[slug]`                         |
| `services/`   | CMS-driven service pages: `/services/[slug]`                 |
| `playground/` | Interactive tool routes (DBT Diary Card, Tracker, Quiz)      |
| `dashboard/`  | Admin dashboard layouts, pages, and server-side logic        |
| `hooks/`      | Custom React hooks for shared UI and data logic              |
| `components/` | Shared UI components and design primitives                   |
| `lib/`        | Application logic helpers, Supabase client wrappers, actions |
| `utils/`      | Pure utility functions (slugify, format-date, etc.)          |

---

## 🛠 Key Technologies

* **Framework:** Next.js 14 (App Router with React Server Components)
* **Styling:** Tailwind CSS + ShadCN/UI
* **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
* **Animations:** Framer Motion
* **Type Safety:** TypeScript + Supabase typed client

---

## 🚀 Dev Quickstart

```bash
# Install dependencies
git clone https://github.com/your-username/coriyons-studio.git
cd coriyons-studio
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in Supabase keys and SITE_URL

# Start development server
npm run dev
# Visit http://localhost:3000
```

---

## 📁 Related Documentation

* Directory Structure → `docs/04-development/directory-structure.md`
* Environment Variables → `docs/04-development/environment-variables.md`
* Scripts Overview → `scripts/README.md`
* Testing Coverage → `docs/08-testing/README.md`

---

## ✅ MVP Status

* Portfolio and services pages render dynamically from Supabase CMS
* Interactive playground tools fully integrated and functioning
* Admin dashboard supports full CRUD and multi-role access
* Authentication and RLS policies applied for secure data handling

---

Built and maintained by **Coriyon’s Studio**
