import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const redis = getRedis();

const DEFAULT_CONFIG = {
  site: {
    brand: "NOREVA",
    tagline: "Maison NOREVA",
    description: "Curated luxury fashion with personal shopping support.",
  },
  whatsapp: { number: "8617338700032" },
  hero: {
    headline: "Curated Luxury, Personally Sourced",
    subtitle: "Clothing, bags, watches and accessories selected with a private-client mindset.",
    cta: "Explore the Collection",
  },
  manifesto: {
    headline: "A slower, more considered way to shop luxury.",
    text: "NOREVA focuses on trust, clarity and personal guidance instead of endless catalog browsing.",
  },
  personalShopper: {
    headline: "Your Private Shopping Desk",
    subheadline: "Tell us what you are looking for.",
    description: "We help source, compare and coordinate luxury pieces through a direct conversation.",
    responseTime: "We usually reply within 24 hours.",
    quote: "Every good piece starts with a conversation.",
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
