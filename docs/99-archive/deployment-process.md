# 🚀 Deployment Process – Coriyon’s Studio

Step-by-step guide to deploying Coriyon’s Studio from local to production.

---

## 🔄 Environments

1. **Preview** (branch deploys) — via Vercel previews  
2. **Staging** (`main` branch auto-deploy) — `https://staging.<your-domain>`  
3. **Production** (manual promote) — `https://<your-domain>`

---

## ✅ Pre-Deployment

1. Pull latest code: `git pull origin main`  
2. Run preflight checks:  
   ```bash
   npm run preflight-check
   # runs scripts/preflight-check.sh
   ```  
3. Verify tests:  
   ```bash
   npm test
   npm run lint
   ```  
4. Push migrations & types:  
   ```bash
   scripts/update-supabase-types.sh
   scripts/verify-schema-types.sh
   ```

---

## 🚀 Deploy to Vercel

```bash
git push origin main
```
- Vercel builds & deploys **preview** for open PRs  
- Merges to `main` auto-deploy **staging**  
- Promote staging → production from the Vercel dashboard

---

## 🧪 Post-Deployment QA

* Smoke-test key flows (login, data sync, UI components)  
* Review logs in Vercel and Supabase Edge Functions  
* Confirm RLS policies and edge-function responses

---

## 🔁 Rollback

If an issue is detected, revert to the last stable commit:

```bash
git revert <commit-sha>
git push origin main
```
Then redeploy via Vercel.

_⏱ Last updated: May 29, 2025_