import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getRedis, parseRedisList } from "@/lib/redis";

const redis = getRedis();
const hasCloudinary =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function uploadImage(imageBase64?: string) {
  if (!imageBase64 || !hasCloudinary) return "";

  const uploadResult = await cloudinary.uploader.upload(imageBase64, {
    folder: "noreva/products",
    transformation: [
      { quality: "auto:good", fetch_format: "auto" },
      { width: 1200, crop: "limit" },
    ],
  });

  return uploadResult.secure_url;
}

export async function POST(request: Request) {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    const { products } = await request.json();
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data" }, { status: 400 });
    }

    const results = { success: 0, failed: 0, errors: [] as string[] };
    const existingProducts = parseRedisList<any>(await redis.get("products"));

    for (const product of products) {
      try {
        const mainImageUrl = await uploadImage(product.imageBase64);
        existingProducts.push({
          id: product.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          name: product.name || "Unnamed Product",
          nameCn: product.nameCn || "",
          brand: product.brand || "Unknown",
          category: product.category || "belts",
          categoryName: product.categoryName || "Belts",
          categoryNameCn: product.categoryNameCn || "腰带",
          price: product.price || 0,
          currency: product.currency || "USD",
          description: product.description || "",
          descriptionCn: product.descriptionCn || "",
          mainImage: mainImageUrl || product.mainImage || "",
          specs: product.specs || [{
            id: "1",
            color: product.color || "Default",
            colorCn: product.colorCn || "默认",
            size: "One Size",
            image: mainImageUrl || product.mainImage || "",
            stock: product.stock || 999,
          }],
          detailImages: mainImageUrl ? [mainImageUrl] : product.detailImages || [],
          featured: false,
          createdAt: new Date().toISOString().split("T")[0],
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to import ${product.name || "product"}: ${error.message}`);
      }
    }

    await redis.set("products", existingProducts);

    return NextResponse.json({
      success: true,
      imported: results.success,
      failed: results.failed,
      total: existingProducts.length,
      errors: results.errors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    const products = parseRedisList<any>(await redis.get("products"));
    const stats = {
      total: products.length,
      byCategory: {} as Record<string, number>,
      byBrand: {} as Record<string, number>,
    };

    for (const product of products) {
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
      const brand = product.brand || "Unknown";
      stats.byBrand[brand] = (stats.byBrand[brand] || 0) + 1;
    }

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
