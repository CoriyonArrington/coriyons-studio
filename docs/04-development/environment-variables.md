--- docs/04-development/environment-variables.md ---
# 🔧 Environment Variables – Coriyon’s Studio

Copy `.env.example` to `.env.local` and fill in these values before running or deploying.

---

## 🛠 Required

NEXT_PUBLIC_SUPABASE_URL= # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Public anon key for client-side use
DATABASE_URL= # Supabase database URL (service-role credential)
SUPABASE_ACCESS_TOKEN= # Service-role key for server-only operations


**Tip**: Never commit your real keys. Use `.env.local` for local dev and set vars securely in Vercel (or your hosting provider).

---

### 🔄 Updating Types & Schemas

After changing env vars or your Supabase schema, run:

```bash
npm run preflight-check
# or directly:
scripts/preflight-check.sh
This verifies your keys, schema drift, and regenerates TypeScript types.
```

_⏱ Last updated: May 29, 2025_