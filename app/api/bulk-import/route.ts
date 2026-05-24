import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

// Optional Redis
let redis: any = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require("@upstash/redis");
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
} catch {}

// Optional Cloudinary
let cloudinary: any = null;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const { v2 } = require("cloudinary");
    cloudinary = v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
} catch {}

function readLocal(): any[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocal(products: any[]) {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const { products, clearExisting } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    const results = { success: 0, failed: 0, errors: [] as string[] };

    let existingProducts: any[] = [];
    if (!clearExisting) {
      if (redis) {
        try { existingProducts = (await redis.get("products")) || []; } catch {}
      }
      if (existingProducts.length === 0) existingProducts = readLocal();
    }

    const BATCH_SIZE = 5;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (product: any) => {
          let mainImageUrl = "";

          if (product.imageBase64 && cloudinary) {
            try {
              const mimeType = product.imageMimeType || "image/jpeg";
              const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload(
                  `data:${mimeType};base64,${product.imageBase64}`,
                  { folder: "noreva/products", transformation: [{ quality: "auto:good", fetch_format: "auto" }, { width: 1200, crop: "limit" }] },
                  (error: any, result: any) => { if (error) reject(error); else resolve(result); }
                );
              });
              mainImageUrl = uploadResult.secure_url;
            } catch (uploadError: any) {
              console.error("Image upload failed:", uploadError.message);
            }
          }

          return {
            id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name || "",
            nameCn: product.nameCn || "",
            brand: product.brand || "Unknown",
            category: product.category || "belts",
            categoryName: product.categoryName || "Belts",
            categoryNameCn: product.categoryNameCn || "皮带",
            price: product.price || 0,
            currency: product.currency || "EUR",
            description: product.description || "",
            descriptionCn: product.descriptionCn || "",
            mainImage: mainImageUrl || product.mainImage || "",
            specs: product.specs || [{ id: "1", color: "Default", size: "One Size", image: "", stock: 999 }],
            detailImages: product.detailImages || (mainImageUrl ? [mainImageUrl] : []),
            featured: product.featured || false,
            createdAt: new Date().toISOString().split("T")[0],
            sourceTag: product.sourceTag || "",
            searchCode: product.searchCode || "",
            sourceId: product.sourceId || "",
          };
        })
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          existingProducts.push(result.value);
          results.success++;
        } else {
          results.failed++;
          results.errors.push((result.reason as any)?.message || "Unknown error");
        }
      }
    }

    // Save
    writeLocal(existingProducts);
    if (redis) {
      try { await redis.set("products", JSON.stringify(existingProducts)); } catch {}
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
