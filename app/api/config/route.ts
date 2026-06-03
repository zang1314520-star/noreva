import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const redis = getRedis();

const DEFAULT_CONFIG = {
  site: {
    brand: "NOREVA",
    tagline: "Smart Backpacks",
    description: "Smart backpacks for work, travel, commuting, and organized daily carry.",
  },
  whatsapp: { number: "8617338700032" },
  hero: {
    headline: "Smarter Carry, Built for Movement",
    subtitle: "Backpacks organized by capacity, laptop fit, materials, and real travel needs.",
    cta: "Shop Backpacks",
  },
  manifesto: {
    headline: "A clearer way to choose the right backpack.",
    text: "NOREVA focuses on laptop compatibility, capacity, comfort, materials, and travel organization.",
  },
  personalShopper: {
    headline: "Your Pack Finder",
    subheadline: "Tell us how you carry.",
    description: "We help compare backpack size, laptop fit, commute style, and travel needs through a direct conversation.",
    responseTime: "We usually reply within 24 hours.",
    quote: "The right backpack starts with how you move.",
  },
};

export async function GET() {
  if (!redis) return NextResponse.json(DEFAULT_CONFIG);

  try {
    const data = await redis.get("site-config");
    if (!data) {
      await redis.set("site-config", DEFAULT_CONFIG);
      return NextResponse.json(DEFAULT_CONFIG);
    }
    return NextResponse.json(typeof data === "string" ? JSON.parse(data) : data);
  } catch {
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    const config = await request.json();
    await redis.set("site-config", config);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
