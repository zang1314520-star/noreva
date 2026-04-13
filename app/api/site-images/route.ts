import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DEFAULT_IMAGES = {
  hero: {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    title: "The New Collection"
  },
  womenswear: {
    main: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    secondary: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
  },
  menswear: {
    main: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    secondary: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
  },
  journal: {
    post1: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
    post2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    post3: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80"
  }
};

export async function GET() {
  try {
    const data = await redis.get("site_images");
    if (!data) {
      await redis.set("site_images", JSON.stringify(DEFAULT_IMAGES));
      return NextResponse.json(DEFAULT_IMAGES);
    }
    return NextResponse.json(typeof data === "string" ? JSON.parse(data) : data);
  } catch {
    return NextResponse.json(DEFAULT_IMAGES);
  }
}

export async function POST(request: Request) {
  try {
    const images = await request.json();
    await redis.set("site_images", JSON.stringify(images));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
