import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const redis = getRedis();

const DEFAULT_IMAGES = {
  hero: {
    image: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/H8-7.jpg?v=1763092998",
    title: "Official Nayo Smart Backpacks",
  },
  newArrivals: {
    left: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/nayo-smart-urban-u7-backpack-olive-green-front-view.jpg?v=1776826645",
    right: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/7_9af4575c-33b8-44be-94df-fa620f621a64.jpg?v=1762505351",
  },
  womenswear: {
    main: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    secondary: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  },
  menswear: {
    main: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    secondary: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  },
  journal: {
    post1: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/nayo-smart-urban-u7-backpack-olive-green-large-capacity-storage-1.jpg?v=1776827046",
    post2: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/4_c7f395e6-dd3c-4224-9049-d3f33d22f95f.jpg?v=1763106254",
    post3: "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/5_7b2a6b79-f388-4501-9e41-39501dcaea0c.jpg?v=1762928689",
  },
};

function normalizeImages(images: typeof DEFAULT_IMAGES) {
  const journal = images.journal || DEFAULT_IMAGES.journal;
  const hasLegacyJournal =
    [journal.post1, journal.post2, journal.post3].some((src) =>
      typeof src === "string" && src.includes("images.unsplash.com")
    );

  return {
    ...DEFAULT_IMAGES,
    ...images,
    journal: hasLegacyJournal ? DEFAULT_IMAGES.journal : { ...DEFAULT_IMAGES.journal, ...journal },
  };
}

export async function GET() {
  if (!redis) return NextResponse.json(DEFAULT_IMAGES);

  try {
    const data = await redis.get("site_images");
    if (!data) {
      await redis.set("site_images", DEFAULT_IMAGES);
      return NextResponse.json(DEFAULT_IMAGES);
    }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return NextResponse.json(normalizeImages(parsed));
  } catch {
    return NextResponse.json(DEFAULT_IMAGES);
  }
}

export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    const images = await request.json();
    await redis.set("site_images", images);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
