# 🧪 `tests/` — Automated Testing

This folder contains all **unit** and **integration** tests for Coriyon’s Studio, covering portfolio pages, interactive playground tools, admin dashboard features, and utility scripts. Testing is handled using **Vitest**, and coverage includes:

* CLI scripts
* Supabase schema checks
* Directory structure validation
* Supabase type generation

---

## ✅ Who This Is For

* Developers writing or maintaining backend logic, components, or CLI tools
* QA contributors verifying product behaviors before release
* CI/CD systems running pre-deployment validations

---

## 🧭 Folder Structure

| Folder/File    | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `unit/`        | Fast, isolated tests for individual functions or scripts |
| `integration/` | End-to-end validation for cross-functional workflows     |
| `*.test.ts`    | Test files for scripts, hooks, components, and pages     |

---

## 🚀 Running Tests

```bash
# Run all tests\ nnpm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

> Ensure `.env.local` is configured to avoid destructive operations in production environments.

---

## 📌 Notes

* Mirrors the `/scripts/` structure for traceability
* Integrated with GitHub Actions via `.github/workflows/ci.yml`
* All tests should pass before merging to `main`

---

## 📁 Related Docs

* **Testing Strategy** → `docs/08-testing/README.md`
* **Scripts Overview** → `scripts/README.md`

Let’s ensure each deploy is safe, traceable, and covered ✅
