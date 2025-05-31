--- docs/07-reference/ai-developer-collaboration.md ---
# AI Developer Collaboration Guide – Coriyon’s Studio

This document outlines best practices and patterns for effective collaboration between a human developer and an AI assistant (like Gemini) during software development, particularly for tasks like debugging, refactoring, and implementing new features. Our recent linting and TypeScript error resolution efforts serve as a practical example.

---

## Core Principles

1.  **Clear Goal Definition:** Start with a clear, overarching goal (e.g., "Achieve a clean `npm run lint` output and a successful build"). This helps both parties stay focused.
2.  **Systematic Approach:** Tackle problems one at a time. For instance, when dealing with multiple lint errors, address them file by file, and within each file, error by error.
3.  **Iterative Refinement:** Expect an iterative process. The AI's first suggestion might not be perfect. The developer's role is to test the suggestion, provide precise feedback on any remaining issues or new ones that arise, and allow the AI to refine its solution.
4.  **Shared Context is Key:**
    * **Full File Content:** Whenever possible, provide the AI with the *entire current content* of the file being worked on. This gives the AI the most context to understand imports, local types, and how different code blocks interact. Snippets can be useful for pinpointing, but full context prevents misunderstandings.
    * **Exact Error Messages:** Copy and paste the *exact* error messages from the terminal (e.g., `npm run lint` output) or the IDE (e.g., VSCode TypeScript errors, including the JSON format if available).
    * **Relevant Supporting Files:** If types or functions from other files are relevant (e.g., Supabase type definitions, shared utility functions), provide those as well.
5.  **AI as a Pair Programmer:** Treat the AI as a knowledgeable pair programmer. It can generate code, explain concepts, suggest approaches, and help debug. The developer provides the critical thinking, testing, and project-specific knowledge.

## Our Established Workflow (Example: Linting/Type Errors)

Our successful collaboration on resolving ESLint and TypeScript errors followed this pattern:

1.  **Developer States Goal:** "My `npm run lint` is failing. I want to clear all errors to get a successful build."
2.  **Developer Provides Initial Error Output:** The full `npm run lint` output is shared.
3.  **Jointly Establish an Action Plan:**
    * AI proposes a systematic approach (e.g., file by file).
    * Developer confirms or refines the plan (e.g., "Yes, and for each file, provide the complete updated content").
4.  **Iterative File-by-File Resolution:**
    * **AI Identifies Target:** "Next file is `X`, error is `Y` on line `Z`."
    * **Developer Provides Full Code:** The developer shares the entire content of file `X`.
    * **Developer Provides IDE Errors:** The developer shares any related TypeScript errors from VSCode for file `X`.
    * **AI Proposes Solution:** The AI provides the *complete updated content* for file `X` with fixes and explanations.
    * **Developer Implements & Tests:** The developer replaces their local file content, re-runs `npm run lint`, and checks VSCode.
    * **Developer Provides Feedback:**
        * "File `X` is clear." -> Move to the next file.
        * "New ESLint error in file `X`: ..." or "VSCode still shows error `Z`..." -> AI refines solution for file `X`.
5.  **Handling Complex/Deferred Issues:**
    * If an issue is too complex for an immediate fix or requires a larger refactor (e.g., the RHF type errors in `diary-entry-edit-form.tsx`), agree to defer it.
    * Use temporary measures if necessary to unblock the main goal (e.g., `@ts-expect-error` comments, `eslint-disable-next-line`). Document these as technical debt.
6.  **Final Verification:** Once the primary list of errors is cleared, run a final full lint and build to confirm the overall goal is met.

## Communication Best Practices

* **Be Specific:** Vague requests lead to vague answers.
* **Confirm Understanding:** If the AI proposes a plan or an explanation, confirm it aligns with your understanding.
* **Provide Negative Feedback Clearly:** If a solution doesn't work, explain *why* (e.g., "That removed the ESLint error, but now VSCode shows this new TypeScript error...").
* **Acknowledge Progress:** Positive reinforcement helps! ("Great, that file is clear!")

By following these patterns, collaboration with an AI developer assistant can be highly productive and efficient.

_⏱ Last updated: May 29, 2025_