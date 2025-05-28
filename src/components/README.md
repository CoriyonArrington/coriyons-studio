# 🧱 `components/` — Shared UI Components

This folder contains **modular UI components** used across Coriyon’s Studio, built with **React + Tailwind CSS** and following the ShadCN design system patterns.
Components live here to support:

* 🎨 **Portfolio & Services** pages
* ⚙️ **Interactive Playground** tools (DBT Diary Card, Quiz, Tracker)
* 🔒 **Admin Dashboard** interfaces

---

## ✅ Who This Is For

* Frontend developers crafting new UI or refactoring existing components
* Designers and maintainers ensuring consistent application of design tokens

---

## 📂 Folder Structure

| Subfolder        | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `ui/`            | ShadCN UI & Radix-based primitives (buttons, cards, dialogs)         |
| `common/`        | Shared atoms & molecules (icons, headings, image cards, typography)  |
| `forms/`         | Form fields, inputs, validation messages, and error states           |
| `page-sections/` | Section-level blocks (Hero, Testimonials, Features)                  |
| `playground/`    | Components specific to interactive tools (Quiz controls, Tracker UI) |
| `dashboard/`     | Admin components (tables, modals, nav, toolbar)                      |
| `index.ts`       | Central exports for each domain                                      |

```bash
components/
├── ui/
├── common/
├── forms/
├── page-sections/
├── playground/
└── dashboard/
```

---

## 🧭 Guidelines

* Base all styles on the design tokens defined in `tailwind.config.ts`
* Use ShadCN/UI primitives for accessibility and consistency
* Favor composition over inheritance; build small, atomic components that can be combined
* Keep components stateless where possible; pass behavior via props or hooks
* Co-locate `*.types.ts` alongside components for complex prop definitions
* Name folders in **kebab-case** and component files in **PascalCase.tsx** per conventions
* Export domain-specific components through a single `index.ts` for simpler imports

---

## 📌 Related Documentation

* **Design Tokens** → `docs/03-design/design-tokens-sheet.md`
* **Developer Handbook (Component Conventions)** → `docs/developer-handbook.md`
* **Playground Tool Specs** → `docs/playground-tool-specs.md`

---

Use this `components/` directory to keep your UI scalable, consistent, and easy to maintain ✅
