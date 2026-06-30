import { isPageEnabled } from "@/config/features";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip system paths, assets, and the coming-soon page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname === "/coming-soon"
  ) {
    return NextResponse.next();
  }

  // 2. Auth route protection
  const isDoctorRoute = pathname.startsWith("/doctor/") || pathname === "/doctor";
  const isPatientRoute = pathname.startsWith("/patient");

  if (isDoctorRoute || isPatientRoute) {
    const token = request.cookies.get("md_auth_token")?.value;

    if (!token) {
      const loginPath = isDoctorRoute ? "/doctor-sign-in" : "/sign-in";
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`${loginPath}?callbackUrl=${callbackUrl}`, request.url));
    }

    const role = decodeJwtRole(token);

    if (isDoctorRoute && role !== "doctor") {
      return NextResponse.redirect(new URL("/doctor-sign-in", request.url));
    }

    if (isPatientRoute && role !== "customer") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // 3. Check if the current page is enabled in the features config
  const isEnabled = isPageEnabled(pathname);

  // 4. If disabled, rewrite to the coming-soon page
  if (!isEnabled) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.searchParams.set("from", pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export default proxy;

// Optionally, you can limit which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
