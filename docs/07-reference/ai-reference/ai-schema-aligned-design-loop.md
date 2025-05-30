# 🔁 Schema-Aligned Design Loop

This document describes a repeatable workflow for evolving UI components—like your core **Data Entry Form**—while preserving strict schema and type safety across code and database.

---

## 💡 Purpose

Rapid prototyping tools (v0, Lovable, etc.) let you iterate UI changes quickly, but those changes often cascade into:

* **Zod schemas** (input validation)  
* **Database schema** (tables, columns, references)  
* **TypeScript types** (inferred models)

This guide ensures you can backport UI updates safely.

---

## 🧭 Step-by-Step Process

### 1. ✅ **Prototype Quickly**

Use AI to explore UI layouts without constraints.

**Prompt example:**
```ts
const FormPayload = z.object({
  name: z.string(),
  rating: z.number().min(0).max(5),
  tags: z.array(z.string()),
  comments: z.string().optional(),
  timestamp: z.date(),
});
```

Make your UI tweak (e.g., swap text input for dropdown).

### 2. 🧠 **Identify Schema Impacts**

Whenever you:

* Replace text with a dropdown  
* Change numeric fields to ranges/scales  
* Add, remove, or rename fields

...you’ll likely need a schema update.

| UI Change             | Schema Impact?                | Example Fix                                  |
|-----------------------|-------------------------------|-----------------------------------------------|
| Text → dropdown       | ✅ Normalize into ref table   | `status_id uuid REFERENCES statuses(id)`      |
| Checkbox list added   | ✅ Update ENUM or ref table   | Add new ENUM values or seed reference rows    |
| Optional field added  | ✅ Mark `.optional()` in Zod  | `comments: z.string().optional()`             |

### 3. 📄 **Update Schema Artifacts**

| Area              | File                        | Action                                                         |
|-------------------|-----------------------------|----------------------------------------------------------------|
| Database schema   | `database-schema.md`        | Add or alter table definitions                                 |
| Zod schema        | `lib/schemas/form.ts`       | Ensure all form fields are defined                              |
| Type definitions  | `types/form.ts`             | Update `export type FormPayload = z.infer<typeof FormPayload>`  |
| Seed data         | `supabase/seed.ts`          | Add or map new reference data                                   |
| Documentation     | `component-type-mapping.md` | Update component-to-type mapping                                |

### 4. 🧪 **Test & Sync**

* Run migrations or diffs locally  
* Exercise forms manually and via automated tests  
* Confirm TypeScript types align with UI logic  

---

## 🗃️ Best Practices

### 🔖 Annotate Schema Impacts

Tag prompts or design notes with `[Schema Impact]`:

```
[Schema Impact] name → name_id, maps to `names` table
```

### 🧩 Use a Review Template

```md
### Schema Change Summary
- Field: `rating`
- Change: Number → Slider
- DB Change: Add `rating >= 0` check constraint  
- Zod: `rating: z.number().min(0)`  
- UI: `<Slider />` component  
- Types: Update `FormPayload`  
- Docs: Update component mapping  
```

---

## ✅ Recap

| Tool         | Role in Workflow                     |
|--------------|---------------------------------------|
| **AI**       | Rapid UI prototyping                  |
| **Figma**    | Visual design alignment               |
| **Zod**      | Input validation contract             |
| **Database** | Schema and RLS policies               |
| **TypeScript** | End-to-end type safety              |

_⏱ Last updated: May 30, 2025_
