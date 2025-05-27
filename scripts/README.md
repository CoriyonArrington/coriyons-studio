# 🛠️ `scripts/` Directory

Welcome to the `scripts/` folder! This directory contains internal shell and Python scripts used for development tasks, documentation generation, database management, and project automation for Coriyon’s Studio.

---

## 📖 Purpose of This Folder

Centralize utility scripts to automate common workflows, ensure consistency, and aid in project maintenance, including:

* Interactions with Supabase (schema dumps, type generation)
* GitHub project setup (labels, milestones, issues)
* Documentation generation (directory tree, route indexes, roadmaps)
* Project scaffolding and environment validation

---

## ❗ Important Dependencies

Ensure the following CLI tools and languages are installed and authenticated:

* **Node.js & npm**: For running `package.json` scripts and Node-based tools
* **Supabase CLI**: For `generate-supabase-types.sh` and `check-schema-drift.sh` (`supabase login`, `supabase link`)
* **PostgreSQL Client (`pg_dump`)**: For `generate-database-schema.sh`
* **GitHub CLI (`gh`)**: For `create-labels.sh`, `create-milestones.sh`, `generate-roadmap.sh`, and Python scripts (`gh auth login`)
* **Python 3**: For scripts like `create-issues.py`
* **jq**: JSON processor needed by `generate-roadmap.sh`

---

## 📜 Scripts Overview

### Database & Types

* **generate-supabase-types.sh**

  * **Description:** Generates TypeScript types from the Supabase `public` schema.
  * **Command:** `npm run types:generate`
  * **Dependencies:** Supabase CLI

* **check-schema-drift.sh**

  * **Description:** Compares local `types/supabase.ts` against the remote schema to detect drift.
  * **Command:** `npm run types:check`
  * **Dependencies:** Supabase CLI

* **generate-database-schema.sh**

  * **Description:** Uses `pg_dump` to export the live database schema (schema only).
  * **Command:** `npm run db:schema:dump`
  * **Dependencies:** `pg_dump`, `DATABASE_URL` in `.env.local`

### Documentation Generation

* **generate-directory-structure.sh**

  * **Description:** Creates a Markdown view of the project folder tree in `reports/directory-structure/`.
  * **Command:** `npm run docs:structure`
  * **Dependencies:** Node.js

* **generate-route-index.sh**

  * **Description:** Builds the route index and Mermaid diagram under `reports/app-routes/`.
  * **Command:** `npm run docs:routes`
  * **Dependencies:** Node.js

* **generate-roadmap.sh**

  * **Description:** Fetches GitHub issues labeled “Roadmap” and outputs Markdown snapshots in `reports/roadmap/`, updating the `ROADMAP.md` symlink.
  * **Command:** `npm run docs:roadmap` or `./scripts/generate-roadmap.sh`
  * **Dependencies:** GitHub CLI (`gh`), `jq`, `curl`

### GitHub Project Setup

* **create-labels.sh**

  * **Description:** Bulk creates or updates GitHub labels from `labels-with-desc.tsv`.
  * **Command:** `./scripts/create-labels.sh`
  * **Dependencies:** GitHub CLI (`gh`), `labels-with-desc.tsv`

* **create-milestones.sh**

  * **Description:** Bulk creates GitHub milestones from `milestones.tsv`.
  * **Command:** `./scripts/create-milestones.sh`
  * **Dependencies:** GitHub CLI (`gh`), `milestones.tsv`

* **create-issues.py**

  * **Description:** Bulk creates GitHub issues based on a CSV roadmap file; skips rows marked 'Completed'.
  * **Command:** `python3 scripts/create-issues.py <roadmap.csv>`
  * **Dependencies:** Python 3, GitHub CLI (`gh`), roadmap CSV file

> ⚠️ Ensure environment variables in `.env.local` are configured before running scripts. Restart your terminal after changes.

---

## 🤝 How to Contribute

* Write POSIX-compliant Bash for shell scripts; use Python 3 for more complex tasks.
* Make scripts executable: `chmod +x <script>.sh`.
* Include header comments explaining purpose, usage, and dependencies.
* Update this README whenever adding or modifying scripts.
* Expose runnable scripts via `package.json` if appropriate.

For questions or suggestions, consult the project documentation or reach out to a maintainer.

Happy scripting!
