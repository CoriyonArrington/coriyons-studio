# ⚙️ `config/` — Project Configuration Files

This folder stores configuration files that power Coriyon’s Studio build, styling, development, and deployment environments. These files affect behavior across:

* Tailwind styling
* ESLint and formatting
* Testing (Vitest)
* Deployment (Vercel, Supabase CLI)

---

## ✅ Who This Is For

* Developers adjusting build, linting, or styling behaviors
* DevOps/CI maintainers configuring deployment pipelines
* AI agents or scripts auto-generating environment setups

---

## 📁 Common Files

| File                   | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `tailwind.config.ts`   | Design tokens, theme extensions, fonts, screen breakpoints    |
| `eslint.config.mjs`    | Lint rules and parser settings for TS, TSX, MDX, and JS files |
| `vitest.config.ts`     | Configuration for unit and integration tests                  |
| `prettier.config.js`   | Code formatting rules                                         |
| `vercel.json`          | Deployment settings, redirects, and route overrides           |
| `supabase/config.toml` | Local Supabase CLI settings for migrations and seed scripts   |

---

## 🔧 Guidelines

* Restart the dev server after modifying Tailwind or ESLint configs to pick up changes
* Centralize design tokens (colors, spacing) in `tailwind.config.ts` rather than inline styles
* Validate lint rules with `npm run lint` (or `pnpm lint`) and test changes with `npm test`
* Keep CI config in sync with local settings to avoid environment drift

---

## 📌 Related Docs

* **Environment Variables** → `docs/04-development/environment-variables.md`
* **Testing Strategy** → `docs/qa-strategy.md`
* **Design Tokens** → `docs/03-design/design-tokens-sheet.md`
* **Deployment & QA Pack** → `docs/deployment-qa-pack.md`

---

Use the `config/` folder to maintain a stable, consistent, and reproducible development and deployment environment ✅
