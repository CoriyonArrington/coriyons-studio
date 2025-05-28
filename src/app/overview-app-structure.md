# 📁 `app/` Folder Structure — Coriyon’s Studio

This document outlines the `app/` directory for **Coriyon’s Studio**, a CMS-powered Next.js App Router setup. It maps each route to its:

* Required **components** (`/components/`)
* Required **types** (`/types/`)
* Related **database tables** (in Supabase)

The structure supports fully dynamic rendering via Supabase slugs across services, case studies, bundles, tools, and resources.

---

## ✅ `app/(main)/`

| Route              | Purpose                           | Components                        | Types         | Tables     |
| ------------------ | --------------------------------- | --------------------------------- | ------------- | ---------- |
| `/`                | Homepage                          | `HeroSection`, `CTASection`, etc. | `Hero`, `CTA` | `pages`    |
| `/about`           | Studio background                 | `AboutSection`, `ContentSection`  | `Page`        | `pages`    |
| `/contact`         | Contact form                      | `ContactForm`, `CTASection`       | `Page`        | `pages`    |
| `/pricing`         | Services pricing overview         | `PricingTable`, `CTASection`      | `Page`        | `pages`    |
| `/services`        | All UX services                   | `ServiceCard`, `ServicesSection`  | `Service`     | `services` |
| `/services/[slug]` | Individual service page           | `HeroSection`, `ContentSection`   | `Service`     | `services` |
| `/bundles`         | Package overview (Kickstart, etc) | `ServiceCard`, `BundleCard`       | `Page`        | `pages`    |
| `/bundles/[slug]`  | Individual bundle offer           | `HeroSection`, `CTASection`       | `Page`        | `pages`    |
| `/consulting`      | Advisory consulting offer         | `HeroSection`, `WhyUXSection`     | `Page`        | `pages`    |

---

## ✅ `app/(studio)/`

| Route                  | Purpose                    | Components                        | Types         | Tables           |
| ---------------------- | -------------------------- | --------------------------------- | ------------- | ---------------- |
| `/studio`              | Studio overview page       | `HeroSection`, `ContentSection`   | `Page`        | `pages`          |
| `/studio/work`         | Case study listing         | `ProjectCard`, `ProjectsSection`  | `Project`     | `projects`       |
| `/studio/work/[slug]`  | Project detail page        | `MarkdownRenderer`, `HeroSection` | `Project`     | `projects`       |
| `/studio/testimonials` | Client feedback & quotes   | `TestimonialCard`                 | `Testimonial` | `testimonials`   |
| `/studio/process`      | UX design process overview | `ProcessSection`                  | `Process`     | `process_phases` |
| `/studio/faq`          | Frequently asked questions | `FAQItem`, `FAQSection`           | `FAQ`         | `faqs`           |

---

## ✅ `app/(labs)/`

| Route                           | Purpose                    | Components                  | Types   | Tables                            |
| ------------------------------- | -------------------------- | --------------------------- | ------- | --------------------------------- |
| `/labs`                         | Overview of tools          | `ToolCard`, `HeroSection`   | `Page`  | `pages`                           |
| `/labs/dbt-diary-card`          | DBT client journal tracker | `DiaryForm`, `EntryList`    | `Entry` | `entries`, `trackers`             |
| `/labs/therapist-dashboard`     | Therapist-facing dashboard | `ClientCard`, `NotesList`   | `Note`  | `notes`, `users`                  |
| `/labs/health-progress-tracker` | Health log tracker         | `TrackerGraph`, `EntryForm` | `Entry` | `tracker_logs`                    |
| `/labs/interactive-quiz`        | Quiz framework demo        | `QuizForm`, `Scorecard`     | `Quiz`  | `quizzes`, `questions`, `options` |

---

## ✅ `app/(resources)/`

| Route                       | Purpose                      | Components                | Types     | Tables           |
| --------------------------- | ---------------------------- | ------------------------- | --------- | ---------------- |
| `/resources/blog`           | Content articles and updates | `BlogCard`, `BlogSection` | `Blog`    | `blog`           |
| `/resources/blog/[slug]`    | Individual blog post         | `MarkdownRenderer`        | `Blog`    | `blog`           |
| `/resources/faq`            | CMS-managed FAQ page         | `FAQItem`, `FAQSection`   | `FAQ`     | `faqs`           |
| `/resources/process`        | Design process overview      | `ProcessSection`          | `Process` | `process_phases` |
| `/resources/process/[slug]` | Specific UX phase detail     | `ContentSection`          | `Process` | `process_phases` |

---

## ✅ Legal + Support Pages

| Route             | Purpose                  | Components    | Tables  |
| ----------------- | ------------------------ | ------------- | ------- |
| `/support`        | Help and contact         | `SupportCard` | `pages` |
| `/privacy-policy` | Legal                    | —             | `pages` |
| `/terms-of-use`   | Legal                    | —             | `pages` |
| `/security`       | Security policies        | —             | `pages` |
| `/accessibility`  | Accessibility commitment | —             | `pages` |

---

## 🧠 Layouts & Global Shell

| File         | Location            | Purpose                         |
| ------------ | ------------------- | ------------------------------- |
| `layout.tsx` | `/app/`             | Global wrapper                  |
| `layout.tsx` | `/app/(main)/`      | Marketing layout shell          |
| `layout.tsx` | `/app/(studio)/`    | Studio-specific layout          |
| `layout.tsx` | `/app/(labs)/`      | Playground shell w/ utility nav |
| `layout.tsx` | `/app/(resources)/` | Resource articles layout        |
