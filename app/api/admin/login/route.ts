import { NextResponse } from "next/server";
import { isValidAdminPassword, setAdminCookie } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!isValidAdminPassword(String(password || ""))) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminCookie(response);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
