## 📥 1. Project Primer Context

**Location:** Originally in `ai-project-primer-context.md`  

Use this section as the starting context to align any AI assistant with Coriyon’s Studio’s architecture, services, and documentation.

### TL;DR Summary (Use in Prompts)

> Coriyon’s Studio is a UX and design-development studio delivering:  
>  
> • **Research-Driven UX Sprints:** One-week sprints producing user insights, prototypes, and validated flows.  
> • **Scalable Design Systems:** Figma-to-code design system using Chakra UI tokens and Tailwind CSS.  
> • **AI-Powered Prototyping & Code:** Rapid UI generation via v0.dev, Lovable.so, and custom prompt templates—integrated into Next.js and Chakra UI.  
> • **Full-Stack Next.js App:** Frontend and backend on Next.js App Router, Supabase (auth, RLS, edge functions), and TypeScript for a modular codebase.  
> • **Comprehensive Documentation:** Planning, design, development, marketing, support & legal, and reference docs in the `docs/` folder. The database schema is managed via SQL scripts in `src/database/`.

Key docs:
- `docs/02-planning/roadmap.md`  
- `docs/03-design/design-system.md`  
- `src/database/overview-database-schemas.md` (for database structure)
- `docs/05-marketing/marketing-strategy.md`  

**Prompt Example:**
> “Here is a project primer for Coriyon’s Studio. Please refer to this context to assist with design, development, content, or marketing strategy.”

---
## 🧠 2. AI Developer Collaboration

**Location:** Originally in `ai-developer-collaboration.md`  

### Core Principles

1. **Clear Goal Definition:** Always start with a concise, overarching goal (e.g., “Clear all ESLint errors” or “Implement a new form component matching Zod schema”).  
2. **Systematic Approach:** Tackle tasks one at a time—break down multi-file or multi-error workflows into discrete steps.  
3. **Iterative Refinement:** Expect multiple feedback loops. Provide precise feedback when output doesn’t meet requirements.  
4. **Shared Context Is Key:**  
   - Provide the **full content** of any file you want AI to modify—avoid partial snippets when possible.  
   - Include **exact error messages** from the terminal/IDE for debugging tasks.  
   - Share relevant related files (e.g., type definitions from `src/types/supabase.ts`, utility functions, Zod schemas, SQL DDL from `src/database/`) when they affect the task at hand.  
5. **AI as Pair Programmer:** Treat AI as a knowledgeable teammate that can generate code, suggest approaches, and explain concepts. The human developer tests, verifies, and guides the AI with project-specific knowledge.

### Workflow Example: Resolving Lint & TypeScript Errors

1. **Developer States Goal:** “My `npm run lint` is failing—help me clear all errors for a successful build.”  
2. **Developer Provides Initial Output:** Copy-paste the full `npm run lint` or `npx tsc --noEmit` output.  
3. **Establish Action Plan:**  
   - AI proposes to address errors **file by file**.  
   - Developer confirms (e.g., “Yes—update each file fully, then re-run lint.”).  
4. **Iterative File-by-File Resolution:**  
   - **AI Identifies Target File & Error:** “File: `src/components/ui/button.tsx`, Error: `no-unused-vars` on line 12.”  
   - **Developer Shares Full File Content:** AI reviews context.  
   - **AI Proposes Solution:** Provides the **complete updated file** with targeted fixes and beginner-friendly comments.  
   - **Developer Implements & Tests:** Replaces local file content, re-runs `npm run lint`, checks IDE.  
   - **Developer Feedback:**  
     - If file passes: “`src/components/ui/button.tsx` is clear—move to next.”  
     - If new errors appear: “Error persists—now `no-undef` on line 8. Please refine.”  
5. **Complex or Deferred Issues:**  
   - If a problem requires a larger refactor (e.g., migrating React Hook Form types), apply temporary workarounds (`@ts-expect-error`) and document it as technical debt.  
6. **Final Verification:** Run a full lint/test/build to confirm the overall goal is met.

### Communication Best Practices

- **Be Specific:** Provide clear, well-scoped requests to get precise answers.  
- **Confirm Understanding:** When AI outlines a plan, acknowledge if it matches your expectation.  
- **Provide Clear Negative Feedback:** If a suggestion doesn’t work, describe why (e.g., “That removed the ESLint error, but now VSCode shows a `ts(2322)` type mismatch on prop `user`. Here’s the exact error message…”).  
- **Acknowledge Progress:** “Great—`button.tsx` is now error-free.” Positive reinforcement helps keep collaboration efficient.

---
## 🤖 3. AI-Powered Design Workflow

**Location:** Originally in `ai-powered-design-workflow.md`  

Integrate AI tools (v0.dev, Lovable.so) into your Figma → code loop, ensuring output aligns with `src/lib/theme.ts` and Chakra UI tokens.

### Tools & Usage

- **v0.dev:** Generate React/Chakra UI code snippets from prompts.  
- **Lovable.so:** Create sketch flows & mockups; refine in Figma.

### Sample Loop

1. **Prompt v0.dev:** “Generate a Chakra UI card component using these theme tokens: `colors.card.DEFAULT`, `radii.lg`, `font-heading` 2xl. Use `<Box>`, `<Heading>`, `<Text>`, and a `themedOutline` variant button.”  
2. **Copy Snippet into Code:** Paste into the appropriate `src/components/ui` file and adjust imports.  
3. **Wrap with `<ChakraProvider>`:** Ensure theme context is loaded at the app root.  
4. **Validate in Figma:** Compare colors, font sizes, and spacing against your Figma design tokens.  
5. **Refine:** Adjust prompt or styling until the component matches design specs.

---
## 🧠 4. AI Prompt Templates

**Location:** Originally in `ai-prompt-template-v0-lovable.md`  

Use these structured prompts to guide AI tools (v0.dev & Lovable) so their output conforms to Chakra UI theme and project conventions.

### Option 1: Component Generation (v0.dev)

```txt
Generate a responsive React card component using Chakra UI theme tokens:

- Background: colors.card.DEFAULT
- Text:       colors.card.foreground
- Border:     1px solid colors.border
- Radius:     radii.lg
- Heading:    font-heading, 2xl
- Body text:  font-body, base

Use `<Box>`, `<Heading>`, `<Text>`, and your `themedOutline` variant for a button.
```

### Option 2: Page Skeleton (Lovable)

```plaintext
Design a therapist dashboard page layout using:

- Theme colors: primary, background, foreground
- Font stacks: Montserrat for headings, Nunito Sans for body
- Border radii: `rounded-md` for cards
- Components: Sidebar, Tabs, Chart, Session Notes area

Export as Tailwind & Chakra UI React code.

Tip: Always append:

“Ensure colorMode supports light & dark, using mode() for tokens.”
```

---
## 🧩 5. AI-to-Type Consistency

**Location:** Originally in `ai-to-type-consistency.md`  

Align AI-generated UIs with your actual Zod schemas, TypeScript types (especially `src/types/supabase.ts`), and database structure (defined in `src/database/*.sql` and summarized in `src/database/overview-database-schemas.md`) to maintain data integrity and reduce rework.

### Core Challenges

- AI doesn’t know your backend data model or validation logic.
- UI fields may be mislabeled or mismatched against real types.
- Edge-case logic (auth, roles, RLS) isn’t included in generic AI output.

### Solutions & Techniques

**Overlay Zod Schema in Prompts**  
Paste your real schema into the AI prompt.

• Example:  
```typescript
// src/lib/schemas/contact-form-schema.ts (Example)
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  user_id: z.string().uuid().optional() // Assuming user_id from contact_submissions
});
```
Prompt:  
“Generate a React Hook Form component for this Zod schema (ContactFormSchema) using Chakra UI inputs. Include appropriate validation messages.”

---

**Use Schema Overlays in Figma**  
Create a table mapping UI labels → Database fields / Zod fields:

| Field Label    | DB Table.Column (ux_problems) | Zod Field     | Type                          | Required? | Notes                       |
| -------------- | ----------------------------- | ------------- | ----------------------------- | --------- | --------------------------- |
| Problem Title  | ux_problems.title             | title         | string                        | ✅        | Simple text input           |
| Description    | ux_problems.description       | description   | string?                       | ⬜        | Optional textarea           |
| Icon Name      | ux_problems.icon_id (links to icons.id) | icon_id | string? (UUID)               | ⬜        | Dropdown from icons table   |

---

**Reference Component-to-Type Mapping**  
Maintain a central mapping file (e.g., `docs/07-reference/component-type-mapping.md` - if you create one):

| Component Name   | Uses Type(s) from `src/types/supabase.ts` | Key Schema File(s) in `src/database/` | Notes                     |
| ---------------- | ------------------------------------------- | --------------------------------------- | ------------------------- |
| ContactForm      | Tables<'contact_submissions'>             | 01_tables_core.sql                      | Main data-entry form      |
| ServiceCard      | Tables<'services'>                         | 01_tables_core.sql                      | Displays service summary  |

---

**Review During QA**  
- Confirm each UI field matches a schema field from `src/types/supabase.ts` or relevant Zod schema.  
- Verify types, required status, and validation rules.  
- Ensure props are correctly passed to components.  
- Check database relations (foreign keys, RLS defined in `03_rls_policies.sql`, cascade rules) align with UI logic.

---
## 🔁 6. Schema-Aligned Design Loop

**Location:** Originally in `ai-schema-aligned-design-loop.md`  

A repeatable workflow for evolving UI components while preserving schema and type safety across code and database.

### Step-by-Step Process

1. **Prototype Quickly with AI**  
   Use AI (v0.dev or Lovable) to generate UI stubs without worrying about type constraints.

2. **Identify Schema Impacts Whenever You:**  
   - Replace a text input with a dropdown (e.g., selecting an icon from `public.icons` for a `design_process_step`).
   - Change numeric fields to sliders or ranges.
   - Add, remove, or rename fields that are persisted to the database.  

   You’ll likely need to update your SQL DDL, Zod schemas, and `src/types/supabase.ts` (via regeneration).

| UI Change             | Schema Impact?                | Example Fix                                                      |
| --------------------- | ----------------------------- | ---------------------------------------------------------------- |
| Text → dropdown       | ✅ Normalize into ref table    | `design_process_steps.icon_id UUID REFERENCES public.icons(id)`  |
| Checkbox list added   | ✅ Update ENUM or ref table     | Add new ENUM values (e.g., to `post_status`) or seed `tags` table |
| Optional field added  | ✅ Mark `.optional()` in Zod    | `posts.excerpt: z.string().optional()`                            |

---

**Update Schema Artifacts**

| Area             | File(s)                                           | Action                                                                                             |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Database schema  | `src/database/01_tables_core.sql` (and others)    | Add or alter table definitions. Update related triggers, RLS, indexes, comments.                    |
| Schema Overview  | `src/database/overview-database-schemas.md`       | Update the markdown documentation.                                                                  |
| Zod schema       | `src/lib/schemas/*` (e.g., `contact-form-schema.ts`) | Ensure all form fields and validation rules are defined.                                             |
| Type definitions | `src/types/supabase.ts`                           | Regenerate using `npm run supabase:types` after DB schema changes.                                   |
| Seed data        | `src/database/seed.sql`                           | Add or map new reference data, update existing seed data.                                            |
| Documentation    | (e.g., `component-type-mapping.md`)               | Update component-to-type mapping if applicable.                                                     |

---

**Test & Sync**  
- Apply SQL changes to your local and staging Supabase instances.  
- Run `npm run supabase:types` to update TypeScript types.  
- Exercise forms manually and via automated tests.  
- Confirm TypeScript types align with UI logic and database schema.

---

### Best Practices

- **Annotate Schema Impacts:** Tag design notes or PR descriptions with `[Schema Impact]:`  
  `[Schema Impact] projects.content: Changed from Markdown (TEXT) to JSONB to support structured content blocks.`

- **Use a Review Template for DB Changes (in PRs):**  

```markdown
### Database Schema Change Summary
- **Table(s) Affected:** `public.posts`, `public.tags`, `public.post_tags`
- **Change Description:** Changed post tagging from `TEXT[]` on `posts` to a centralized `tags` table and a `post_tags` join table.
- **Reason:** Improved tag management, consistency, and queryability.
- **SQL DDL Files Modified:** `01_tables_core.sql`, `03_rls_policies.sql`, `04_indexes.sql`, `05_comments.sql`
- **Seed Data Impact:** `seed.sql` updated to populate `tags` and `post_tags`.
- **Type Generation:** `npm run supabase:types` must be run after applying schema changes.
```

---

## 📚 Related Resources

- **Developer Reference:** `docs/07-reference/dev-reference.md`  
- **Commit & PR Templates:** Included in `dev-reference.md`  
- **Database README:** `src/database/README.md` (for how to apply schema scripts)  
- **Database Schemas Overview:** `src/database/overview-database-schemas.md`

_Last updated: May 31, 2025_
