// src/utils/supabase/server.ts
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server‐side operations (e.g., in Actions).
 * Uses the ANON key (public) so that auth methods (signIn, signUp, resetPassword) work correctly.
 *
 * Requires:
 * NEXT_PUBLIC_SUPABASE_URL (the Supabase project URL)
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (the Supabase anon/public key)
 */
export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}