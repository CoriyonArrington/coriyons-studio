# 🧭 `app/` — Next.js App Router & Folder Structure

This folder contains the top-level **Next.js 14 App Router** layouts, pages, route groups, and dynamic routes for Coriyon’s Studio. All route-based UI originates here, branching into client‑facing portfolio and services, interactive playground tools, secure admin dashboard, and resource articles.

---

## ✅ Who This Is For

* Frontend developers working with Next.js App Router and React Server Components
* Contributors managing global layouts, metadata, and SSR/CSR boundaries

---

## 📁 Folder & File Structure Overview

| File / Folder           | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `layout.tsx`            | Root layout wrapper: shared `<head>`, header, footer, and providers |
| `page.tsx`              | Optional root-level homepage or redirect to `/work`                 |
| `globals.css`           | Base Tailwind CSS imports, custom font definitions                  |
| `work/`                 | Dynamic case studies: `/work/[slug]`                                |
| `services/`             | CMS-driven service pages: `/services/[slug]`                        |
| `bundles/`              | Package overview and details: `/bundles` & `/bundles/[slug]`        |
| `consulting/`           | Advisory consulting offer: `/consulting`                            |
| `studio/`               | Studio overview & case study listing under `/studio`                |
| `playground/`           | Interactive tools: DBT Diary Card, Health Tracker, Quiz             |
| `dashboard/`            | Admin dashboard: content CRUD, user management (SSR-enabled)        |
| `resources/`            | Blog, FAQ, process articles under `/resources`                      |
| `support/`              | Help and contact page                                               |
| `privacy-policy/`, etc. | Legal & support routes: Privacy, Terms, Security, Accessibility     |
| `api/`                  | Route handlers for server-side logic and webhooks                   |

---

## ⚙️ Rendering Guidelines

* **Server-Side Rendering (SSR):** Prefer SSR for data-driven pages (dashboard, case studies, services).
* **Client Components:** Use `"use client"` only when you need React state or browser-only APIs (e.g., interactive quizzes).
* **API Isolation:** Keep API routes under `app/api/` for clear separation of concerns.

---

## 🗺️ Route Groups & Details

### `(main)` — Marketing & Core

| Route              | Purpose                   | Components                        | Types         | Tables     |
| ------------------ | ------------------------- | --------------------------------- | ------------- | ---------- |
| `/`                | Homepage                  | `HeroSection`, `CTASection`, etc. | `Hero`, `CTA` | `pages`    |
| `/about`           | Studio background         | `AboutSection`, `ContentSection`  | `Page`        | `pages`    |
| `/contact`         | Contact form              | `ContactForm`, `CTASection`       | `Page`        | `pages`    |
| `/pricing`         | Services pricing overview | `PricingTable`, `CTASection`      | `Page`        | `pages`    |
| `/services`        | All UX services           | `ServiceCard`, `ServicesSection`  | `Service`     | `services` |
| `/services/[slug]` | Individual service page   | `HeroSection`, `ContentSection`   | `Service`     | `services` |
| `/bundles`         | Package overview          | `ServiceCard`, `BundleCard`       | `Page`        | `pages`    |
| `/bundles/[slug]`  | Individual bundle offer   | `HeroSection`, `CTASection`       | `Page`        | `pages`    |
| `/consulting`      | Advisory consulting offer | `HeroSection`, `WhyUXSection`     | `Page`        | `pages`    |

### `(studio)` — Studio Section

| Route                  | Purpose                    | Components                        | Types         | Tables           |
| ---------------------- | -------------------------- | --------------------------------- | ------------- | ---------------- |
| `/studio`              | Studio overview page       | `HeroSection`, `ContentSection`   | `Page`        | `pages`          |
| `/studio/work`         | Case study listing         | `ProjectCard`, `ProjectsSection`  | `Project`     | `projects`       |
| `/studio/work/[slug]`  | Project detail page        | `MarkdownRenderer`, `HeroSection` | `Project`     | `projects`       |
| `/studio/testimonials` | Client feedback & quotes   | `TestimonialCard`                 | `Testimonial` | `testimonials`   |
| `/studio/process`      | UX design process overview | `ProcessSection`                  | `Process`     | `process_phases` |
| `/studio/faq`          | Frequently asked questions | `FAQItem`, `FAQSection`           | `FAQ`         | `faqs`           |

### `(labs)` — Interactive Playground

| Route                           | Purpose                    | Components                  | Types   | Tables                            |
| ------------------------------- | -------------------------- | --------------------------- | ------- | --------------------------------- |
| `/labs`                         | Tools overview             | `ToolCard`, `HeroSection`   | `Page`  | `pages`                           |
| `/labs/dbt-diary-card`          | DBT client journal tracker | `DiaryForm`, `EntryList`    | `Entry` | `entries`, `trackers`             |
| `/labs/therapist-dashboard`     | Therapist dashboard        | `ClientCard`, `NotesList`   | `Note`  | `notes`, `users`                  |
| `/labs/health-progress-tracker` | Health log tracker         | `TrackerGraph`, `EntryForm` | `Entry` | `tracker_logs`                    |
| `/labs/interactive-quiz`        | Quiz framework demo        | `QuizForm`, `Scorecard`     | `Quiz`  | `quizzes`, `questions`, `options` |

### `(resources)` — Blog & Articles

| Route                       | Purpose                  | Components                | Types     | Tables           |
| --------------------------- | ------------------------ | ------------------------- | --------- | ---------------- |
| `/resources/blog`           | Articles landing         | `BlogCard`, `BlogSection` | `Blog`    | `blog`           |
| `/resources/blog/[slug]`    | Individual blog post     | `MarkdownRenderer`        | `Blog`    | `blog`           |
| `/resources/faq`            | CMS-managed FAQ page     | `FAQItem`, `FAQSection`   | `FAQ`     | `faqs`           |
| `/resources/process`        | Design process overview  | `ProcessSection`          | `Process` | `process_phases` |
| `/resources/process/[slug]` | Specific UX phase detail | `ContentSection`          | `Process` | `process_phases` |

### Legal & Support Pages

| Route             | Purpose                 | Components    | Tables  |
| ----------------- | ----------------------- | ------------- | ------- |
| `/support`        | Help and contact        | `SupportCard` | `pages` |
| `/privacy-policy` | Privacy Policy          | —             | `pages` |
| `/terms-of-use`   | Terms of Use            | —             | `pages` |
| `/security`       | Security policies       | —             | `pages` |
| `/accessibility`  | Accessibility statement | —             | `pages` |

---

## 📌 Related Documentation

* Directory Structure → `docs/04-development/directory-structure.md`
* API Routes Reference → `docs/04-development/api-routes.md`
* Design System & Tokens → `docs/03-design/design-tokens-sheet.md`

Use this `app/` folder as the routing brain of your studio platform 🚀
