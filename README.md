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
| `app/`               | Next.js App directory (React Server Components & layouts)          |
| `components/`        | Reusable UI components                                             |
| `config/`            | Site configuration: Tailwind, ESLint, testing, deployment          |
| `database/`          | Database migrations & seed scripts                                 |
| `scripts/`           | Automation scripts: route generation, schema/types updates         |
| `types/`             | Shared TypeScript type definitions                                 |
| `public/`            | Static assets (images, fonts)                                      |
| `docs/`              | In-depth guides and references                                     |
| `.env.example`       | Sample environment variables                                        |
| `tailwind.config.ts` | Tailwind CSS configuration                                         |
| `vercel.json`        | Vercel deployment settings                                         |
| `README.md`          | This file                                                           |

```bash
.
├── app/                   # Next.js RSC pages & layouts
├── components/            # Shared React components
├── config/                # Site config and design tokens
├── database/              # Migrations & seed data
├── docs/                  # In-depth guides & references
├── public/                # Static assets
├── scripts/               # Automation & utility scripts
├── types/                 # TypeScript definitions
├── .env.example           # Env var template
├── tailwind.config.ts     # Tailwind setup
├── vercel.json            # Deployment config
└── README.md              # Project overview (this file)
```

---

## 🛠 Tech Stack

| Tool                  | Category   | Description                                                                      |
| --------------------- | ---------- | -------------------------------------------------------------------------------- |
| ⚡️ **Next.js 14**     | Frontend   | React Server Components & SSR-first architecture                                 |
| 🪄 **Chakra UI v2**   | UI Library | Accessible component primitives with theming support                             |
| 🌬️ **Tailwind CSS**  | Styling    | Utility-first styling for rapid UI development                                   |
| 🗄️ **Supabase**      | Backend    | PostgreSQL database, Auth, Storage, and Row-Level Security for CMS functionality  |
| ✨ **Framer Motion**   | Animations | Declarative animations and transitions                                           |
| 🚀 **Vercel**         | Deployment | Hosting and serverless deployments                                               |
| 🤖 **GitHub Actions** | CI         | Continuous integration and workflows                                             |
| 🛡️ **TypeScript**    | Tooling    | Static type checking                                                             |
| 🔍 **ESLint**         | Tooling    | Linting and code quality                                                         |
| 🎨 **Prettier**       | Tooling    | Code formatting                                                                  |

---

## 📖 Documentation

All detailed docs live in the `docs/` folder, organized by category:

* **00-intro/** → Visual overview and navigation
* **01-strategy/** → Business & marketing strategy
* **02-planning/** → Roadmaps & use-case planning
* **03-design/** → Design system & brand tokens
* **04-development/** → Technical guides & deployment
* **05-marketing/** → Messaging, personas, and campaigns
* **06-support-legal/** → Policies, FAQs, and support docs
* **07-reference/** → Templates, conventions, and AI primers
* **08-testing/** → Test strategies & guidelines
* **09-launch/** → Launch checklists & sprint plans
* **99-archive/** → Legacy or archived content

Start your journey:

```sh
docs/00-intro/wiki.md
```

---

## 📦 Install & Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/coriyons-studio.git
cd coriyons-studio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and other keys

# 4. Launch development server
npm run dev
```

---

## 🤝 Contributing

Please refer to [`docs/00-intro/how-to-use-wiki.md`](docs/00-intro/how-to-use-wiki.md) for contributing guidelines.

---

*Built with ❤️ by Coriyon’s Studio*