# 🗃️ Database Schemas — Coriyon’s Studio

This schema defines all database tables powering the CMS, services, case studies, feedback tools, and playground interactions on the Coriyon’s Studio platform.

It follows Supabase best practices, supports role-based access (RLS), and powers dynamic rendering across `/services/[slug]`, `/work/[slug]`, `/labs/*`, and more.

---

## ✅ `pages`

| Column       | Type      | Purpose                      | Notes                          |
| ------------ | --------- | ---------------------------- | ------------------------------ |
| `id`         | UUID      | Page ID                      | PK                             |
| `slug`       | Text      | Route slug                   | Used for dynamic routing       |
| `type`       | Text      | Page type                    | ENUM: main, solution, resource |
| `title`      | Text      | Page title                   | SEO-friendly                   |
| `content`    | JSONB     | Serialized component content | Rendered by `/[slug]/page.tsx` |
| `meta_title` | Text      | SEO title                    | Optional                       |
| `meta_desc`  | Text      | SEO description              | Optional                       |
| `created_at` | Timestamp | Created time                 | Default now()                  |

**RLS:**

* Public can `select where type != 'admin'`
* Admins can read/write all

---

## ✅ `services`

| Column        | Type      | Purpose           | Notes                            |
| ------------- | --------- | ----------------- | -------------------------------- |
| `id`          | UUID      | Service ID        | PK                               |
| `slug`        | Text      | URL identifier    | Dynamic route `/services/[slug]` |
| `title`       | Text      | Service title     | Used in cards and hero blocks    |
| `description` | Text      | Short blurb       | Card and meta use                |
| `content`     | JSONB     | Full page content | Rich sections (hero, process)    |
| `created_at`  | Timestamp | Created time      | —                                |

**RLS:**

* Public can read all
* Admins can edit

---

## ✅ `projects`

| Column         | Type      | Purpose         | Notes                           |
| -------------- | --------- | --------------- | ------------------------------- |
| `id`           | UUID      | Project ID      | PK                              |
| `slug`         | Text      | URL slug        | Dynamic route `/work/[slug]`    |
| `title`        | Text      | Project title   | Display name                    |
| `excerpt`      | Text      | Short summary   | For cards                       |
| `content`      | Markdown  | Full case study | Rendered via `MarkdownRenderer` |
| `featured_img` | Text      | Image path      | From Supabase Storage           |
| `created_at`   | Timestamp | Created time    | —                               |

**RLS:** Public read only

---

## ✅ `testimonials`

| Column       | Type      | Purpose          | Notes                  |
| ------------ | --------- | ---------------- | ---------------------- |
| `id`         | UUID      | Testimonial ID   | PK                     |
| `name`       | Text      | Client name      | Optional anonymity     |
| `role`       | Text      | Role/title       | E.g. "Founder, MindCo" |
| `quote`      | Text      | Testimonial text | —                      |
| `created_at` | Timestamp | Created time     | —                      |

**RLS:** Public read

---

## ✅ `faqs`

| Column       | Type      | Purpose      | Notes                       |
| ------------ | --------- | ------------ | --------------------------- |
| `id`         | UUID      | FAQ ID       | PK                          |
| `question`   | Text      | FAQ title    | Used in toggle displays     |
| `answer`     | Text      | Answer body  | Can be rich text / markdown |
| `category`   | Text      | Grouping key | Optional                    |
| `created_at` | Timestamp | Created time | —                           |

**RLS:** Public read

---

## ✅ `process_phases`

| Column        | Type      | Purpose            | Notes                  |
| ------------- | --------- | ------------------ | ---------------------- |
| `id`          | UUID      | Phase ID           | PK                     |
| `slug`        | Text      | Route identifier   | `/process/[slug]`      |
| `title`       | Text      | Step name          | Discovery, Audit, etc. |
| `description` | Text      | Short description  | —                      |
| `content`     | JSONB     | Full block content | CMS-driven section     |
| `created_at`  | Timestamp | Created time       | —                      |

**RLS:** Public read

---

## ✅ `quizzes`, `questions`, `options`

**Quizzes**

| Column  | Type | Purpose        |
| ------- | ---- | -------------- |
| `id`    | UUID | Quiz ID        |
| `title` | Text | Display title  |
| `slug`  | Text | URL identifier |

**Questions**

| Column    | Type | Purpose            |
| --------- | ---- | ------------------ |
| `id`      | UUID | Question ID        |
| `quiz_id` | UUID | FK to `quizzes.id` |
| `text`    | Text | Question body      |

**Options**

| Column        | Type    | Purpose              |
| ------------- | ------- | -------------------- |
| `id`          | UUID    | Option ID            |
| `question_id` | UUID    | FK to `questions.id` |
| `text`        | Text    | Option label         |
| `is_correct`  | Boolean | Grading key          |

**RLS:** Public can take quiz; only admins can write

---

## ✅ `contact_submissions` & `feedback`

**Contact Submissions**

| Column       | Type      | Purpose         |
| ------------ | --------- | --------------- |
| `id`         | UUID      | Submission ID   |
| `name`       | Text      | Sender name     |
| `email`      | Text      | Sender email    |
| `message`    | Text      | Message content |
| `created_at` | Timestamp | Time sent       |

**Feedback**

| Column       | Type      | Purpose             |
| ------------ | --------- | ------------------- |
| `id`         | UUID      | Feedback ID         |
| `rating`     | Integer   | UX or clarity score |
| `comment`    | Text      | Freeform notes      |
| `created_at` | Timestamp | Time submitted      |

**RLS:** Public can insert; admin read only

---

Let me know if you’d like:

* A Mermaid ERD diagram
* RLS policy script samples
* Supabase table seeding examples
