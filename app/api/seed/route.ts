import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Clear all products (remove sample data)
    await redis.set("products", []);
    return NextResponse.json({ success: true, count: 0, message: "Products cleared. Use admin panel to import products." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear products" }, { status: 500 });
  }
}
