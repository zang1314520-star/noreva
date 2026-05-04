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

export async function POST(request: Request) {
  try {
    // Handle both JSON (with base64 images) and FormData (with File objects)
    let products: any[];
    let clearExisting = true;

    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData();

      const productsJson = formData.get("products") as string;
      products = JSON.parse(productsJson);
      clearExisting = formData.get("clearExisting") === "true";

      // Get the image files - they're named by index like "image_0_0" (product 0, image 0)
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageFiles: File[] = [];

        // Collect up to 10 images for this product
        for (let j = 0; j < 10; j++) {
          const key = `image_${i}_${j}`;
          const file = formData.get(key) as File | null;
          if (file && file.size > 0) {
            imageFiles.push(file);
          }
        }

        // Convert File objects to base64 for upload
        if (imageFiles.length > 0) {
          const base64Images: string[] = [];
          for (const file of imageFiles) {
            const buffer = await file.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            base64Images.push(base64);
          }
          product.hdImagesBase64 = base64Images;
          product.imageMimeType = imageFiles[0].type || "image/jpeg";
        }
      }
    } else {
      // Legacy JSON format
      const body = await request.json();
      products = body.products;
      clearExisting = body.clearExisting;
    }

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

          // If product has local HD images (base64 from FormData), upload them
          if (product.hdImagesBase64 && product.hdImagesBase64.length > 0) {
            const imagesToUpload = product.hdImagesBase64.slice(0, 10);

            for (let j = 0; j < imagesToUpload.length; j++) {
              const base64 = imagesToUpload[j];
              try {
                const mimeType = product.imageMimeType || "image/jpeg";

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
                console.error(`Failed to upload HD image:`, uploadError.message);
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
