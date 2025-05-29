// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/src/utils/supabase/middleware"; // Your existing import
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[User\'s Middleware] CRITICAL ERROR: Supabase URL or Anon Key is not defined. Auth checks will likely fail.');
    // Depending on desired behavior, you might want to stop execution or return a specific response.
    // For now, letting it proceed to updateSession.
  }

  const response = await updateSession(request); // Handles session update and returns a response.

  // Create a Supabase client to get the session for redirect logic.
  // This client uses cookies from the original request.
  const supabaseForRedirectCheck = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // No need to implement set/remove for this read-only session check on the request.
        // updateSession handles cookie modifications on the response.
        set() { /* Read-only for this specific client's purpose */ },
        remove() { /* Read-only for this specific client's purpose */ },
      },
    }
  );

  const { data: { session } } = await supabaseForRedirectCheck.auth.getSession();
  const { pathname } = request.nextUrl;

  // Protect /admin routes: if not logged in, redirect to sign-in
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      // Optionally, pass the original path to redirect back after login
      url.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users from /sign-in or /sign-up to /protected
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
     const url = request.nextUrl.clone();
     url.pathname = '/protected'; // Or your main app dashboard
     return NextResponse.redirect(url);
  }

  // If no custom redirect logic was hit, return the response from updateSession
  // This response might itself be a redirect if updateSession handled a token refresh and needs to redirect.
  return response;
}

// Configuration for the middleware matcher
export const config = {
  // CURRENT MATCHER (from your provided code - for specific testing):
  // matcher: '/admin/design-system',

  // RECOMMENDED MATCHER for broader application:
  // (This protects all admin routes and handles redirects for sign-in/sign-up pages)
  matcher: [
    '/admin/:path*',
    '/sign-in',
    '/sign-up',
    // Add '/forgot-password' if you want the same redirect logic for authenticated users on that page
    // '/forgot-password',
    // Add '/protected/:path*' if you want all /protected routes to pass through middleware
    // for session refresh, though specific protection for unauthenticated access to /protected
    // would need its own if (!session) check.
  ],

  // ALTERNATIVE GENERIC MATCHER (Often a good default):
  // matcher: '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
};