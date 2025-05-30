--- docs/08-testing/integration-testing.md ---
# 🔗 Integration Testing – Coriyon’s Studio

Guidelines for testing Next.js API routes and Supabase interactions to validate end-to-end logic.

---

## 1. Setup

* Use Vitest for integration tests (`npm run test:integration`).  
* Configure a separate test database via `.env.test`.  
* Seed test data in `setupFiles` using `scripts/preflight-check.sh`.

---

## 2. Testing API Routes

```ts
import request from 'supertest';
import handler from '../../app/api/entries/route';

it('creates a new entry', async () => {
  const res = await request(handler).post('').send({ user_id, entry_date });
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});
```

---

## 3. Supabase Client

* Use `createClient` with service key and reset state between tests.

---

## 4. Edge Functions

* Test locally with `supabase functions serve`.  

---

## 5. Best Practices

* Keep tests idempotent  
* Clean up data after each test  

_⏱ Last updated: May 29, 2025_