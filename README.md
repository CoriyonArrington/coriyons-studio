# 🏆 Coriyon’s Studio — Root README

Welcome to **Coriyon’s Studio** — a CMS-driven, server-rendered Next.js 14 UX design portfolio, interactive playground, and admin dashboard.

This project includes:

* 🎨 **UX Design Portfolio** — dynamic case studies and service offerings powered by Supabase CMS
* ⚙️ **Interactive Playground** — Health Tracker, Quiz tools
* 🔒 **Admin Dashboard** — secure content management and user admin

---

## 🧭 Project Structure Overview

| Folder / File        | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `src/app/`           | Next.js App directory (React Server Components & layouts)          |
| `src/components/`    | Reusable UI components                                             |
| `src/database/`      | Core DDL SQL scripts, schema overview, and seed scripts.           |
| `src/lib/`           | Core libraries, utilities, data fetching, and configurations.      |
| `src/types/`         | Shared TypeScript type definitions (esp. `supabase.ts`).           |
| `public/`            | Static assets (images, fonts)                                      |
| `docs/`              | In-depth guides and references                                     |
| `scripts/`           | Automation scripts: schema/types updates, checks.                  |
| `.env.example`       | Sample environment variables                                        |
| `tailwind.config.ts` | Tailwind CSS configuration                                         |
| `vercel.json`        | Vercel deployment settings                                         |
| `README.md`          | This file                                                           |

```text
./
├── src/
│   ├── app/                   # Next.js RSC pages & layouts
│   ├── components/            # Shared React components
│   ├── database/              # SQL DDL (00-05), overview.md, seed.sql, README.md
│   ├── lib/                   # Shared libraries, utils, config
│   ├── types/                 # TypeScript definitions (supabase.ts)
│   └── ...                    # (Other src folders like assets, hooks)
├── docs/                  # In-depth guides & references
├── public/                # Static assets
├── scripts/               # Automation & utility scripts
├── .env.example           # Env var template
├── next.config.mjs        # Next.js config
├── package.json           # Project dependencies & scripts
├── README.md              # Project overview (this file)
└── ...                    # (Other root level config files)
```

---

## 🛠 Tech Stack

| Tool               | Category      | Description                                  |
| ------------------ | ------------- | -------------------------------------------- |
| ⚡️ Next.js 14       | Frontend      | React Server Components & SSR-first architecture |
| 🪄 Chakra UI v2     | UI Library    | Accessible component primitives with theming support |
| 🌬️ Tailwind CSS     | Styling       | Utility-first styling for rapid UI development |
| 🗄️ Supabase        | Backend       | PostgreSQL database, Auth, Storage, and Row-Level Security for CMS functionality |
| ✨ Framer Motion    | Animations    | Declarative animations and transitions       |
| 🚀 Vercel          | Deployment    | Hosting and serverless deployments           |
| 🤖 GitHub Actions  | CI            | Continuous integration and workflows         |
| 🛡️ TypeScript      | Tooling       | Static type checking                         |
| 🔍 ESLint          | Tooling       | Linting and code quality                     |
| 🎨 Prettier        | Tooling       | Code formatting                              |

---

## 📖 Documentation

All detailed docs live in the `docs/` folder, organized by category. For database-specific schema and setup, see `src/database/README.md` and `src/database/overview-database-schemas.md`.

- `docs/00-intro/` → Visual overview and navigation
- `docs/01-strategy/` → Business & marketing strategy
- `docs/02-planning/` → Roadmaps & use-case planning
- `docs/03-design/` → Design system & brand tokens
- `docs/04-development/` → Technical guides & deployment (see also `src/database/README.md` for DB setup)
- `docs/05-marketing/` → Messaging, personas, and campaigns
- `docs/06-support-legal/` → Policies, FAQs, and support docs
- `docs/07-reference/` → Templates, conventions, and AI primers
- `docs/08-testing/` → Test strategies & guidelines
- `docs/09-launch/` → Launch checklists & sprint plans
- `docs/99-archive/` → Legacy or archived content

Start your journey with `docs/00-intro/wiki.md` or explore `src/database/README.md` for database setup.

---

## 📦 Install & Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/coriyons-studio.git  # Replace with your actual repo URL
cd coriyons-studio

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL, anon key, service role key, and other necessary keys.

# 4. Set up Supabase Database Schema
# Refer to src/database/README.md for instructions on applying the DDL scripts
# (00_types_and_functions.sql, 01_tables_core.sql, etc.) to your Supabase project.
# You may also want to run the seed script: src/database/seed.sql

# 5. Regenerate Supabase types (if you made schema changes or are setting up fresh)
npm run supabase:types  # Or: ./scripts/generate-supabase-types.sh

# 6. Launch development server
npm run dev
```

---

## 🤝 Contributing

Please refer to `docs/00-intro/wiki.md` (or your specific contributing guidelines document) for contributing guidelines.

Built with ❤️ by Coriyon’s Studio
