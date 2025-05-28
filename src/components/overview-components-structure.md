# 🧱 Component Map — Coriyon’s Studio

This guide defines the component system used across the **Coriyon’s Studio** platform, organized by UI scope: atomic components, content sections, CMS rendering, and page layouts.

---

## ✅ Shared UI Components (Atomic)

| Component           | Purpose                              | Related Types     |
| ------------------- | ------------------------------------ | ----------------- |
| `Button`            | CTAs, primary/secondary buttons      | —                 |
| `Input`             | Text input fields                    | `ContactInput`    |
| `Textarea`          | Longform message areas               | `ContactMessage`  |
| `Card`              | Layout wrapper for services, bundles | `Service`, `Page` |
| `Dialog`            | Modal behavior for tools or forms    | —                 |
| `Toast` / `Toaster` | Feedback after submission            | —                 |
| `FormField`         | Label + error wrapper for forms      | All forms         |
| `Separator`         | Dividers in layouts                  | —                 |

---

## 🧩 Layout & Structure Components

| Component        | Purpose                                | Used In                       |
| ---------------- | -------------------------------------- | ----------------------------- |
| `SiteHeader`     | Top nav (logo, links, CTA)             | All pages                     |
| `Footer`         | Footer nav + branding                  | All pages                     |
| `ContentSection` | Shared section wrapper                 | Hero, Services, Process, etc. |
| `LayoutShell`    | Page wrapper with header/footer layout | Default layouts               |

---

## 🎯 Page Section Components (Marketing / CMS)

| Component             | Purpose                              | Related Types   | Pages                    |
| --------------------- | ------------------------------------ | --------------- | ------------------------ |
| `HeroSection`         | Above-the-fold introduction          | `Hero`, `Page`  | Homepage, Services, etc. |
| `WhyUXSection`        | Problem/value framing section        | `WhyUX[]`       | `/consulting`            |
| `ProcessSection`      | UX process phases                    | `Process[]`     | `/process`, `/services`  |
| `ServicesSection`     | Showcase service cards               | `Service[]`     | `/services`              |
| `TestimonialsSection` | Display client quotes                | `Testimonial[]` | `/testimonials`          |
| `CTASection`          | Final call to action with CTA button | `CTA`           | All primary pages        |

---

## 🧠 CMS-Driven Content Blocks

| Component          | Purpose                            | Data Source     | Pages              |
| ------------------ | ---------------------------------- | --------------- | ------------------ |
| `MarkdownRenderer` | Render CMS-stored markdown content | `pages.content` | Projects, Blog     |
| `ServiceCard`      | Reusable card layout for services  | `services`      | `/services`        |
| `ProjectCard`      | Project preview w/ image           | `projects`      | `/work`            |
| `FAQItem`          | Toggleable question/answer pairs   | `faqs`          | `/faq`, `/support` |
| `ToolCard`         | Display playground tools           | `pages`         | `/labs`            |

---

## 🧾 Form Components

| Component      | Purpose                  | Related Types  | Pages      |
| -------------- | ------------------------ | -------------- | ---------- |
| `ContactForm`  | Send inquiries           | `ContactInput` | `/contact` |
| `FeedbackForm` | Feedback on site/content | `Feedback`     | `/support` |

---

## 🧪 Playground Tool Components

| Component      | Purpose                               | Related Tables                    | Used In                    |
| -------------- | ------------------------------------- | --------------------------------- | -------------------------- |
| `QuizForm`     | Interactive quiz with multiple choice | `quizzes`, `questions`, `options` | `/interactive-quiz`        |
| `TrackerGraph` | Chart for wellness tracking over time | `tracker_logs`                    | `/health-progress-tracker` |
| `DiaryForm`    | Log daily skills, notes, mood         | `entries`, `trackers`             | `/dbt-diary-card`          |
| `ClientCard`   | Dashboard view for therapists         | `users`, `entries`                | `/therapist-dashboard`     |

---

## 📁 Future Features & Patterns

These components support roadmap extensions:

* `BlogCard` — Summarized post display (v2)
* `BlogSection` — Paginated or recent posts section
* `Scorecard` — Quiz result summary
* `ReportExportButton` — PDF/CSV generation for tools
