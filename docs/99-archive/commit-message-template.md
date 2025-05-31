--- docs/07-reference/commit-message-template.md ---
# Git Commit Message Template – Coriyon’s Studio

Consistent and descriptive commit messages are crucial for maintaining a clear project history and facilitating collaboration. This template provides a guideline based on common conventions (like Conventional Commits).

---

## Format

<type>(<scope>): <short summary>  
<BLANK LINE>  
[optional body: more detailed explanation, 72-character wrap]  
<BLANK LINE>  
[optional footer: BREAKING CHANGE, Closes #issue, etc.]

## Components

### 1. Type

Must be one of the following:

* **`feat`**: A new feature for the user or a significant new functionality for the project.  
* **`fix`**: A bug fix.  
* **`docs`**: Documentation-only changes.  
* **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).  
* **`refactor`**: A code change that neither fixes a bug nor adds a feature (e.g., improving code structure, performance, or maintainability).  
* **`perf`**: A code change that improves performance.  
* **`test`**: Adding missing tests or correcting existing tests.  
* **`build`**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).  
* **`ci`**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).  
* **`chore`**: Other changes that don't modify `src` or `test` files (e.g., updating build tasks, package manager configs).  
* **`revert`**: Reverts a previous commit.

### 2. Scope (Optional)

The scope provides contextual information about the part of the codebase affected by the change. It should be a noun describing the section.

* Examples: `(api)`, `(auth)`, `(ui)`, `(lint)`, `(ci)`, `(deps)`, `(scripts)`  

### 3. Short Summary

A concise description of the change:

* Use the imperative, present tense: "change" not "changed" nor "changes".  
* Don't capitalize the first letter.  
* No dot (.) at the end.  
* Ideally 50 characters or less, but up to 72 is acceptable.

### 4. Body (Optional)

* Use the imperative, present tense.  
* Include motivation for the change and contrast its behavior with the previous one.  
* Longer explanation of *what* and *why*, not *how*.  
* Wrap lines at 72 characters.

### 5. Footer (Optional)

* **Breaking Changes:** All breaking changes MUST be mentioned in the footer with `BREAKING CHANGE:` followed by a summary of the breaking change, a blank line, and a detailed description.  
* **Issue Tracking:** Reference issues that this commit closes (e.g., `Closes #123`, `Fixes #456`).

## Examples

**Simple Fix:**  

```
fix(auth): correct redirect URL after sign-in
```

**Feature with Scope and Body:**  

```
feat(admin/faqs): implement FAQ deletion functionality

Adds a confirmation dialog and server action to allow administrators
to permanently delete FAQ entries from the FAQ table.
Includes UI updates to reflect the deletion.
```

_⏱ Last updated: May 29, 2025_