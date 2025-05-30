--- docs/08-testing/unit-testing.md ---
# ⚙️ Unit Testing – Coriyon’s Studio

Guidelines and best practices for writing and maintaining unit tests using Vitest.

---

## 1. Setup & Configuration

* **Test runner:** Vitest  
* **Config file:** `vitest.config.ts`  
* **Run tests:** `npm run test:unit`  

---

## 2. Folder Structure

```
src/
  components/
    MyComponent/
      MyComponent.tsx
      MyComponent.test.tsx
  lib/
    utils.ts
    utils.test.ts
```

* Co-locate tests next to implementation files with `.test.ts(x)` suffix.

---

## 3. Writing Tests

* Use `describe` and `it` for clear grouping.  
* Mock dependencies with `vi.mock()`.  
* Test pure functions without external dependencies.  
* For React components, use `@testing-library/react`.

```ts
import { render, screen } from '@testing-library/react';
import MyButton from './MyButton';

it('renders label', () => {
  render(<MyButton label="Click me" />);
  expect(screen.getByText('Click me')).toBeDefined();
});
```

---

## 4. Mocking

* Mock network calls with `vi.mock('axios')` or `vi.fn()`.  

```ts
vi.mock('@chakra-ui/react', () => ({
  useColorMode: () => ({ colorMode: 'light' }),
}));
```

---

## 5. Coverage

* Aim for ≥ 90% coverage in unit tests  
* Exclude config files in `coverageThreshold`  

---

## 6. Best Practices

* Keep tests small and focused  
* Use descriptive names  
* Avoid testing implementation details  

_⏱ Last updated: May 29, 2025_