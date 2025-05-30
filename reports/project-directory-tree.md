# Project Directory Structure

```
.//
├── .DS_Store
├── .env.example
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
├── CHANGELOG.md
├── README.md
├── components.json
├── docs/
│   ├── .DS_Store
│   ├── 00-intro/
│   │   ├── .DS_Store
│   │   ├── README.md
│   │   ├── how-to-use-wiki.md
│   │   └── wiki.md
│   ├── 01-strategy/
│   │   ├── .DS_Store
│   │   ├── README.md
│   │   ├── business-planning/
│   │   │   ├── business-model-canvas.md
│   │   │   ├── financial-model-break-even.md
│   │   │   ├── one-page-business-plan.md
│   │   │   ├── revenue-opportunities.md
│   │   │   └── sales-projection-cashflow.md
│   │   ├── market-communications/
│   │   │   ├── communications-plan.md
│   │   │   └── market-analysis.md
│   │   └── service-definition/
│   │       ├── about-me.md
│   │       ├── elevator-pitch.md
│   │       ├── positioning-with-employer.md
│   │       ├── studio-service-alacarte-offers.md
│   │       ├── studio-service-packages.md
│   │       └── ux-studio-name-ideas.md
│   ├── 02-planning/
│   │   ├── README.md
│   │   ├── roadmap.md
│   │   ├── service-blueprint-overview.md
│   │   ├── service-offerings.md
│   │   ├── user-persona-matrix.md
│   │   └── ux-stack-use-cases.md
│   ├── 03-design/
│   │   ├── README.md
│   │   ├── brand-traits-and-preferences.md
│   │   ├── color-system.md
│   │   ├── design-system.md
│   │   ├── design-to-code-workflow.md
│   │   └── figma-workflow.md
│   ├── 04-development/
│   │   ├── README.md
│   │   ├── deployment-process.md
│   │   ├── directory-structure.md
│   │   ├── environment-variables.md
│   │   └── tech-stack.md
│   ├── 05-marketing/
│   │   ├── README.md
│   │   ├── customer-personas.md
│   │   ├── growth-experiments.md
│   │   ├── marketing-strategy.md
│   │   ├── messaging-framework.md
│   │   └── social-media-guidelines.md
│   ├── 06-support-legal/
│   │   ├── README.md
│   │   ├── accessibility-statement.md
│   │   ├── faq.md
│   │   ├── privacy-policy.md
│   │   ├── security-policy.md
│   │   ├── support.md
│   │   └── terms-of-use.md
│   ├── 07-reference/
│   │   ├── README.md
│   │   ├── ai-reference/
│   │   │   ├── ai-developer-collaboration.md
│   │   │   ├── ai-powered-design-workflow.md
│   │   │   ├── ai-project-primer-context.md
│   │   │   └── ai-prompt-template-v0-lovable.md
│   │   ├── commit-message-template.md
│   │   ├── debugging-process.md
│   │   ├── file-naming-conventions.md
│   │   ├── pull-request-template.md
│   │   └── readme-template.md
│   ├── 08-testing/
│   │   ├── .DS_Store
│   │   ├── README.md
│   │   ├── end-to-end-testing.md
│   │   ├── integration-testing.md
│   │   ├── mocking-and-fixtures.md
│   │   ├── test-coverage.md
│   │   ├── testing-strategy.md
│   │   └── unit-testing.md
│   ├── 09-launch/
│   │   ├── README.md
│   │   ├── checklist/
│   │   │   ├── 01-checklist-configuration.md
│   │   │   ├── 02-checklist-backend.md
│   │   │   ├── 03-checklist-frontend.md
│   │   │   ├── 04-checklist-deployment.md
│   │   │   ├── 05-launch-sprint-plan.md
│   │   │   ├── 06-checklist-mvp-product.md
│   │   │   ├── 07-checklist-security-legal.md
│   │   │   ├── 08-checklist-growth-marketing.md
│   │   │   └── 09-checklist-launch-master.md
│   │   └── synced-launch-tracker.md
│   ├── 10-other/
│   │   └── multi-pillared-business-model.md
│   ├── 99-archive/
│   └── README.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── README.md
│   ├── favicon.ico
│   ├── opengraph-image.png
│   └── twitter-image.png
├── reports/
│   ├── README.md
│   ├── component-structure.json
│   └── project-directory-tree.md
├── scripts/
│   ├── README.md
│   ├── generate-directory-structure.sh*
│   ├── preflight-check.sh*
│   ├── update-supabase-types.sh*
│   └── verify-schema-types.sh*
├── src/
│   ├── README.md
│   ├── app/
│   │   ├── (auth-pages)/
│   │   │   ├── forgot-password/
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── smtp-message.tsx
│   │   ├── (tutorials)/
│   │   │   ├── instruments/
│   │   │   └── notes/
│   │   ├── README.md
│   │   ├── actions.ts
│   │   ├── admin/
│   │   │   └── design-system/
│   │   ├── auth/
│   │   │   └── callback/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── protected/
│   │   │   ├── page.tsx
│   │   │   └── reset-password/
│   │   └── providers.tsx
│   ├── assets/
│   │   ├── .DS_Store
│   │   ├── README.md
│   │   └── fonts/
│   │       ├── .DS_Store
│   │       ├── Montserrat/
│   │       └── Nunito-Sans/
│   ├── components/
│   │   ├── README.md
│   │   ├── chakra-next-theme-syncer.tsx
│   │   ├── form-message.test.tsx
│   │   ├── form-message.tsx
│   │   ├── header-auth.test.tsx
│   │   ├── header-auth.tsx
│   │   ├── layout/
│   │   │   ├── site-footer.test.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── site-header.test.tsx
│   │   │   └── site-header.tsx
│   │   ├── submit-button.test.tsx
│   │   ├── submit-button.tsx
│   │   ├── theme-switcher.test.tsx
│   │   ├── theme-switcher.tsx
│   │   ├── typography/
│   │   │   ├── inline-code.test.tsx
│   │   │   └── inline-code.tsx
│   │   └── ui/
│   │       ├── color-mode.test.tsx
│   │       ├── color-mode.tsx
│   │       ├── provider.tsx
│   │       └── toaster.tsx
│   ├── config/
│   │   └── README.md
│   ├── database/
│   │   ├── README.md
│   │   ├── overview-database-schemas.md
│   │   ├── rls.sql
│   │   ├── seed.sql
│   │   └── tables.sql
│   ├── hooks/
│   │   └── README.md
│   ├── lib/
│   │   ├── README.md
│   │   ├── fonts.ts
│   │   ├── theme.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── types/
│   │   ├── README.md
│   │   └── supabase.ts
│   └── utils/
│       ├── README.md
│       ├── supabase/
│       │   ├── check-env-vars.ts
│       │   ├── client.ts
│       │   ├── middleware.ts
│       │   └── server.ts
│       └── utils.ts
├── supabase/
│   ├── .temp/
│   │   └── cli-latest
│   └── README.md
├── tailwind.config.ts
├── tests/
│   ├── README.md
│   ├── integration/
│   │   ├── generate-directory-structure.integration.test.ts
│   │   └── update-supabase-types.integration.test.ts
│   └── unit/
│       ├── generate-directory-structure.test.ts
│       ├── temp-verify-schema-test/
│       │   ├── mocks/
│       │   └── src/
│       └── verify-schema-types.test.ts
├── tsconfig.json
├── vitest-setup.ts
└── vitest.config.ts
```
