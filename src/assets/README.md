# 🗂️ assets/ — Fonts & Global Static Assets

This folder contains static files used globally across the DBT App Platform, with a current focus on **typography assets** that support brand consistency and accessibility.

---

## ✅ Who This Is For

* Designers selecting system fonts and fallback behavior
* Developers configuring global styles or deploying font files
* Contributors updating brand identity or accessibility settings

---

## 📁 Folder Structure

| Folder/File    | Purpose                                               |
| -------------- | ----------------------------------------------------- |
| `fonts/`       | Variable font families for system-wide use            |
| `Montserrat/`  | Clean, professional sans-serif font used for headings |
| `Nunito-Sans/` | Friendly, readable body font used for paragraph text  |
| `OFL.txt`      | Font license file (Open Font License)                 |
| `README.txt`   | Notes or instructions about fonts (optional)          |

---

## 🧠 Font Usage Notes

* Fonts are served locally to avoid 3rd-party tracking/CDN dependencies
* Loaded via Tailwind `@font-face` declarations in `global.css`
* Optimized for performance using `font-display: swap`
* Paired intentionally to reflect calm, clear, and inclusive design

---

## 🛠 Integrating Fonts

If modifying or adding fonts:

1. Add the `.ttf` or `.woff2` files to a dedicated subfolder
2. Add license (e.g., `OFL.txt`) to the same folder
3. Update `tailwind.config.ts` and/or `global.css`
4. Optionally update `03-design/typography.md` in `docs/`

---

## 🧩 Related Docs

* `docs/03-design/typography.md`
* `docs/03-design/color-system.md`
* `tailwind.config.ts` (top-level)
* `app/global.css`

---

This folder ensures that your design system has a rock-solid foundation in type clarity, accessibility, and scalability.
