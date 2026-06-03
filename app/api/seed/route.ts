import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const redis = getRedis();

export async function GET() {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    await redis.set("products", []);
    return NextResponse.json({
      success: true,
      count: 0,
      message: "Products cleared. Use the admin panel to import products.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to clear products" }, { status: 500 });
  }
}
