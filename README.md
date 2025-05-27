# 🏆 Coriyon’s Studio — Root README

Welcome to **Coriyon’s Studio** — a CMS-driven, server-rendered Next.js 14 portfolio and interactive toolkit that includes:

* 🎨 **UX Design Portfolio** — dynamic case studies and services powered by Supabase CMS
* ⚙️ **Interactive Playground** — DBT Diary Card, Health Tracker, Interactive Quiz
* 🔒 **Admin Dashboard** — secure therapist/client interfaces and content management

---

## 🧭 Project Structure Overview

| Folder / File        | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `app/`               | Next.js App directory (React Server Components & layouts)          |
| `components/`        | Reusable UI components                                             |
| `config/`            | Site configuration, design tokens, and theme definitions           |
| `docs/`              | Product strategy, design, development, and marketing documentation |
| `playground-tools/`  | Individual implementations of interactive tools                    |
| `public/`            | Static assets, images, and icons                                   |
| `scripts/`           | Automation scripts: route generation, schema/types updates         |
| `types/`             | Shared TypeScript type definitions                                 |
| `.env.example`       | Template for required environment variables                        |
| `tailwind.config.ts` | Tailwind CSS configuration                                         |
| `vercel.json`        | Vercel deployment settings                                         |
| `README.md`          | This file                                                          |

```bash
.
├── app/                   # Next.js RSC pages & layouts
├── components/            # Shared React components
├── config/                # Site config and design tokens
├── docs/                  # In-depth guides and references
├── playground-tools/      # Interactive tool implementations
├── public/                # Static assets
├── scripts/               # Automation and utility scripts
├── types/                 # TypeScript definitions
├── .env.example           # Env var template
├── tailwind.config.ts     # Tailwind setup
├── vercel.json            # Deployment config
└── README.md              # Root README
```

---

## 🛠 Tech Stack

* **Frontend:** Next.js 14 (App Router) + React Server Components + Tailwind CSS + ShadCN/UI
* **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
* **UI Animations:** Framer Motion
* **Deployment:** Vercel + GitHub Actions CI
* **Type Safety & Linting:** TypeScript + ESLint + Prettier

---

## 📖 Documentation

All detailed docs live in the `docs/` folder, organized by category:

* **01-strategy/** → Product vision, business model, and UX strategy
* **02-planning/** → Roadmaps, journey maps, and phase–metric mappings
* **03-design/** → Design system, tokens, and component usage
* **04-development/** → Technical setup, deployment guide, and QA pack
* **05-marketing/** → Content calendar, brand & marketing guide, SEO best practices
* **00-intro/wiki.md** → Visual index and project overview

Start here:

```sh
docs/00-intro/wiki.md
```

---

## 📦 Install & Start

```bash
git clone https://github.com/your-username/coriyons-studio.git
cd coriyons-studio
npm install           # or pnpm install
cp .env.example .env.local
# Fill in Supabase keys and SITE_URL
npm run dev           # http://localhost:3000
```

---

## ✅ Status

* Portfolio and services pages live and dynamic
* Interactive playground tools integrated
* Admin dashboard with full CMS CRUD capabilities
* Comprehensive documentation bundled
* CI/CD pipeline configured for production deployments

---

Built with ❤️ by **Coriyon’s Studio**
