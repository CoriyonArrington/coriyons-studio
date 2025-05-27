# Project Directory Structure

```
.//
├── .DS_Store
├── .env
├── .env.local
├── .eslintrc.json
├── .github/
│   ├── CONTRIBUTING.md
│   ├── README.md
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .husky/
│   └── _/
│       ├── .gitignore
│       ├── applypatch-msg*
│       ├── commit-msg*
│       ├── h
│       ├── husky.sh
│       ├── post-applypatch*
│       ├── post-checkout*
│       ├── post-commit*
│       ├── post-merge*
│       ├── post-rewrite*
│       ├── pre-applypatch*
│       ├── pre-auto-gc*
│       ├── pre-commit*
│       ├── pre-merge-commit*
│       ├── pre-push*
│       ├── pre-rebase*
│       └── prepare-commit-msg*
├── .npmrc
├── README.md
├── app/
│   ├── (auth-pages)/
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── smtp-message.tsx
│   ├── (community)/
│   ├── (labs)/
│   ├── (main)/
│   ├── (resources)/
│   ├── (studio)/
│   ├── (tutorials)/
│   │   ├── instruments/
│   │   │   └── page.tsx
│   │   └── notes/
│   │       └── page.tsx
│   ├── README.md
│   ├── actions.ts
│   ├── admin/
│   │   └── design-system/
│   │       └── page.tsx
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── opengraph-image.png
│   ├── overview-app-structure.md
│   ├── page.tsx
│   ├── protected/
│   │   ├── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── providers.tsx
│   └── twitter-image.png
├── assets/
│   ├── .DS_Store
│   ├── README.md
│   └── fonts/
│       ├── .DS_Store
│       ├── Montserrat/
│       │   ├── .DS_Store
│       │   ├── Montserrat-Italic-VariableFont_wght.ttf
│       │   ├── Montserrat-VariableFont_wght.ttf
│       │   ├── OFL.txt
│       │   └── README.txt
│       └── Nunito-Sans/
│           ├── NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf
│           ├── NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf
│           ├── OFL.txt
│           └── README.txt
├── components/
│   ├── README.md
│   ├── deploy-button.tsx
│   ├── env-var-warning.tsx
│   ├── form-message.tsx
│   ├── header-auth.tsx
│   ├── hero.tsx
│   ├── next-logo.tsx
│   ├── overview-components-structure.md
│   ├── submit-button.tsx
│   ├── supabase-logo.tsx
│   ├── theme-switcher.tsx
│   ├── tutorial/
│   │   ├── code-block.tsx
│   │   ├── connect-supabase-steps.tsx
│   │   ├── fetch-data-steps.tsx
│   │   ├── sign-up-user-steps.tsx
│   │   └── tutorial-step.tsx
│   ├── typography/
│   │   └── inline-code.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── color-mode.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── provider.tsx
│       ├── toaster.tsx
│       └── tooltip.tsx
├── components.json
├── config/
│   └── README.md
├── database/
│   ├── README.md
│   ├── overview-database-schemas.md
│   ├── rls.sql
│   ├── seed.sql
│   └── tables.sql
├── docs/
│   ├── .DS_Store
│   ├── 00-intro/
│   ├── 01-strategy/
│   │   ├── .DS_Store
│   │   ├── README.md
│   │   ├── boutique-ux-studio-name-ideas.md
│   │   ├── elevator-pitch.md
│   │   ├── multi-pillared-business-model.md
│   │   ├── one-page-business-plan.md
│   │   ├── positioning-with-employer.md
│   │   ├── studio-service-alacarte-offers.md
│   │   └── studio-service-packages.md
│   ├── 02-planning/
│   ├── 03-design/
│   ├── 04-development/
│   ├── 05-marketing/
│   ├── 06-support-legal/
│   ├── 07-reference/
│   ├── 08-testing/
│   ├── 09-launch/
│   ├── 99-archive/
│   └── README.md
├── global.css
├── hooks/
│   └── README.md
├── lib/
│   ├── README.md
│   ├── theme.ts
│   └── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   └── README.md
├── reports/
│   ├── README.md
│   ├── component-structure.json
│   └── project-directory-tree.md
├── scripts/
│   ├── README.md
│   ├── check-schema-drift.sh*
│   ├── generate-directory-structure.sh*
│   ├── generate-supabase-types.sh*
│   └── preflight-check.sh*
├── src/
│   └── README.md
├── supabase/
│   ├── .temp/
│   │   └── cli-latest
│   └── README.md
├── tailwind.config.ts
├── test_types.ts
├── tests/
│   ├── README.md
│   ├── integration/
│   │   ├── check-schema-drift.integration.test.ts
│   │   ├── generate-directory-structure.integration.test.ts
│   │   └── generate-supabase-types.integration.test.ts
│   └── unit/
│       ├── check-schema-drift.test.ts
│       ├── generate-directory-structure.test.ts
│       └── generate-supabase-types.test.ts
├── tsconfig.json
├── types/
│   ├── README.md
│   └── supabase.ts
├── utils/
│   ├── README.md
│   ├── supabase/
│   │   ├── check-env-vars.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utils.ts
└── vitest.config.ts
```
