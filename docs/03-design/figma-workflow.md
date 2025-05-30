--- docs/03-design/figma-workflow.md ---
# 🛠 Figma Workflow – Coriyon’s Studio

How to mirror your Chakra theme (`src/lib/theme.ts`) in Figma using tokens and the Tailwind Tokens plugin.

---

## ✅ Setup

1. **Install Tokens Studio** plugin – sync HSL variables to Figma.  
2. **Import color, font, and radius tokens** from `theme.ts` via JSON export.  
3. **Use ShadCN UI Kit** for components; override with our brand tokens.  

---

## 🔄 Sync Process

- **Step 1:** Export CSS variables JSON from codebase.  
- **Step 2:** In Figma, Tokens Studio → Import → JSON.  
- **Step 3:** Map tokens to Styles (Colors, Text, Effects).  
- **Step 4:** Use Tokens Studio Sync to update Figma whenever `theme.ts` changes.

---

_⏱ Last updated: May 29, 2025_
