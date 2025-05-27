# 🌐 `public/` — Static Public Assets

This folder stores **static assets** served directly at the root URL of your deployed Coriyon’s Studio project. Managed by Next.js and Vercel, it should only contain files that:

* Require no server-side processing
* Can be CDN-cached for global delivery

---

## ✅ Who This Is For

* Developers adding or updating favicons, logos, or social images
* Designers maintaining Open Graph and SEO assets
* SEO contributors managing `robots.txt`, `sitemap.xml`, and other crawlers files

---

## 📂 Common Files

| File                    | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `favicon.ico`           | Browser tab icon                          |
| `logo.svg` / `logo.png` | Primary brand logo                        |
| `og-image.png`          | Open Graph preview image for social links |
| `robots.txt`            | Search engine crawler directives          |
| `sitemap.xml`           | Sitemap for SEO and indexing              |

---

## 🚫 Do Not Place

* Environment or secret files (e.g., `.env`)
* Supabase keys or auth tokens
* Private drafts or non-production assets

---

## 📌 Related Docs

* **Sitemap & SEO** → `docs/05-marketing/content-calendar.md`
* **Privacy Policy** → `docs/06-support-legal/landing-page-privacy-policy.md`
* **Brand Guidelines** → `docs/03-design/brand-marketside-guide.md`

---

Use the `public/` folder for fast, secure, globally cached assets that do not require server-side rendering or authentication ✅
