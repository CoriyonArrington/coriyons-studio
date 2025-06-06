// ATTEMPT #18: THE DEFINITIVE FIX
// Change: This file now correctly uses the authenticated `createServerClient` for all auth-related actions.

"use server";
import { createServerClient } from "@/src/utils/supabase/server";
// ... other imports
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/src/utils/utils";


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const supabase = await createServerClient(); // <-- Use the AUTHENTICATED client

  // ... rest of the function
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) { return encodedRedirect("error", "/sign-in", error.message); }
  return redirect("/protected");
};

export const signOutAction = async () => {
  const supabase = await createServerClient(); // <-- Use the AUTHENTICATED client
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// ... ALL OTHER ACTIONS in this file (signUp, forgotPassword, etc.) must also use `await createServerClient()`
export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  const supabase = await createServerClient();
  const origin = (await headers()).get('origin') || '';
  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback` } });
  if (error) { return encodedRedirect('error', '/sign-up', error.message); }
  return encodedRedirect('success', '/sign-up', 'Thanks for signing up! Please check your email for a verification link.');
};
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString() || '';
  const supabase = await createServerClient();
  const origin = (await headers()).get('origin') || '';
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password` });
  if (error) { return encodedRedirect('error', '/forgot-password', 'Could not reset password'); }
  return encodedRedirect('success', '/forgot-password', 'Check your email for a link to reset your password.');
};
export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get('password')?.toString() || '';
  const confirmPassword = formData.get('confirmPassword')?.toString() || '';
  const supabase = await createServerClient();
  if (password !== confirmPassword) { return encodedRedirect('error', '/protected/reset-password', 'Passwords do not match'); }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) { return encodedRedirect('error', '/protected/reset-password', 'Password update failed'); }
  return encodedRedirect('success', '/protected/reset-password', 'Password updated');
};