import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/admin") return NextResponse.next();

  const token = request.cookies.get("admin_token");
  if (token?.value === "noreva_admin_auth") return NextResponse.next();

  // Not authed — return 401 so client can show login form
  // We pass through but add a header the client checks
  const res = NextResponse.next();
  res.headers.set("x-admin-auth", "required");
  return res;
}

export const config = {
  matcher: ["/admin"],
};