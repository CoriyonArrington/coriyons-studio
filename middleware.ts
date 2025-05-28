// middleware.ts (User's Original Logic Base + Minimal Logging & Matcher Fix)
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/src/utils/supabase/middleware"; // Your existing import
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // VERY FIRST LOG: To see if middleware is entered AT ALL for the path
  console.log(`[User Original Middleware] Path: ${request.nextUrl.pathname}, Timestamp: ${new Date().toISOString()}`);

  const response = await updateSession(request); // Your Step 1

  // Client to check session state based on original request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Intentionally minimal for this client as per your original
        },
        remove(name: string, options: CookieOptions) {
          // Intentionally minimal for this client as per your original
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession(); // Your Step 3
  const { pathname } = request.nextUrl;

  console.log(`[User Original Middleware] Pathname for check: ${pathname}, Session found: ${!!session}`);

  // If trying to access any admin route and there's no session
  if (pathname.startsWith('/admin')) {
    console.log("[User Original Middleware] ==> Checking /admin path.");
    if (!session) {
      console.log("[User Original Middleware] No session for /admin. Redirecting to /sign-in.");
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
    console.log("[User Original Middleware] Session found for /admin. Proceeding.");
  }

  // Optional: If user is logged in and tries to access sign-in/sign-up, redirect them
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
    console.log("[User Original Middleware] Authenticated user on auth page. Redirecting to /protected.");
     const url = request.nextUrl.clone();
     url.pathname = '/protected';
     return NextResponse.redirect(url);
  }

  // If no redirect is needed, return the response from updateSession (which has updated cookies)
  console.log("[User Original Middleware] No redirect. Returning response from updateSession.");
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*', // <<< --- CRITICAL: Ensure this line is active and not commented out
    // You can add other specific paths you want the middleware to run on first
    '/protected/:path*',
    '/sign-in',
    '/sign-up',
    // Your original broad matcher, kept for other paths.
    // Paths starting with /admin/ should be caught by the more specific matcher above.
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};