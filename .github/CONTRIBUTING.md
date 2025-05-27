# 🤝 Contributing to the DBT App Platform

Thank you for your interest in contributing to the DBT App Platform! Whether you're a designer, developer, strategist, or product stakeholder, your input helps improve trauma-informed digital tools for DBT clients and therapists.

---

## 🧭 Getting Started

1. **Fork this repository** and clone it locally.
2. Create a new branch from `main` using a descriptive name:

   ```bash
   git checkout -b feat/add-tracker-filter
   ```
3. Install dependencies and start the local server:

   ```bash
   pnpm install
   pnpm dev
   ```
4. Follow the conventions below when submitting changes.

---

## ✅ Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clarity and automation. Examples:

```bash
feat(client): add custom emotion tracker
fix(auth): resolve login state mismatch
chore: update Supabase types
```

See `docs/07-reference/commit-message-template.md` for more.

---

## 🧪 Run Tests Before You Commit

Use Vitest to run the unit and integration test suites:

```bash
pnpm test
```

Tests are located in the `/tests` directory and will be run automatically in CI.

---

## 📋 Pull Request Checklist

Before submitting your PR:

* [ ] Clear and descriptive title using conventional commit format
* [ ] Follows project code style and structure
* [ ] Relevant tests added or updated
* [ ] No console warnings or runtime errors
* [ ] Updates documented in the proper folder (`docs/` if applicable)

> See `docs/07-reference/pull-request-template.md` for formatting help.

---

## 📦 Useful Scripts

```bash
# Sync Supabase types
./scripts/generate-supabase-types.sh

# Check for schema drift
./scripts/check-schema-drift.sh
```

See `scripts/README.md` for full usage.

---

## 💡 Contributing Beyond Code

We welcome help with:

* Accessibility audits
* UX research
* Product testing (beta)
* Security or compliance reviews
* Grant sourcing or storytelling

Open an issue or reach out via the contact form on the app’s website.

---

Thank you for helping make DBT more accessible, measurable, and modern. 🙌
