import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  // Try to load products from JSON file first
  const jsonPath = path.join(process.cwd(), "..", "..", "Desktop", "壁纸", "extracted_products", "products_for_import.json");
  
  let products: any[] = [];
  
  try {
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, "utf-8");
      products = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Failed to load products from JSON:", error);
  }
  
  // Fallback to default products if no JSON file
  if (products.length === 0) {
    products = [
      {
        id: "bag-001", name: "Le Sac Nerveux", nameCn: "神经感手提包", category: "bags", categoryName: "Bags",
        price: 890, currency: "EUR", description: "Handcrafted in Milan.", descriptionCn: "米兰全粒面皮革手工制作。",
        mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        specs: [{ id: "1", color: "Black", size: "One Size", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", stock: 5 }],
        detailImages: [],
      },
      {
        id: "clo-001", name: "Silk Blouse", nameCn: "真丝衬衫", category: "clothing", categoryName: "Clothing",
        price: 450, currency: "EUR", description: "Grade 6A silk from Como.", descriptionCn: "意大利科莫6A级桑蚕丝。",
        mainImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
        specs: [{ id: "2", color: "White", size: "M", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 6 }],
        detailImages: [],
      },
      {
        id: "wat-001", name: "Calibre 01", nameCn: "卡利伯01腕表", category: "watches", categoryName: "Watches",
        price: 2400, currency: "EUR", description: "Swiss automatic movement.", descriptionCn: "瑞士自动机芯。",
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        specs: [{ id: "3", color: "Silver", size: "40mm", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", stock: 3 }],
        detailImages: [],
      },
      {
        id: "pan-001", name: "Tailored Trousers", nameCn: "定制长裤", category: "pants", categoryName: "Pants",
        price: 320, currency: "EUR", description: "Italian wool blend.", descriptionCn: "意大利羊毛混纺。",
        mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        specs: [{ id: "4", color: "Navy", size: "M", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 5 }],
        detailImages: [],
      },
    ];
  }

  try {
    await redis.set("products", products);
    return NextResponse.json({ success: true, count: products.length, source: products.length > 4 ? "json" : "default" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
