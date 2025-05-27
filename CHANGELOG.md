# 📦 Changelog

All notable changes to this project will be documented here.

---

## [v0.1.0] – Initial Release

Released: [Today’s Date]

### ✨ Features
- Scaffolded new route groups in `app/`: `(auth-pages)`, `(tutorials)`, `(community)`, `(labs)`, etc.
- Added Chakra UI with custom theming and layout integration
- Integrated Supabase for authentication and database access (client & server)
- Implemented blog support with Markdown rendering
- Introduced DBT Diary Card foundation and Skills Library
- Built dynamic playground section and quiz rendering
- Added design system components and base pages
- Created reusable form components with ShadCN

### 🛠️ Enhancements
- Added `README.md` documentation to all top-level directories
- Introduced utility scripts for Supabase type generation, schema drift detection, and project scaffolding
- Modularized SQL into `tables.sql`, `seed.sql`, `rls.sql`
- Improved page layout structure, responsiveness, and dark mode compatibility

### 🧪 Testing & CI
- Created 20+ unit and integration tests for Supabase utilities
- Ensured deterministic test environments and CLI version pinning
- Implemented GitHub Actions CI with full preflight validation: type gen, drift check, lint, tests, and build
