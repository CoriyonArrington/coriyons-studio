--- docs/08-testing/testing-strategy.md ---
# 🧠 Testing Strategy – Coriyon’s Studio

A high-level overview of our testing goals, scope, and approach to maintain code quality and reliability.

---

## 1. Objectives

* Prevent regressions and catch bugs early  
* Ensure confidence when shipping features  
* Document expected behaviors in executable form  

---

## 2. Test Pyramid

| Level           | Tool        | Scope                                    | Responsibility        |
| --------------- | ----------- | ---------------------------------------- | --------------------- |
| **Unit Tests**  | Vitest      | Individual functions, components, hooks  | All devs              |
| **Integration** | Vitest      | API routes, DB interactions, edge funcs  | Backend & frontend    |
| **E2E Tests**   | Playwright  | Full user flows in a real browser        | QA & devs             |

---

## 3. Metrics & KPIs

* **Test Coverage:** ≥ 80% overall  
* **CI Pass Rate:** 100% on `main` branch  
* **Flaky Test Rate:** < 1% per month  

---

## 4. CI Integration

* Run `npm test` in pre-commit hooks (via Husky)  
* CI pipeline runs unit, integration, and E2E on push to `main`  
* Fail-fast on errors; require passing before merge  

---

## 5. Environment Parity

* Use `.env.test` with Supabase test project  
* Maintain separate test database for isolation  
* Automate test data seeding and teardown  

---

_⏱ Last updated: May 29, 2025_