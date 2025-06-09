// ATTEMPT #1: Applying server-side environment variable validation pattern.
// Change 1: Added client-side validation for environment variables to remove the forbidden non-null assertions (`!`).
// Change 2: This provides a clear runtime error if the variables are missing, which is safer than assuming they exist.

import { createBrowserClient } from "@supabase/ssr";

// Safely read environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that the environment variables are set.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key is missing from client-side environment variables.");
}

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );