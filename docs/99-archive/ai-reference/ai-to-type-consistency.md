# ✅ AI-to-Type Consistency — General Applications

This guide outlines how to align AI-generated UIs (via **v0.dev**, **Lovable**, or similar tools) with your actual **Zod schemas**, **TypeScript types**, and **database structure**.

---

## 🧩 The Core Challenge

AI tools can rapidly generate UI layouts and forms, but:

* They don’t know your **data model**  
* They often mislabel fields, types, or validation logic  
* They lack your **custom auth, roles, and edge-case logic**

This guide helps you close that gap.

---

## ✅ Solutions & Techniques

### 1. **Overlay Zod Schema in Prompts**

Paste your real form schema into your AI prompt to steer the output:

```ts
// lib/schemas/form.ts
const FormPayload = z.object({
  name: z.string(),
  age: z.number(),
  preferences: z.array(z.string()),
  notes: z.string().optional(),
  created_at: z.date(),
});
```

**Prompt example:**
> “Generate a form matching this Zod schema using Tailwind and Shadcn UI. Use `<Input />`, `<Textarea />`, and `<Select />` where appropriate.”

---

### 2. **Use Schema Overlays in Figma**

Add a matching schema table alongside your mockups:

| Field Label   | Zod Field       | Type       | Required? | Notes                       |
|---------------|-----------------|------------|-----------|-----------------------------|
| Name          | `name`          | `string`   | ✅         | Simple text input          |
| Age           | `age`           | `number`   | ✅         | Number input               |
| Preferences   | `preferences[]` | `string[]` | ✅         | Multi-select checkboxes     |
| Notes         | `notes`         | `string?`  | ⬜         | Optional textarea           |
| Created At    | `created_at`    | `date`     | ✅         | Auto-timestamp              |

---

### 3. **Reference Component-to-Type Mapping**

Keep a central mapping file, e.g. `component-type-mapping.md`:

| Component Name | Uses Type        | Schema File         | Notes                     |
|----------------|------------------|---------------------|---------------------------|
| GenericForm    | `FormPayload`    | `schemas/form.ts`   | Main data-entry form      |
| ListItem       | `ListItemType`   | `schemas/list.ts`   | For item lists            |
| NoteCard       | `NoteType`       | `schemas/note.ts`   | Displays notes in UIs     |

---

### 4. **Review During QA**

* ✅ Ensure each UI field matches a defined schema field  
* ✅ Confirm types and required status follow validation rules  
* ✅ Verify props are correctly passed to components  
* ✅ Check database relations (e.g., foreign keys) align with UI 

---

## 🔗 Related Files

* [`ai-prompt-template.md`](./ai-prompt-template.md)  
* [`component-type-mapping.md`](./component-type-mapping.md)  
* [`design-to-code-workflow.md`](./design-to-code-workflow.md)  
* [`figma-schema-overlay.md`](./figma-schema-overlay.md)

_⏱ Last updated: May 30, 2025_
