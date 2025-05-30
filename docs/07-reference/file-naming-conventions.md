--- docs/07-reference/file-naming-conventions.md ---
# File Naming Conventions – Coriyon’s Studio

This document outlines naming guidelines for files and folders to ensure consistency, clarity, and scalability.

---

## 🧱 General Rules

* Use `kebab-case` for all file and folder names  
* Use lowercase only  
* Separate words with hyphens (no underscores or camelCase)  
* Avoid abbreviations unless commonly known (e.g., `api`, `db`)  

---

## 📁 Pages & Routes

* Match file name to route: `/login` → `login/page.tsx`  
* Dynamic routes: `[clientId]`, `[entryId]`, etc.  

---

## 🧩 Components

* Place shared UI components under `/components/ui`  
* Prefix specialized components: `dashboard-header.tsx`, `tracker-card.tsx`  
* Component files match export name: `TrackerForm.tsx` → `tracker-form.tsx`  

---

## 📂 Scripts & Utils

* `generate-directory-structure.sh`, `update-supabase-types.sh`, `verify-schema-types.sh`  
* Keep short and scoped to task  

---

_⏱ Last updated: May 29, 2025_
