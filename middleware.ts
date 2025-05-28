// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/src/utils/supabase/middleware";
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Import for creating a client to read session

export async function middleware(request: NextRequest) {
  // Let your existing updateSession handle cookie refreshing and get the response it prepares.
  // This response will have any updated session cookies set.
  const response = await updateSession(request);

  // To make a decision for redirection *before* returning the response,
  // we need to check the auth state based on the cookies in the *incoming request*.
  // createServerClient helps read this. `updateSession` should have ensured
  // the session is fresh if it was renewable.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // set and remove are not strictly needed here if updateSession handles all cookie writing
        // and we are only *reading* the state for this redirect logic.
        // However, including them makes it a fully functional client if needed elsewhere.
        set(name: string, value: string, options: CookieOptions) {
          // In this pattern, if we needed to set cookies, we'd modify `request.cookies`
          // and the `response.cookies` (response is already prepared by updateSession)
          // But for a simple redirect check, we primarily need `get`.
        },
        remove(name: string, options: CookieOptions) {
          // Similar to set, for reading state, not strictly needed here.
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession(); // Reads session based on request cookies
  const { pathname } = request.nextUrl;

  // If trying to access any admin route and there's no session
  if (pathname.startsWith('/admin') && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in'; // Your login page
    // Prepend the redirect path to the existing response's headers if necessary for `updateSession`'s effects.
    // However, a redirect is a new response entirely.
    return NextResponse.redirect(url);
  }

  // Optional: If user is logged in and tries to access sign-in/sign-up, redirect them
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
     const url = request.nextUrl.clone();
     url.pathname = '/protected'; // Or your main dashboard/app page
     return NextResponse.redirect(url);
  }

  // If no redirect is needed, return the response from updateSession (which has updated cookies)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // The matcher should already cover /admin paths with the pattern above.
    // If you want to be more explicit or if the above doesn't catch all admin routes:
    // "/admin/:path*",
  ],
};