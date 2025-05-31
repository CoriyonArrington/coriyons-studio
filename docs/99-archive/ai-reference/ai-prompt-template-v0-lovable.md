--- docs/07-reference/ai-prompt-template-v0-lovable.md ---
# 🧠 AI Prompt Templates – v0.dev & Lovable – Coriyon’s Studio

Use these prompt structures with AI tools (v0.dev, Lovable.so) to generate code that matches our Chakra theme (`src/lib/theme.ts`) and design tokens.

---

## How to Use AI in the Workflow

Design isn’t linear—use AI before, during, or after Figma:

### Option 1: AI → Figma → Code
1. Prompt v0/Lovable for a layout stub  
2. Paste into Figma, apply real tokens/styles  
3. Finalize mockup, then implement with Chakra UI

### Option 2: Figma → AI → Code
1. Build in Figma with ShadCN & tokens  
2. Copy frame JSON into v0 for code gen  
3. Refactor to match `app/` and `components/ui/`

### Option 3: AI → Code (Skip Figma)
1. Prompt directly in v0 for rapid prototyping  
2. Tweak output to use real component imports  
3. Style with Tailwind & Chakra tokens

---

## Prompt: Generate a Component (v0.dev)

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

---

## Prompt: Page Skeleton (Lovable)

```txt
Design a therapist dashboard page layout using:

- Theme colors: primary, background, foreground
- Font stacks: Montserrat for headings, Nunito Sans for body
- Border radii: `rounded-md` for cards
- Components: Sidebar, Tabs, Chart, Session Notes area

Export as Tailwind + Chakra UI React code.
```

---

**Tip:** Always append:  
> “Ensure colorMode supports light & dark, using `mode()` for tokens.”

---

_⏱ Last updated: May 29, 2025_