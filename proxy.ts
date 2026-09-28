/**
 * Route protection for the Ananse Admin/CRM area.
 *
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
 * mechanism, runs on the Node.js runtime by default in this version --
 * see node_modules/next/dist/docs/.../file-conventions/proxy.md). This is
 * the "genuinely protected server-side" layer the CRM architecture
 * requires: it runs before any /admin page renders, so hiding the route
 * from navigation was never the actual security boundary.
 *
 * Two checks, both required:
 *   1. Authentication -- is there a valid Supabase session at all?
 *   2. Authorization  -- does that user have an active admin_profiles
 *      row? (Signing in alone never implies this -- see lib/admin-auth.ts
 *      and the Phase 1 migration's RLS design.)
 *
 * This is defense *in front of* the render, not the only defense --
 * lib/admin-auth.ts's requireAdmin() re-checks both inside every
 * protected layout/page/Server Action too, and Postgres RLS enforces the
 * same authorization boundary at the database level regardless of what
 * either of these do.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Fail closed: if Supabase isn't configured, nobody gets into /admin.
  if (!url || !publishableKey) {
    if (isLoginRoute) return response;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLoginRoute) {
    // Already signed in and authorized -- no reason to show the login
    // form again. Re-check authorization here too, not just a session.
    if (user) {
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("is_active")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.is_active) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin";
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }
    }
    return response;
  }

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_active) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("error", "not_authorized");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
