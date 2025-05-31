# 📁 docs/04-development/ — Development Reference – Coriyon’s Studio

This folder previously contained individual development‑focused documentation (directory structure, tech stack, environment variables, deployment process). Most of that content has since been consolidated into the **root README.md** and the shared reference files under `docs/07-reference/`. 

Use this README as an archive/entry point to guide new contributors to the current “single‑source” development docs.

---

## ✅ Who This Is For

* **Developers & Contributors**—Anyone who needs details on folder layout, tooling, and build/test/deploy workflows.  
* **AI Assistants**—When fetching project context, start here and follow links to the consolidated references.  

---

## 📁 Folder Structure or Common Files

| File / Folder | Purpose                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `README.md`   | This file—points to current development documentation in root README.md and `docs/07-reference/`. |
| *(archived)*  | Any leftover files in this folder have been moved to `docs/99-archive/` and are no longer active. |

---

## 🔁 Guidelines or Usage Notes

* **All active development information now lives in:**  
  - **Root README.md** (at `/README.md`): primary overview of folder structure, tech stack, install/start instructions, and basic contributing guidelines.  
  - **`docs/07-reference/dev-reference.md`**: consolidated commit/PR templates, file‑naming conventions, and debugging processes.  
  - **`docs/07-reference/ai-collaboration-guidelines.md`**: AI workflows, prompt templates, and schema alignment methods.  
  - **`.github/workflows/README.md`**: in‑depth CI/CD instructions (lint/test/build/deploy steps).

* **Do not add new development docs here.** Instead, update the root README or the single‑source reference files under `docs/07-reference/`.  

---

## ⚙️ How to Contribute or Extend

```bash
# If you need to adjust development conventions (commit messages, PR templates, etc.):
#   Open  docs/07-reference/dev-reference.md  and update the relevant section.

# If you need to adjust AI collaboration workflows (lock‑in prompt, schema loops):
#   Open  docs/07-reference/ai-collaboration-guidelines.md  and update the relevant section.

# If you need to update CI/CD steps:
#   Open  .github/workflows/ci.yml  or  .github/workflows/README.md  and modify as needed.

# For any changes to folder structure or tech stack, update the root README.md directly.
```

---

## 📌 Related Docs

- **Root README:** `/README.md` — high‑level project overview, folder layout, tech stack, and install/start instructions.  
- **Developer Reference:** `docs/07-reference/dev-reference.md` — single‑source for commit/PR templates, file naming, and debugging workflows.  
- **AI Collaboration Guidelines:** `docs/07-reference/ai-collaboration-guidelines.md` — single‑source for AI‑specific prompts, iterative debugging, and schema alignment.  
- **CI/CD Instructions:** `.github/workflows/README.md` — full details on how our CI pipeline is configured and runs.  
- **Archived Development Docs:** `docs/99-archive/04-development/` — old individual files from this folder, for historical reference only.

---

_Last updated: May 31, 2025_  
