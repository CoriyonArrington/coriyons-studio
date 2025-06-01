# 🗃️ Database Schemas — Coriyon’s Studio

This schema defines all database tables powering the CMS, services, case studies, blog, FAQs, design process, UX problem/solution tracking, feedback tools, and general page content on the Coriyon’s Studio platform.

It follows Supabase best practices, supports role-based access (RLS), and powers dynamic rendering across various site sections.

---

## ✅ `pages`

| Column             | Type                             | Purpose                                                                 | Notes                                                        |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `id`               | UUID                             | Page ID                                                                 | PK, Default: `gen_random_uuid()`                             |
| `slug`             | TEXT                             | Route slug                                                              | Unique, Not Null. Used for dynamic routing `/[slug]/page.tsx`  |
| `title`            | TEXT                             | Page title for HTML `<title>` tag & SEO                                 | Not Null                                                     |
| `page_type`        | `public.page_type_enum`          | Categorizes the page (e.g., MAIN, RESOURCES)                            | Not Null, Default: `STANDARD`. ENUM: ('MAIN', 'RESOURCES', 'LEGAL', 'PRODUCT', 'MARKETING', 'CONTENT_HUB', 'STANDARD', 'OTHER') |
| `content`          | JSONB                            | Structured page content (sections, hero, CTAs, etc.)                    | Rendered by page components                                  |
| `meta_description` | TEXT                             | SEO meta description for the page                                       |                                                              |
| `og_image_url`     | TEXT                             | Open Graph image URL for social sharing                                 |                                                              |
| `status`           | `public.page_status_enum`        | Publication status of the page                                          | Not Null, Default: `DRAFT`. ENUM: ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') |
| `published_at`     | TIMESTAMPTZ                      | Timestamp for when the page is/was published                            |                                                              |
| `user_id`          | UUID                             | Optional: links to user who created/edited                              | Nullable                                                     |
| `sort_order`       | INTEGER                          | For ordering pages, e.g., in footer categories                          | Default: `0`                                                 |
| `created_at`       | TIMESTAMPTZ                      | Created time                                                            | Default: `now()`                                             |
| `updated_at`       | TIMESTAMPTZ                      | Last updated time                                                       | Default: `now()`, Auto-updates                               |

**RLS:**
* Public can read `PUBLISHED` pages.
* Admins/Editors have broader CUD access (specific policies to be defined).

---

## ✅ `services`

| Column             | Type        | Purpose                                         | Notes                                    |
| ------------------ | ----------- | ----------------------------------------------- | ---------------------------------------- |
| `id`               | UUID        | Service ID                                      | PK, Default: `gen_random_uuid()`         |
| `slug`             | TEXT        | URL identifier                                  | Unique, Not Null. Route: `/services/[slug]` |
| `title`            | TEXT        | Service title                                   | Not Null. Used in cards and hero blocks  |
| `description`      | TEXT        | Short blurb                                     | Card and meta use                        |
| `content`          | JSONB       | Full page content                               | Rich sections (hero, process)            |
| `featured_image_url` | TEXT      | URL for a representative image                  |                                          |
| `featured`         | BOOLEAN     | Flag to indicate if the service is featured     | Default: `FALSE`                         |
| `sort_order`       | INTEGER     | Numerical value for manual sorting              | Default: `0`                             |
| `created_at`       | TIMESTAMPTZ | Created time                                    | Default: `now()`                         |
| `updated_at`       | TIMESTAMPTZ | Last updated time                               | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD (specific policies to be defined).

---

## ✅ `projects` (Case Studies)

| Column             | Type        | Purpose                                         | Notes                                    |
| ------------------ | ----------- | ----------------------------------------------- | ---------------------------------------- |
| `id`               | UUID        | Project ID                                      | PK, Default: `gen_random_uuid()`         |
| `slug`             | TEXT        | URL slug                                        | Unique, Not Null. Route: `/work/[slug]`  |
| `title`            | TEXT        | Project title                                   | Not Null. Display name                   |
| `client_name`      | TEXT        | Name of the client for the project              |                                          |
| `project_date`     | DATE        | Date of project completion or key milestone     |                                          |
| `description`      | TEXT        | Short summary/excerpt for project listing cards | Renamed from `excerpt`                   |
| `featured_image_url` | TEXT      | Main image for card/listing previews            | Was `featured_img`                       |
| `og_image_url`     | TEXT        | Open Graph image URL for social sharing       |                                          |
| `content`          | JSONB       | Detailed case study content                     | Was Markdown, now JSONB for richer structure |
| `featured`         | BOOLEAN     | True if the project should be highlighted       | Default: `FALSE`                         |
| `sort_order`       | INTEGER     | Manual sort order for displaying projects       | Not Null, Default: `0`                   |
| `created_at`       | TIMESTAMPTZ | Created time                                    | Default: `now()`                         |
| `updated_at`       | TIMESTAMPTZ | Last updated time                               | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---

## ✅ `testimonials`

| Column         | Type        | Purpose                                         | Notes                                    |
| -------------- | ----------- | ----------------------------------------------- | ---------------------------------------- |
| `id`           | UUID        | Testimonial ID                                  | PK, Default: `gen_random_uuid()`         |
| `name`         | TEXT        | Name of the person providing the testimonial    | Not Null                                 |
| `role`         | TEXT        | Role or title of the person                     | E.g. "Founder, MindCo"                   |
| `company_name` | TEXT        | Name of the company the person is affiliated with |                                          |
| `avatar_url`   | TEXT        | URL for the testimonial provider's photo/avatar |                                          |
| `quote`        | TEXT        | The full text of the testimonial                | Not Null                                 |
| `project_id`   | UUID        | Optional link to a specific project             | FK to `projects.id`, `ON DELETE SET NULL`|
| `featured`     | BOOLEAN     | True if the testimonial should be highlighted   | Default: `FALSE`                         |
| `sort_order`   | INTEGER     | Manual sort order for displaying testimonials   | Default: `0`                             |
| `created_at`   | TIMESTAMPTZ | Created time                                    | Default: `now()`                         |
| `updated_at`   | TIMESTAMPTZ | Last updated time                               | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---

## ✅ `faq_categories`

| Column        | Type        | Purpose                                    | Notes                                    |
| ------------- | ----------- | ------------------------------------------ | ---------------------------------------- |
| `id`          | UUID        | FAQ Category ID                            | PK, Default: `gen_random_uuid()`         |
| `name`        | TEXT        | Display name of the FAQ category           | Not Null, Unique                         |
| `slug`        | TEXT        | URL-friendly slug for the category         | Not Null, Unique                         |
| `description` | TEXT        | Optional description of the FAQ category   |                                          |
| `sort_order`  | INTEGER     | Manual sort order for FAQ categories       | Default: `0`                             |
| `created_at`  | TIMESTAMPTZ | Created time                               | Default: `now()`                         |
| `updated_at`  | TIMESTAMPTZ | Last updated time                          | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---

## ✅ `faqs`

| Column            | Type        | Purpose                                         | Notes                                    |
| ----------------- | ----------- | ----------------------------------------------- | ---------------------------------------- |
| `id`              | UUID        | FAQ ID                                          | PK, Default: `gen_random_uuid()`         |
| `question`        | TEXT        | FAQ question text                               | Not Null                                 |
| `answer`          | JSONB       | Answer body, allows rich formatting             | Not Null (was Text)                      |
| `faq_category_id` | UUID        | Optional link to an FAQ category                | FK to `faq_categories.id`, `ON DELETE SET NULL` |
| `sort_order`      | INTEGER     | Manual sort order for FAQs                      | Default: `0`                             |
| `featured`        | BOOLEAN     | True if the FAQ should be highlighted           | Default: `FALSE`                         |
| `created_at`      | TIMESTAMPTZ | Created time                                    | Default: `now()`                         |
| `updated_at`      | TIMESTAMPTZ | Last updated time                               | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---

## ✅ `design_process_steps`
(Formerly `process_phases` in your document)

| Column          | Type        | Purpose                                              | Notes                                    |
| --------------- | ----------- | ---------------------------------------------------- | ---------------------------------------- |
| `id`            | UUID        | Step ID                                              | PK, Default: `gen_random_uuid()`         |
| `title`         | TEXT        | The main title or name of the design process step    | Not Null                                 |
| `slug`          | TEXT        | URL-friendly slug if the step has a dedicated page | Unique, Not Null                         |
| `description`   | TEXT        | A brief description of the step                      |                                          |
| `content`       | JSONB       | Detailed structured content about the step           |                                          |
| `icon_id`       | UUID        | Optional FK to an icon representing the step         | FK to `icons.id`, `ON DELETE SET NULL`   |
| `sort_order`    | INTEGER     | Numerical value to define the order of the steps     | Not Null, Default: `0`                   |
| `created_at`    | TIMESTAMPTZ | Created time                                         | Default: `now()`                         |
| `updated_at`    | TIMESTAMPTZ | Last updated time                                    | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---
## ✅ `posts` (Blog Posts)

| Column             | Type                     | Purpose                                                        | Notes                                    |
| ------------------ | ------------------------ | -------------------------------------------------------------- | ---------------------------------------- |
| `id`               | UUID                     | Post ID                                                        | PK, Default: `gen_random_uuid()`         |
| `slug`             | TEXT                     | URL-friendly unique identifier for the post                    | Unique, Not Null                         |
| `title`            | TEXT                     | Title of the blog post                                         | Not Null                                 |
| `excerpt`          | TEXT                     | Short summary or excerpt of the post                           |                                          |
| `content`          | JSONB                    | Rich content for the blog post                                 |                                          |
| `featured_image_url` | TEXT                   | URL for the main image of the post                             |                                          |
| `og_image_url`     | TEXT                     | URL for the Open Graph image for social sharing                |                                          |
| `status`           | `public.post_status`     | Publication status of the post                                 | Not Null, Default: `draft`. ENUM: ('draft', 'pending_review', 'published', 'archived') |
| `published_at`     | TIMESTAMPTZ              | Timestamp of when the post was or is scheduled to be published |                                          |
| `author_id`        | UUID                     | Optional link to the user/author who wrote the post          | Nullable                                 |
| `featured`         | BOOLEAN                  | True if the post should be highlighted                         | Default: `FALSE`                         |
| `created_at`       | TIMESTAMPTZ              | Created time                                                   | Default: `now()`                         |
| `updated_at`       | TIMESTAMPTZ              | Last updated time                                              | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read `published` posts.
* Admins/Authors have broader CUD access.

---
## ✅ `tags` (Centralized)

| Column        | Type        | Purpose                                                      | Notes                                    |
| ------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------- |
| `id`          | UUID        | Tag ID                                                       | PK, Default: `gen_random_uuid()`         |
| `name`        | TEXT        | The display name of the tag                                  | Not Null, Unique                         |
| `slug`        | TEXT        | URL-friendly slug for the tag                                | Not Null, Unique                         |
| `description` | TEXT        | Optional description for the tag                             |                                          |
| `created_at`  | TIMESTAMPTZ | Created time                                                 | Default: `now()`                         |
| `updated_at`  | TIMESTAMPTZ | Last updated time                                            | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---
## ✅ `icons`

| Column         | Type        | Purpose                                                      | Notes                                    |
| -------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------- |
| `id`           | UUID        | Icon ID                                                      | PK, Default: `gen_random_uuid()`         |
| `name`         | TEXT        | Unique machine-readable name or key for the icon             | Not Null, Unique                         |
| `description`  | TEXT        | Optional description of the icon's purpose or context        |                                          |
| `icon_library` | TEXT        | Optional: The library or source of the icon                  | E.g., "Heroicons", "Custom"              |
| `created_at`   | TIMESTAMPTZ | Created time                                                 | Default: `now()`                         |
| `updated_at`   | TIMESTAMPTZ | Last updated time                                            | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---
## ✅ `ux_problems`

| Column        | Type        | Purpose                                                      | Notes                                    |
| ------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------- |
| `id`          | UUID        | UX Problem ID                                                | PK, Default: `gen_random_uuid()`         |
| `title`       | TEXT        | Title of the UX problem                                      | Not Null                                 |
| `slug`        | TEXT        | URL-friendly slug if the UX problem has a dedicated detail page | Unique, Not Null                         |
| `description` | TEXT        | A concise description of the UX problem                      |                                          |
| `content`     | JSONB       | Optional: Richer, structured content detailing the UX problem |                                          |
| `icon_id`     | UUID        | Optional: Foreign key to an icon representing the problem    | FK to `icons.id`, `ON DELETE SET NULL`   |
| `featured`    | BOOLEAN     | True if the problem should be highlighted                    | Default: `FALSE`                         |
| `sort_order`  | INTEGER     | Manual sort order for displaying problems                    | Not Null, Default: `0`                   |
| `created_at`  | TIMESTAMPTZ | Created time                                                 | Default: `now()`                         |
| `updated_at`  | TIMESTAMPTZ | Last updated time                                            | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---
## ✅ `ux_solutions`

| Column        | Type        | Purpose                                                      | Notes                                    |
| ------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------- |
| `id`          | UUID        | UX Solution ID                                               | PK, Default: `gen_random_uuid()`         |
| `title`       | TEXT        | Title of the UX solution                                     | Not Null                                 |
| `slug`        | TEXT        | URL-friendly slug for the UX solution                        | Unique, Not Null                         |
| `description` | TEXT        | A concise summary of the UX solution                         |                                          |
| `content`     | JSONB       | Optional: Richer, structured content detailing the solution  | E.g., key benefits, approach           |
| `icon_id`     | UUID        | Optional: Foreign key to an icon representing the solution   | FK to `icons.id`, `ON DELETE SET NULL`   |
| `featured`    | BOOLEAN     | True if the solution should be highlighted                   | Default: `FALSE`                         |
| `sort_order`  | INTEGER     | Manual sort order for displaying solutions                   | Not Null, Default: `0`                   |
| `created_at`  | TIMESTAMPTZ | Created time                                                 | Default: `now()`                         |
| `updated_at`  | TIMESTAMPTZ | Last updated time                                            | Default: `now()`, Auto-updates           |

**RLS:**
* Public can read all.
* Admins can CUD.

---
## ✅ Join Tables
*(These tables manage many-to-many relationships. They typically include foreign keys to the parent tables and a `created_at` timestamp. RLS generally allows public read of the links and admin CUD.)*

* **`project_tags`**: Links `projects` to `tags`. (Columns: `id`, `project_id`, `tag_id`, `created_at`)
* **`project_services`**: Links `projects` to `services`. (Columns: `id`, `project_id`, `service_id`, `created_at`)
* **`post_tags`**: Links `posts` to `tags`. (Columns: `id`, `post_id`, `tag_id`, `created_at`)
* **`testimonial_services`**: Links `testimonials` to `services`. (Columns: `id`, `testimonial_id`, `service_id`, `created_at`)
* **`faq_pages`**: Links `faqs` to `pages`. (Columns: `id`, `faq_id`, `page_id`, `created_at`)
* **`ux_problem_pages`**: Links `ux_problems` to `pages`. (Columns: `id`, `ux_problem_id`, `page_id`, `created_at`)
* **`ux_solution_pages`**: Links `ux_solutions` to `pages`. (Columns: `id`, `ux_solution_id`, `page_id`, `created_at`)
* **`ux_problem_solutions`**: Links `ux_problems` to `ux_solutions`. (Columns: `id`, `ux_problem_id`, `ux_solution_id`, `created_at`)

---

## ✅ `quizzes`, `questions`, `options`
*(These tables were part of the original schema overview. We have not detailed or modified them in our recent schema definition work. The definitions below are from your provided file.)*

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

**RLS:** Public can take quiz; only admins can write.

---

## ✅ `contact_submissions` & `feedback_submissions`

**`contact_submissions`**
(Updated to include `user_id` and management fields)

| Column         | Type        | Purpose                                     | Notes                            |
| -------------- | ----------- | ------------------------------------------- | -------------------------------- |
| `id`           | UUID        | Submission ID                               | PK, Default: `gen_random_uuid()` |
| `name`         | TEXT        | Sender's name                               |                                  |
| `email`        | TEXT        | Sender's email                              |                                  |
| `message`      | TEXT        | Message content                             | Not Null                         |
| `source_page`  | TEXT        | Page/form identifier of submission origin |                                  |
| `ip_address`   | INET        | Submitter's IP address                      |                                  |
| `user_agent`   | TEXT        | Submitter's user agent                      |                                  |
| `user_id`      | UUID        | Optional: Link to authenticated user        | Nullable                         |
| `is_read`      | BOOLEAN     | Has the message been read by an admin?      | Default: `FALSE`                 |
| `archived`     | BOOLEAN     | Has the message been archived?              | Default: `FALSE`                 |
| `created_at`   | TIMESTAMPTZ | Time sent                                   | Default: `now()`                 |

**RLS:** Public can insert; Admins can CUD (Note: RLS for anon insert may require service key workaround per `known-issues.md`).

**`feedback_submissions`**
(Updated with more detail and management fields, was `feedback` in your doc)

| Column                | Type        | Purpose                                                 | Notes                                    |
| --------------------- | ----------- | ------------------------------------------------------- | ---------------------------------------- |
| `id`                  | UUID        | Feedback ID                                             | PK, Default: `gen_random_uuid()`         |
| `clarity_rating`      | INTEGER     | User rating for clarity (e.g., 1-5)                     | `CHECK (>= 1 AND <= 5)`                  |
| `usefulness_rating`   | INTEGER     | User rating for usefulness (e.g., 1-5)                  | `CHECK (>= 1 AND <= 5)`                  |
| `satisfaction_rating` | INTEGER     | User rating for overall satisfaction (e.g., 1-5)        | `CHECK (>= 1 AND <= 5)`                  |
| `feedback_type`       | TEXT        | Type of feedback (e.g., general, bug, feature)        |                                          |
| `comments`            | TEXT        | Freeform textual feedback                               |                                          |
| `source_url`          | TEXT        | The URL of the page from which feedback was submitted   |                                          |
| `user_id`             | UUID        | Optional: Link to authenticated user                    | Nullable                                 |
| `email`               | TEXT        | Email address provided by an anonymous submitter        |                                          |
| `user_agent`          | TEXT        | Submitter's user agent                                  |                                          |
| `ip_address`          | INET        | Submitter's IP address                                  |                                          |
| `is_actioned`         | BOOLEAN     | Has this feedback been reviewed/actioned by an admin? | Default: `FALSE`                         |
| `archived`            | BOOLEAN     | Has the feedback submission been archived?              | Default: `FALSE`                         |
| `created_at`          | TIMESTAMPTZ | Time submitted                                          | Default: `now()`                         |

**RLS:** Public (anon, authenticated) can insert; Admins can CUD.

---