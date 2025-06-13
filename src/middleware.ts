// ATTEMPT #2: Finalizing middleware linting.
// Change 1: Removed the unused 'CookieOptions' type import to resolve the `no-unused-vars` warning.
// Change 2: Changed 'let response' to 'const response' as the variable is no longer reassigned, resolving the `prefer-const` error.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Safely read and validate environment variables.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If the variables are not set, we can't create the client, so we return the original response.
    console.error("Supabase URL or anonymous key is missing from environment variables.");
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // In middleware, cookies are set on the response object.
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          } catch (_error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );

  // This call refreshes the user's session cookie if it's expired.
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;


  // --- REDIRECT RULES START HERE ---


  // Rule 1: Protect all routes under `/admin`
  if (pathname.startsWith('/admin') && !session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Rule 2: Protect all routes under `/protected`
  if (pathname.startsWith('/protected') && !session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Rule 3: Redirect logged-in users away from authentication pages
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
     return NextResponse.redirect(new URL('/protected', request.url));
  }
  
  // If no rules matched, continue with the request as planned.
  return response;
}

// This config specifies which paths the middleware will run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};