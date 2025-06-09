// ATTEMPT 2: Adding 'await' to the headers() function call.
// - The headers() function is async and must be awaited before using its methods.

"use server";
import { createServerClient } from "@/src/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/src/utils/utils";


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    return encodedRedirect("error", "/sign-in", "Invalid email or password.");
  }
  
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) { 
    return encodedRedirect("error", "/sign-in", error.message); 
  }
  return redirect("/protected");
};

export const signOutAction = async () => {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return encodedRedirect('error', '/sign-up', 'Invalid email or password.');
  }

  const supabase = await createServerClient();
  // FIX: Added 'await' to the headers() call.
  const origin = (await headers()).get('origin') || '';
  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback` } });

  if (error) { 
    return encodedRedirect('error', '/sign-up', error.message); 
  }
  return encodedRedirect('success', '/sign-up', 'Thanks for signing up! Please check your email for a verification link.');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email');

  if (typeof email !== 'string') {
    return encodedRedirect('error', '/forgot-password', 'Invalid email address.');
  }
  
  const supabase = await createServerClient();
  // FIX: Added 'await' to the headers() call.
  const origin = (await headers()).get('origin') || '';
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password` });
  
  if (error) { 
    return encodedRedirect('error', '/forgot-password', 'Could not reset password'); 
  }
  return encodedRedirect('success', '/forgot-password', 'Check your email for a link to reset your password.');
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return encodedRedirect('error', '/protected/reset-password', 'Invalid password format.');
  }
  
  if (password !== confirmPassword) { 
    return encodedRedirect('error', '/protected/reset-password', 'Passwords do not match'); 
  }
  
  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  
  if (error) { 
    return encodedRedirect('error', '/protected/reset-password', 'Password update failed'); 
  }
  return encodedRedirect('success', '/protected/reset-password', 'Password updated');
};