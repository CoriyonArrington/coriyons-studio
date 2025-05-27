# 📁 .github/ — Project Workflow & GitHub Automation

This folder contains GitHub-related configuration files used to support:

* CI/CD automation (via GitHub Actions)
* Contribution templates (e.g., issues, PRs)
* Repository labels, milestones, and workflows

---

## ✅ Who This Is For

* Developers submitting pull requests or pushing to branches
* Collaborators maintaining automation workflows
* AI tools or bots syncing issues and labels via CLI

---

## 📂 Key Contents

| File / Folder              | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `workflows/ci.yml`         | CI pipeline that runs tests, scripts, and Supabase checks on PRs        |
| `ISSUE_TEMPLATE/`          | Templates for bug reports, feature requests, and feedback (if present)  |
| `PULL_REQUEST_TEMPLATE.md` | Checklist for submitting high-quality PRs (linked from `07-reference/`) |

---

## ⚙️ CI/CD Pipeline

The CI workflow includes:

* Test suite execution (`tests/`)
* Script validation for Supabase types and schema drift
* Lint and format checks (if configured)

PRs and pushes to `main` will trigger this pipeline. Status checks are required before merge (see repo settings).

---

## 📌 Related Scripts

These scripts help bootstrap GitHub metadata. See `scripts/README.md` for usage.

---

## 🧩 Related Docs

* `docs/07-reference/github-workflows.md`
* `docs/07-reference/commit-message-template.md`
* `docs/07-reference/pull-request-template.md`

---

Maintain this folder to ensure a reliable development process and consistent contribution quality.
