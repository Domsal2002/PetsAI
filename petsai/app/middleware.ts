import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const isAuthenticated = cookieHeader?.includes("access_token=") ?? false;

  // ✅ Redirect unauthenticated users to /login
  if (!isAuthenticated && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to protected routes only
export const config = {
  matcher: ["/dashboard", "/sample", "/profile"],
};
