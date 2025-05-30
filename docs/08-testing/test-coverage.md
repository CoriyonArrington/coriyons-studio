--- docs/08-testing/test-coverage.md ---
# 📊 Test Coverage – Coriyon’s Studio

Guidelines for measuring, reporting, and enforcing test coverage across the codebase.

---

## 1. Coverage Thresholds

```ts
coverage: {
  statements: 80,
  branches: 70,
  functions: 80,
  lines: 80,
},
```

---

## 2. Generating Reports

* `npm run test:coverage`  
* View `coverage/index.html`.  

---

## 3. CI Badge

```markdown
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
```

---

## 4. CI Enforcement

* Fail build if coverage < thresholds  

---

## 5. Best Practices

* Test core logic  
* Review gaps monthly  

_⏱ Last updated: May 29, 2025_