--- docs/09-launch/04-checklist-deployment.md ---
# 🧩 Deployment & Hosting Checklist – Coriyon’s Studio

Verify deployment setup, CI/CD, and hosting configurations are production-ready.

---

## 🌐 Domain & Hosting

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Purchase and point domain DNS                 | Dev   | ✅ Complete | Low TTL for faster updates             |
| Configure hosting (Vercel/Netlify)            | Dev   | ✅ Complete | Automatic CI deployment on main branch |
| Enable HTTPS (SSL certificate)                | Dev   | ✅ Complete | Auto-renew via hosting platform        |

## ⚙️ CI/CD & Environment

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Set up GitHub Actions workflow                | Dev   | ✅ Complete | Lint, test, build, deploy steps        |
| Add production env vars in hosting dashboard  | Dev   | 🟡 In Progress | Ensure no secrets in code              |
| Add staging environment for testing           | Dev   | ⬜ Pending   | Mirror production settings             |

## 📈 Monitoring & Alerts

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Set up uptime monitoring (UptimeRobot)        | Dev   | ⬜ Pending   | 5-minute checks                        |
| Configure performance alerts                  | Dev   | ⬜ Pending   | Page load > 3s                         |
| Integrate error-tracking alerting            | Dev   | ⬜ Pending   | Sentry/Logflare notifications          |

_⏱ Last updated: May 29, 2025_
