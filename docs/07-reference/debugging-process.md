--- docs/07-reference/debugging-process.md ---
# Debugging Process Guide (ESLint & TypeScript) – Coriyon’s Studio

This document outlines the systematic process used for debugging ESLint and TypeScript errors in the project, based on recent collaborative efforts.

---

## Guiding Principles

* **One File at a Time:** Focus on resolving all reported issues (both ESLint and TypeScript) for a single file before moving to the next. This prevents context switching and ensures each file is left in a clean state.
* **Prioritize ESLint Output:** Use the `npm run lint` output as the primary guide for which file to tackle next.
* **Integrate TypeScript Checks:** For each file addressed for ESLint errors, immediately check the IDE (e.g., VSCode) for any related TypeScript errors. Resolve these before considering the file "clean."
* **Iterative Refinement:** Solutions may require multiple attempts. Test each proposed fix and provide clear feedback on the outcome.

## Standard Debugging Workflow

1.  **Identify Target File & Errors:**
    * Run `npm run lint` to get the list of files with errors.
    * Select the first file from the list.
    * Note all ESLint errors reported for that file (rule, line number, message).

2.  **Gather Context:**
    * **Developer:** Provide the AI assistant with the *entire current content* of the target file.
    * **Developer:** Check VSCode (or run `npx tsc --noEmit`) for any TypeScript errors specific to this file and share them.

3.  **Propose & Implement Fixes:**
    * **AI Assistant:** Analyze the errors and code, then provide the *complete, updated content* of the file with minimal, targeted fixes. Include explanations for the changes.
    * **Developer:** Replace the local file content with the AI-provided version.

4.  **Test & Verify:**
    * **Developer:** Re-run `npm run lint`.
    * **Developer:** Check VSCode for TypeScript errors in the modified file.

5.  **Confirm or Iterate:**
    * **If All Clear (ESLint & VSCode for the file):** The file is considered resolved. Move to the next file in the `npm run lint` output.
    * **If Issues Persist:**
        * **Developer:** Share the new/remaining ESLint output and any VSCode errors for the current file.
        * **AI Assistant:** Refine the solution and provide a new version of the full file content.
        * Repeat steps 3-5 until the current file is clear.

## Common Error Types & Solutions

* **`@typescript-eslint/no-unused-vars`:**
    * **Cause:** An imported variable, function, type, or a locally declared variable/function is not used.
    * **Solution:**
        * Remove the unused import or declaration.
        * For function parameters that are part of a required signature but intentionally unused (e.g., `parent` in `generateMetadata`, event objects in some callbacks):
            * Prefix with an underscore (e.g., `_parent`, `_event`).
            * If ESLint still flags it, add an `eslint-disable-next-line @typescript-eslint/no-unused-vars` comment directly above the parameter.
* **`react/no-unescaped-entities`:**
    * **Cause:** Characters like `'`, `"`, `>`, `<`, `{`, `}` are used directly in JSX text content.
    * **Solution:** Replace with their HTML entity equivalents (e.g., `&apos;`, `&quot;`, `&gt;`, `&lt;`, `&lbrace;`, `&rbrace;`).
* **`@typescript-eslint/no-explicit-any`:**
    * **Cause:** The `any` type is used explicitly.
    * **Solution:**
        * Replace `any` with a more specific type if known.
        * Use `unknown` for truly unknown types, especially for `catch` block error parameters, and then perform type checking/narrowing before use.
        * If `any` is unavoidable due to complex library types or as a temporary measure for deferred issues, suppress the ESLint error with `eslint-disable-next-line @typescript-eslint/no-explicit-any`.
* **`@typescript-eslint/no-empty-object-type` (or similar for interfaces):**
    * **Cause:** An interface extends another but adds no new members, or an object type `{}` is used.
    * **Solution:** Convert the interface to a `type` alias (e.g., `export type MyProps = BaseProps;`). For empty object types in function parameters where no specific structure is expected for that route (e.g., `params: {}` for a non-dynamic route's `generateMetadata`), define it more explicitly (e.g., `params: Record<string, never>`).
* **`@typescript-eslint/ban-ts-comment` (for `@ts-ignore`):**
    * **Cause:** Using `// @ts-ignore`.
    * **Solution:** Replace with `// @ts-expect-error` and provide a brief description explaining why the suppression is necessary (e.g., `// @ts-expect-error RHF/Zod type inference issue`). If the `@ts-expect-error` itself becomes unused (meaning the TS error is gone), remove the comment.
* **TypeScript Type Mismatches (e.g., `ts(2322)`, `ts(2345)`):**
    * **Cause:** Data or props passed to functions/components do not match the expected type definitions.
    * **Solution:**
        * Carefully inspect the expected type (e.g., from component prop definitions, function signatures, Zod schemas) and the actual type of the data being passed.
        * Adjust type definitions (e.g., local interfaces, Zod schemas) or data transformation logic to ensure alignment.
        * For complex library interactions (e.g., React Hook Form with Zod), these can be tricky. If an immediate fix isn't clear and a refactor is planned, use `@ts-expect-error` as a temporary measure.

## Handling Deferred Issues

* For particularly complex issues (like the React Hook Form type errors in `diary-entry-edit-form.tsx`), it's acceptable to defer a full fix if a refactor is planned.
* In such cases, use `@ts-expect-error` to suppress TypeScript errors and allow the build to pass.
* Clearly document these deferred items and the plan to address them.

By following this structured debugging process, most linting and type errors can be efficiently resolved.

_⏱ Last updated: May 29, 2025_