import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { products, clearExisting } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    const results = { success: 0, failed: 0, hdUploaded: 0, errors: [] as string[] };

    // Get existing or start fresh
    let existingProducts: any[] = [];
    if (!clearExisting) {
      existingProducts = (await redis.get("products")) || [];
    }

    // Process products in batches of 5
    const BATCH_SIZE = 5;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map(async (product: any) => {
          let mainImageUrl = "";
          let detailImages: string[] = [];
          let hdUploadedCount = 0;

          // If product has local HD images, upload them
          if (product.hdImages && product.hdImages.length > 0) {
            const imagesToUpload = product.hdImages.slice(0, 10); // Max 10 images

            for (let j = 0; j < imagesToUpload.length; j++) {
              const imagePath = imagesToUpload[j];
              try {
                const imageBuffer = fs.readFileSync(imagePath);
                const base64 = imageBuffer.toString("base64");
                const ext = path.extname(imagePath).toLowerCase().slice(1) || "jpg";
                const mimeType = ext === "png" ? "image/png" : "image/jpeg";

                const uploadResult = await new Promise<any>((resolve, reject) => {
                  cloudinary.uploader.upload(
                    `data:${mimeType};base64,${base64}`,
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

                if (j === 0) {
                  mainImageUrl = uploadResult.secure_url;
                } else {
                  detailImages.push(uploadResult.secure_url);
                }
                hdUploadedCount++;
              } catch (uploadError: any) {
                console.error(`Failed to upload image ${imagePath}:`, uploadError.message);
              }
            }
          }

          // Fallback to Excel base64 image if no HD images or upload failed
          if (!mainImageUrl && product.imageBase64) {
            try {
              const mimeType = product.imageMimeType || "image/jpeg";
              const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload(
                  `data:${mimeType};base64,${product.imageBase64}`,
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
              detailImages = [uploadResult.secure_url];
            } catch (uploadError: any) {
              console.error("Excel image upload failed:", uploadError.message);
            }
          }

          const newProduct = {
            id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: product.name || "",
            nameCn: product.nameCn || "",
            brand: product.brand || "Unknown",
            category: product.category || "belts",
            categoryName: product.categoryName || "Belts",
            categoryNameCn: product.categoryNameCn || "皮带",
            price: product.price || 0,
            currency: product.currency || "USD",
            description: product.description || "",
            descriptionCn: product.descriptionCn || "",
            mainImage: mainImageUrl || product.mainImage || "",
            specs: [{
              id: "1",
              color: "Default",
              size: "One Size",
              image: mainImageUrl || "",
              stock: 999,
            }],
            detailImages: detailImages.length > 0 ? detailImages : (mainImageUrl ? [mainImageUrl] : []),
            featured: false,
            createdAt: new Date().toISOString().split("T")[0],
            sourceTag: product.sourceTag || "",
            searchCode: product.searchCode || "",
            sourceId: product.sourceId || "",
          };

          return { product: newProduct, hdUploaded: hdUploadedCount };
        })
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          existingProducts.push(result.value.product);
          results.success++;
          results.hdUploaded += result.value.hdUploaded;
        } else {
          results.failed++;
          results.errors.push(result.reason?.message || "Unknown error");
        }
      }
    }

    // Save to Redis
    await redis.set("products", existingProducts);

    return NextResponse.json({
      success: true,
      imported: results.success,
      failed: results.failed,
      hdUploaded: results.hdUploaded,
      total: existingProducts.length,
      errors: results.errors.slice(0, 10),
    });
  } catch (error: any) {
    console.error("Bulk import HD error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
