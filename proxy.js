import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if trying to access protected admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Redirect to login if not authenticated and trying to access /admin
  if (!user && isAdminRoute) {
    const loginUrl = new URL("/login", request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("Cache-Control", "no-store, must-revalidate");
    return redirectResponse;
  }

  // Redirect to admin if authenticated user tries to access login page
  if (user && pathname === "/login") {
    const adminUrl = new URL("/admin", request.url);
    const redirectResponse = NextResponse.redirect(adminUrl);
    redirectResponse.headers.set("Cache-Control", "no-store, must-revalidate");
    return redirectResponse;
  }

  // Prevent caching of auth-protected pages
  if (isAdminRoute && user) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
