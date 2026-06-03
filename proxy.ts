import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/admin") return NextResponse.next();

  const token = request.cookies.get("admin_token");
  if (token?.value === "noreva_admin_auth") return NextResponse.next();

  const res = NextResponse.next();
  res.headers.set("x-admin-auth", "required");
  return res;
}

export const config = {
  matcher: ["/admin"],
};
