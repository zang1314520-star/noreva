import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { v2 as cloudinary } from "cloudinary";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 批量导入产品
export async function POST(request: Request) {
  try {
    const { products } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data" }, { status: 400 });
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    // 获取现有产品
    const existingProducts: any[] = await redis.get("products") || [];
    
    for (const product of products) {
      try {
        // 上传图片到 Cloudinary
        let mainImageUrl = "";
        
        if (product.imageBase64) {
          const uploadResult = await cloudinary.uploader.upload(product.imageBase64, {
            folder: "noreva/products",
            transformation: [
              { quality: "auto:good", fetch_format: "auto" },
              { width: 1200, crop: "limit" },
            ],
          });
          mainImageUrl = uploadResult.secure_url;
        }
        
        // 准备产品数据
        const newProduct = {
          id: `belt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: product.name || "Unnamed Product",
          nameCn: product.nameCn || "",
          category: product.category || "jewelry",
          categoryName: product.categoryName || "Belts",
          categoryNameCn: product.categoryNameCn || "皮带",
          price: product.price || 0,
          currency: product.currency || "USD",
          description: product.description || "",
          descriptionCn: product.descriptionCn || "",
          mainImage: mainImageUrl,
          specs: [{
            id: "1",
            color: product.color || "Default",
            colorCn: product.colorCn || "默认",
            size: "One Size",
            image: mainImageUrl,
            stock: product.stock || 999,
          }],
          detailImages: mainImageUrl ? [mainImageUrl] : [],
          featured: false,
          createdAt: new Date().toISOString().split("T")[0],
        };
        
        existingProducts.push(newProduct);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to import ${product.name}: ${error.message}`);
      }
    }
    
    // 保存到 Redis
    await redis.set("products", existingProducts);
    
    return NextResponse.json({
      success: true,
      imported: results.success,
      failed: results.failed,
      total: existingProducts.length,
      errors: results.errors,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 获取导入状态
export async function GET() {
  try {
    const products: any[] = await redis.get("products") || [];
    
    const stats = {
      total: products.length,
      byCategory: {} as Record<string, number>,
      byBrand: {} as Record<string, number>,
    };
    
    for (const p of products) {
      stats.byCategory[p.category] = (stats.byCategory[p.category] || 0) + 1;
      
      const brandMatch = p.name.match(/^(Ferragamo|Gucci|Prada|LV|Dior|Hermes|Burberry|Chanel)/i);
      if (brandMatch) {
        const brand = brandMatch[1].charAt(0).toUpperCase() + brandMatch[1].slice(1).toLowerCase();
        stats.byBrand[brand] = (stats.byBrand[brand] || 0) + 1;
      }
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
