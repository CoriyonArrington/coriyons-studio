--- docs/08-testing/end-to-end-testing.md ---
# 🌐 End-to-End Testing – Coriyon’s Studio

Guidelines for writing and running end-to-end tests using Playwright.

---

## 1. Setup

* **Runner:** Playwright  
* **Config:** `playwright.config.ts`  
* **Run:** `npm run test:e2e`  

---

## 2. Folder Structure

```
e2e/
  tests/
    auth.spec.ts
    entry-flow.spec.ts
  fixtures/
    user.json
```

---

## 3. Writing Tests

```ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign up');
  await page.fill('input[name=email]', 'test@example.com');
  await page.fill('input[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 4. CI Integration

```yaml
- uses: microsoft/playwright-github-action@v1
  with:
    test-command: npm run test:e2e
```

---

## 5. Best Practices

* Seed users via API  
* Use stable selectors  

_⏱ Last updated: May 29, 2025_