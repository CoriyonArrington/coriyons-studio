--- docs/04-development/directory-structure.md ---
# 🗂️ Directory Structure – Coriyon’s Studio

This document maps out the key folders and files in our repository, showing how Next.js, backend logic, and support scripts are organized.

---

/
├── app/ # Next.js App Router pages & layouts
│ ├── (auth)/ # Public auth flows (login, register)
│ ├── (dashboard)/ # Protected layouts (client & admin)
│ ├── api/ # Serverless endpoints
│ └── globals.css # Global styles & CSS variables
├── components/ # Shared React components
│ ├── ui/ # Design-system primitives (Button, Card, etc.)
│ ├── layout/ # SiteHeader, SiteFooter, etc.
│ └── dashboard/ # Domain-specific components
├── lib/ # Utility functions, supabase client, theme
│ ├── theme.ts # Chakra UI + design-token config
│ ├── supabase.ts # Supabase client setup
│ └── utils/ # Small helpers
├── scripts/ # Dev tools & generators
│ ├── preflight-check.sh # Validate env, schema, types pre-deploy
│ ├── generate-directory-structure.sh
│ ├── update-supabase-types.sh
│ └── verify-schema-types.sh
├── tests/ # Vitest unit & integration tests
├── database/ # Supabase migrations & seed data
├── public/ # Static assets (images, fonts, etc.)
├── .env.example # Sample environment variables
├── .github/ # CI/CD workflows (.github/workflows/ci.yml)
├── package.json
└── README.md # Project-wide overview

---

### Key Notes

- **App Router** uses file- and folder-based routing under `/app`.  
- **Scripts** automate setup, type generation, and schema checks.  
- **Tests** run via `vitest` and are enforced in CI.  

_⏱ Last updated: May 29, 2025_