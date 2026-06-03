import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const redis = getRedis();

const DEFAULT_IMAGES = {
  hero: {
    image: "/images/brand/hero-backpack-campaign.png",
    title: "Smart Backpacks for Work and Travel",
  },
  newArrivals: {
    left: "/images/brand/backpack-main-premium.png",
    right: "/images/brand/backpack-detail-organizer.png",
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
    post1: "/images/brand/backpack-main-premium.png",
    post2: "/images/brand/backpack-detail-organizer.png",
    post3: "/images/brand/hero-backpack-campaign.png",
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
