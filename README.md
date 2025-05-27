# Coriyon’s Studio

Coriyon’s Studio is a CMS-driven, server-rendered Next.js 14 project showcasing a UX design portfolio, interactive playground tools, and a seamless admin dashboard powered by Supabase.

## Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
* [Scripts](#scripts)
* [Documentation](#documentation)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Demo

Live site: [https://your-site-url.com](https://your-site-url.com)

## Features

* **Portfolio Showcase**: Dynamic case studies under `/work/[slug]`
* **Services Pages**: CMS-managed UX services under `/services/[slug]`
* **Interactive Playground**: Quiz, Health Tracker, DBT Diary Card at `/playground`
* **Admin Dashboard**: Full CRUD interface under `/dashboard`
* **Developer Tools**: On-demand cache revalidation, Supabase & API debugging
* **CMS**: Supabase-backed content models with RLS and Row-Level Security
* **Design System**: Tailwind CSS, ShadCN/UI components, Figma tokens

## Tech Stack

* **Next.js 14** (App Router) – React Server Components
* **TypeScript**, **ESLint**, **Prettier**
* **Supabase** – Auth, Database, Storage, RLS
* **Tailwind CSS** – Utility-first styling
* **ShadCN/UI** – Radix-based UI primitives
* **Framer Motion** – Animations
* **Vercel** – Deployment
* **GitHub Actions** – CI/CD (if configured)

## Project Structure

```bash
.
├── app/                   # Next.js App directory (RSC pages & layouts)
├── components/            # Shared React components
├── config/                # Site configuration and tokens
├── docs/                  # Technical and design documentation
├── playground-tools/      # Individual playground tool implementations
├── public/                # Static assets and images
├── scripts/               # Utility and automation scripts
├── types/                 # Shared TypeScript type definitions
├── .env.example           # Environment variable template
├── tailwind.config.ts     # Tailwind CSS configuration
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

* Node.js >= 18
* npm >= 8
* Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/coriyons-studio.git
   cd coriyons-studio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy and configure environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase keys and site URL
   ```

4. Run the development server:

   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

### Environment Variables

Rename `.env.example` to `.env.local` and define:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATION_SECRET=your-revalidation-secret
PDF_API_SECRET=your-pdf-api-secret
DEBUG_API_KEY=your-debug-api-key
```

## Scripts

| Command                   | Description                               |
| ------------------------- | ----------------------------------------- |
| `npm run dev`             | Starts the Next.js development server     |
| `npm run build`           | Builds the production assets              |
| `npm run start`           | Runs the production server                |
| `npm run lint`            | Runs ESLint checks                        |
| `npm run format`          | Formats code with Prettier                |
| `npm run type-check`      | Runs TypeScript type checking             |
| `npm run generate-routes` | Regenerates `ROUTES.md` via custom script |

## Documentation

See the [`docs/`](docs/) folder for in-depth guides and references:

* [System Architecture Overview](docs/system-architecture-overview.md)
* [Technical Setup Guide](docs/technical-setup-guide.md)
* [Developer Handbook](docs/developer-handbook.md)
* [Deployment & QA Pack](docs/deployment-qa-pack.md)
* [Brand & Marketing Guide](docs/brand-marketing-guide.md)
* [CMS Contribution Guide](docs/cms-contribution-guide.md)
* [Content Calendar & Publishing Workflow](docs/content-calendar.md)
* [Security & Permissions Guide](docs/security-permissions-guide.md)
* [Testing & QA Strategy](docs/qa-strategy.md)
* [Glossary](docs/glossary.md)

## Contributing

We welcome contributions! Please follow the steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes with descriptive messages.
4. Push to your fork and open a Pull Request.
5. Ensure tests and linting pass before review.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions or feedback, reach out to **Coriyon Arrington**:

* Website: [https://coriyons-studio.com](https://coriyons-studio.com)
* Email: [youremail@example.com](mailto:youremail@example.com)
