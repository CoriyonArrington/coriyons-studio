// ATTEMPT #8: CREATE DISTINCT CLIENTS FOR SERVER AND CLIENT
// Change: This file is now dedicated to creating a client-side Supabase instance for use in Client Components.
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );