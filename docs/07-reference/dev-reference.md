# Developer Reference Guide – Coriyon’s Studio

A consolidated guide containing all core developer workflows, templates, and conventions. Use this single document to access commit and PR templates, file naming guidelines, debugging processes, and README scaffolding.

---
## 📘 Table of Contents

1. [Commit Message Template](#commit-message-template)  
2. [Pull Request Template](#pull-request-template)  
3. [README / File Template](#readme--file-template)  
4. [File Naming Conventions](#file-naming-conventions)  
5. [Debugging Process](#debugging-process)  
6. [Next Steps: AI Collaboration Guidelines](#next-steps-ai-collaboration-guidelines)

---
## Commit Message Template

> **Location:** `docs/07-reference/commit-message-template.md`

Consistent and descriptive commit messages are crucial for maintaining a clear project history and facilitating collaboration. Follow this format:

```
<type>(<scope>): <short summary>

[optional body: detailed explanation, 72-character wrap]

[optional footer: BREAKING CHANGE, Closes #issue, etc.]
```

1. **Type** (must be one of):
   - `feat`: new feature or functionality  
   - `fix`: bug fix  
   - `docs`: documentation-only changes  
   - `style`: formatting, white-space, no code logic  
   - `refactor`: code changes without feature or bug fix  
   - `perf`: performance improvements  
   - `test`: adding or fixing tests  
   - `build`: changes affecting build system or dependencies  
   - `ci`: changes to CI config or scripts  
   - `chore`: other changes not modifying src or tests  
   - `revert`: revert a previous commit  

2. **Scope** (optional): A noun describing the section of code affected, e.g., `(api)`, `(auth)`, `(ui)`, `(lint)`, `(ci)`, `(deps)`, `(scripts)`.

3. **Short Summary:**
   - Imperative, present tense (e.g., “add”, not “added”).  
   - Lowercase first letter, no period at end.  
   - Ideally ≤50 characters (≤72 acceptable).  

4. **Body (Optional):**
   - Use present tense and describe *what* and *why*, not *how*.  
   - Wrap lines at ~72 characters.  

5. **Footer (Optional):**
   - `BREAKING CHANGE: <description>` on its own line for major changes.  
   - Reference issues: `Closes #123`, `Fixes #456`.  

**Examples:**
```
fix(auth): correct redirect URL after sign-in
```
```
feat(admin/faqs): implement FAQ deletion functionality

Adds a confirmation dialog and server action to allow administrators to permanently
delete FAQ entries from the FAQ table. Includes UI updates to reflect the deletion.
```

_Last updated: May 29, 2025_

---
## Pull Request Template

> **Location:** `docs/07-reference/pull-request-template.md`

Use this checklist and structure when opening a PR against `main`.

```
# Pull Request Template – Coriyon’s Studio

## Summary

*(Provide a concise overview: main goal, problem solved, feature added.)*

---

## Current Status (if applicable)

*(Describe state of changes: complete? blockers? CI status?)*

---

## Key Changes

* **New Features:**
    * ...
* **Enhancements:**
    * ...
* **Bug Fixes:**
    * ...
* **Testing:**
    * ...
* **Documentation:**
    * ...
* **CI/CD:**
    * ...

---

## Related Issues

* Closes #...
* Addresses #...

---

## Checklist

* [ ] Code follows project coding standards.
* [ ] Tests have been added or updated.
* [ ] Documentation has been updated.
* [ ] All automated checks pass.
```

_Last updated: May 29, 2025_

---
## README / File Template

> **Location:** `docs/07-reference/readme-template.md`

When creating a new folder or repository, use this template for the README:

```
# 📁 [folder-name]/ — [Short Folder Purpose] – Coriyon’s Studio

[Brief description of what the folder is for. Mention what kind of files it contains, who uses it, and why it matters.]

---

## ✅ Who This Is For

* [Type of user 1, e.g., Developers, Designers]
* [Type of user 2 (optional)]
* [AI tools or automation (if relevant)]

---

## 📁 Folder Structure or Common Files

| File / Folder  | Purpose                             |
| -------------- | ----------------------------------- |
| `[example.ts]` | [Short description of the file’s role] |
| `[subfolder/]` | [Description of grouped content]      |

---

## 🔁 Guidelines or Usage Notes

* [Tip or policy for organizing or naming files]
* [Best practices for editing or extending this folder]
* [Any caveats or dos/don’ts]

---

## ⚙️ How to Contribute or Extend

```bash
# [example command to scaffold, lint, or generate files]
```

📌 Related Docs
- `docs/xx-xxx/filename.md` — [Related reference or planning doc]
- `scripts/filename.sh` — [Related utility script]

_Last updated: May 29, 2025_
```

---
## File Naming Conventions

> **Location:** `docs/07-reference/file-naming-conventions.md`

Maintain consistency and scalability across the codebase:

- Use **kebab-case** (`lowercase-with-hyphens`) for all files and folders.  
- Use lowercase only; avoid underscores or camelCase.  
- Separate words with hyphens.  
- Avoid uncommon abbreviations (except well-known ones like `api`, `db`).  

### Pages & Routes
- Map route to file name: `/login` → `login/page.tsx`.  
- Dynamic routes: name parameters with brackets: `[clientId]/page.tsx`, `[entryId]/page.tsx`.  

### Components
- Place shared UI components under `/components/ui`.  
- Prefix specialized components: `dashboard-header.tsx`, `tracker-card.tsx`.  
- Component filename matches export name: export `TrackerForm` → `tracker-form.tsx`.

### Scripts & Utils
- Name scripts by purpose: `generate-directory-structure.sh`, `update-supabase-types.sh`, `verify-schema-types.sh`.  
- Keep names short and descriptive.  

_Last updated: May 29, 2025_

---
## Debugging Process

> **Location:** `docs/07-reference/debugging-process.md`

Follow this structured workflow to triage and fix lint/TS errors:

### 1. Identify Target File & Errors
- Run:
  ```bash
  npm run lint
  ```
- Note the first file with reported ESLint errors and line numbers.

### 2. Gather Context
- **Developer**: Copy & share entire file content to AI.  
- **Developer**: Run:
  ```bash
  npx tsc --noEmit
  ```
  to gather TypeScript errors in that file.

### 3. Propose & Implement Fixes
- **AI Assistant**: Provide the complete, updated file content with:
  - Minimal targeted fixes to resolve reported errors.
  - Comments explaining changes (beginner-friendly).
- **Developer**: Replace local file with AI-provided version.

### 4. Test & Verify
- **Developer**: Re-run:
  ```bash
  npm run lint
  ```
- **Developer**: Check IDE/editor for any lingering TS errors in that file.

### 5. Confirm or Iterate
- **If clean**: File is resolved, move to next file in lint output.
- **If errors persist**: Share new ESLint/TS errors, and AI refines fixes. Repeat steps 3–5.

### Common Error Types & Solutions
- **`@typescript-eslint/no-unused-vars`**: Remove unused imports/vars or prefix unused parameters with `_`. Use `// eslint-disable-next-line` sparingly.  
- **`react/no-unescaped-entities`**: Replace problematic characters (`<`, `>`, `'`, `"`) with HTML entities (`&lt;`, `&gt;`, `&apos;`, `&quot;`).  
- **`@typescript-eslint/no-explicit-any`**: Replace `any` with a specific type or `unknown`, then narrow. Suppress momentarily with `// @ts-expect-error <reason>` if refactor planned.  
- **TS type mismatches (e.g., `ts(2322)`, `ts(2345)`)**: Align data and prop types. Adjust interfaces or transform data as needed. Use `// @ts-expect-error` temporarily if refactor is required.  
- **`@typescript-eslint/ban-ts-comment`**: Replace `// @ts-ignore` with `// @ts-expect-error <reason>`; remove once fixed.

### Handling Deferred Issues
- For complex issues (e.g., React Hook Form type errors), use `@ts-expect-error` with comments and plan a refactor.

_Last updated: May 29, 2025_

---
## Next Steps: AI Collaboration Guidelines

A separate document will cover the AI-specific prompts, locking-in confirmation, and coding preferences when working with AI tools:

- `docs/07-reference/ai-collaboration-guidelines.md` (to be created)

Use that file to share project context, file locations, and “Do’s & Don’ts” when collaborating with AI.
