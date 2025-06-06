// ATTEMPT #13: ADD DESCRIPTIVE COMMENTS TO MIDDLEWARE
// Change: Added comments to explain the purpose of each rule in the middleware, as requested.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // This client is used only for session management in middleware.
  // It is created using the plain createServerClient from @supabase/ssr
  // and not the async helper function from utils/supabase/server.ts
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // This call refreshes the user's session cookie if it's expired.
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;


  // --- REDIRECT RULES START HERE ---


  // Rule 1: Protect all routes under `/admin`
  // If a user is not logged in and tries to access an admin route, they are redirected to the sign-in page.
  if (pathname.startsWith('/admin') && !session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Rule 2: Protect all routes under `/protected`
  // If a user is not logged in and tries to access any other protected route, they are also redirected to sign-in.
  if (pathname.startsWith('/protected') && !session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Rule 3: Redirect logged-in users away from authentication pages
  // If a user is already logged in, this prevents them from seeing the sign-in or sign-up pages and sends them to the dashboard.
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
     return NextResponse.redirect(new URL('/protected', request.url));
  }
  
  // Rule 4 (Currently Disabled): Redirect logged-in users from the homepage
  // This rule would send logged-in users from the homepage ('/') to the '/protected' dashboard.
  // It is commented out to allow logged-in users to visit the homepage. You can re-enable it if you want.
  /*
  if (session && pathname === '/') {
      return NextResponse.redirect(new URL('/protected', request.url));
  }
  */

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