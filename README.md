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

| Tool                  | Category   | Description                                                                      |
| --------------------- | ---------- | -------------------------------------------------------------------------------- |
| ⚡️ **Next.js 14**     | Frontend   | React Server Components & SSR-first architecture                                 |
| 🪄 **Chakra UI v2**   | UI Library | Accessible component primitives with theming support                             |
| 🌬️ **Tailwind CSS**  | Styling    | Utility-first styling for rapid UI development                                   |
| 🗄️ **Supabase**      | Backend    | PostgreSQL database, Auth, Storage, and Row-Level Security for CMS functionality |
| ✨ **Framer Motion**   | Animations | Declarative animations and transitions                                           |
| 🚀 **Vercel**         | Deployment | Hosting and serverless deployments                                               |
| 🤖 **GitHub Actions** | CI         | Continuous integration and workflows                                             |
| 🛡️ **TypeScript**    | Tooling    | Static type checking                                                             |
| 🔍 **ESLint**         | Tooling    | Linting and code quality                                                         |
| 🎨 **Prettier**       | Tooling    | Code formatting                                                                  |

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

Clone the repo, install dependencies, configure your environment, and launch the development server:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/coriyons-studio.git
cd coriyons-studio

# 2. Install dependencies
npm install           # or pnpm install

# 3. Configure environment
cp .env.example .env.local
# ▶️  Open `.env.local` and set your Supabase keys, SITE_URL, and other variables

# 4. Launch development server
npm run dev           # then visit http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

---

## 📝 Scripts

| Script                            | Purpose                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `generate-directory-structure.sh` | Generates an up-to-date directory structure document      |
| `preflight-check.sh`              | Runs local checks (lint, tests, types) before development |
| `update-supabase-types.sh`        | Regenerates Supabase TypeScript types from schema         |
| `verify-schema-types.sh`          | Checks for schema drift between database and local types  |

---

## 🚧 Roadmap

Plan upcoming features and milestones:

* **v1.1**: Blog pagination & category filters
* **v1.2**: User roles & permissions
* **v2.0**: Mobile responsive UI & performance optimizations

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repo and create a branch: `git checkout -b feature/YourFeature`
2. Install dependencies and run tests
3. Submit a PR against `main`
4. Follow coding standards in `CONTRIBUTING.md`

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for an overview of releases and major changes.

---

## ❓ FAQ / Troubleshooting

* **Env vars missing?** Ensure `.env.local` is created from `.env.example`.
* **Port conflicts?** Use a different port: `npm run dev -- --port 3001`.
* **Auth errors?** Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`.

---

## 🧪 Testing

Run tests to ensure quality:

```bash
npm test               # all tests
npm test:unit          # unit tests only
npm test:integration   # integration tests only
```

---

## 🔒 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 📦 Examples / Demos

Explore live demos and code examples:

* [Live Demo on Vercel](https://coriyons-studio.vercel.app)
* Examples in `/examples` folder

---

## 📞 Support / Contact

Questions or feedback? Reach out via:

* GitHub Issues: [https://github.com/your-username/coriyons-studio/issues](https://github.com/your-username/coriyons-studio/issues)
* Email: [support@coriyons.studio](mailto:support@coriyons.studio)

---

## 📚 Architecture Overview

High-level architecture details in `docs/00-intro/architecture.md`:

* **Pages**: `app/` routing & layouts
* **Components**: `components/` reusable UI
* **Data Layer**: Supabase schemas & `scripts/`
* **Automation**: Shell scripts for codegen & validation

---

Built with ❤️ by **Coriyon’s Studio**
