--- docs/08-testing/mocking-and-fixtures.md ---
# 🎭 Mocking & Fixtures – Coriyon’s Studio

Patterns and conventions for test data management in unit and integration tests.

---

## 1. Fixtures

* Store JSON fixtures in `tests/fixtures/`.  
* Load with:

```ts
import entries from './fixtures/entries.json';
await supabase.from('entries').insert(entries);
```

---

## 2. Factories

```ts
export function createEntry(overrides = {}) {
  return { id: uuidv4(), notes: 'Test', ...overrides };
}
```

---

## 3. Mocking

* Use `vi.mock()` for HTTP clients and Chakra context.

---

## 4. Cleanup

* `vi.clearAllMocks()`  
* Delete test data after each run  

_⏱ Last updated: May 29, 2025_