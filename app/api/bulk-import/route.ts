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

// 处理Excel文件并提取产品数据
function processExcelData(excelBuffer: Buffer): { products: any[]; images: Map<number, Buffer> } {
  // 这里需要用到一个Excel解析库
  // 在服务端环境中，我们需要使用xlsx库
  // 但由于Next.js Serverless函数的限制，我们使用base64编码发送数据
  // 实际上在浏览器端使用SheetJS解析更可靠
  
  // 这个API主要负责将Excel中的图片上传到Cloudinary
  // 产品数据已经在浏览器端处理好了
  
  return { products: [], images: new Map() };
}

export async function POST(request: Request) {
  try {
    const { excelBase64, products } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "No products data provided" }, { status: 400 });
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
        // 上传图片到Cloudinary
        let mainImageUrl = "";
        
        if (product.imageBase64) {
          try {
            // 将base64转为buffer
            const imageData = Buffer.from(product.imageBase64, 'base64');
            
            // 上传到Cloudinary
            const uploadResult = await new Promise<any>((resolve, reject) => {
              cloudinary.uploader.upload(
                `data:image/png;base64,${product.imageBase64}`,
                {
                  folder: "noreva/products",
                  transformation: [
                    { quality: "auto:good", fetch_format: "auto" },
                    { width: 1200, crop: "limit" },
                  ],
                },
                (error: any, result: any) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
            });
            
            mainImageUrl = uploadResult.secure_url;
          } catch (uploadError: any) {
            console.error("Image upload failed:", uploadError);
            // 如果图片上传失败，继续处理产品但不使用图片
          }
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
        results.errors.push(`Failed: ${product.name || 'Unknown'}`);
      }
    }
    
    // 保存到Redis
    await redis.set("products", existingProducts);
    
    return NextResponse.json({
      success: true,
      imported: results.success,
      failed: results.failed,
      total: existingProducts.length,
      errors: results.errors.slice(0, 10), // 只返回前10个错误
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
