import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DEFAULT_CONFIG = {
  site: { brand: "NOREVA", tagline: "Maison NOREVA", description: "Quiet refinement. Timeless objects." },
  whatsapp: { number: "8618508036618" },
  hero: { headline: "SS 2026", subtitle: "新 系列", cta: "探索" },
  manifesto: { headline: "我们生产经久耐用的产品。", text: "服装不是潮流，而是一种选择。NOREVA专为那些精心挑选、用心穿着的人士而打造。" },
  collections: {
    womenswear: { season: "SS 2026", category: "Womenswear", name: "工作室系列", tagline: "静谧的精致。", description: "十二件。仅此而已。" },
    menswear: { season: "SS 2026", category: "Menswear", name: "暗黑音量", tagline: "无力结构。", description: "八个轮廓。毫不妥协。" }
  },
  products: [
    { id: "01", name: "Le Sac Nerveux", tagline: "The everyday carry.", category: "Bags", inquiry: "I am interested in Le Sac Nerveux by NOREVA." },
    { id: "02", name: "Calibre 01", tagline: "Time, reconsidered.", category: "Watches", inquiry: "I am interested in Calibre 01 by NOREVA." },
    { id: "03", name: "La Marche", tagline: "Crafted in Florence.", category: "Shoes", inquiry: "I am interested in La Marche by NOREVA." },
    { id: "04", name: "L'Anneau", tagline: "A single, quiet statement.", category: "Accessories", inquiry: "I am interested in L'Anneau by NOREVA." }
  ],
  personalShopper: { headline: "您的专属造型师", subheadline: "随时恭候您的垂询。", description: "我们不相信购物车，我们相信对话。告诉我们您在寻找什么——一套衣服、一份礼物、一件单品——我们将为您提供指导。", responseTime: "我们会在24小时内回复（欧洲时间）。", quote: "每一件作品都始于一次对话。" }
};

export async function GET() {
  try {
    const data = await redis.get("site-config");
    if (!data) {
      await redis.set("site-config", JSON.stringify(DEFAULT_CONFIG));
      return NextResponse.json(DEFAULT_CONFIG);
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    await redis.set("site-config", JSON.stringify(config));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
