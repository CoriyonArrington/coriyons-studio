// ATTEMPT #18: THE DEFINITIVE FIX
// Change: This file now provides two clients.
// 1. `createServerClient` for authenticated, user-specific actions.
// 2. `createPublicServerClient` for fetching public data anonymously, restoring the original data fetching behavior.

import { createClient as _createPublicClient } from "@supabase/supabase-js";
import { createServerClient as _createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a simple, ANONYMOUS Supabase client for server-side operations.
 * Use this for fetching public data (like your pages table) that does not require user authentication.
 */
export const createPublicServerClient = () => {
  return _createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Creates an AUTHENTICATED Supabase client for server-side operations.
 * Use this for any operation that requires a user to be logged in (e.g., in layouts and actions).
 */
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can be ignored on the server
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // This can be ignored on the server
          }
        },
      },
    }
  );
};