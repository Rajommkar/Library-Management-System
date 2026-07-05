import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public auth routes
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAdminRoute) {
    const role = (req.auth?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)",
  ],
};
