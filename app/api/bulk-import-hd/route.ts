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

async function uploadBase64Image(base64: string, mimeType = "image/jpeg") {
  if (!hasCloudinary) return "";

  const uploadResult = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64}`, {
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
    let products: any[];
    let clearExisting = true;

    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData();
      products = JSON.parse(String(formData.get("products") || "[]"));
      clearExisting = formData.get("clearExisting") === "true";

      for (let i = 0; i < products.length; i++) {
        const imageFiles: File[] = [];
        for (let j = 0; j < 10; j++) {
          const file = formData.get(`image_${i}_${j}`) as File | null;
          if (file && file.size > 0) imageFiles.push(file);
        }

        if (imageFiles.length > 0) {
          const base64Images = [];
          for (const file of imageFiles) {
            base64Images.push(Buffer.from(await file.arrayBuffer()).toString("base64"));
          }
          products[i].hdImagesBase64 = base64Images;
          products[i].imageMimeType = imageFiles[0].type || "image/jpeg";
        }
      }
    } else {
      const body = await request.json();
      products = body.products;
      clearExisting = body.clearExisting;
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    const results = { success: 0, failed: 0, hdUploaded: 0, errors: [] as string[] };
    const existingProducts = clearExisting ? [] : parseRedisList<any>(await redis.get("products"));

    for (const product of products) {
      try {
        let mainImageUrl = "";
        const detailImages: string[] = [];
        let hdUploadedCount = 0;
        const imagesToUpload = product.hdImagesBase64?.slice(0, 10) || [];

        for (let i = 0; i < imagesToUpload.length; i++) {
          try {
            const secureUrl = await uploadBase64Image(imagesToUpload[i], product.imageMimeType);
            if (!secureUrl) continue;
            if (i === 0) mainImageUrl = secureUrl;
            else detailImages.push(secureUrl);
            hdUploadedCount++;
          } catch (error: any) {
            results.errors.push(`Image upload failed for ${product.name || "product"}: ${error.message}`);
          }
        }

        if (!mainImageUrl && product.imageBase64) {
          mainImageUrl = await uploadBase64Image(product.imageBase64, product.imageMimeType);
          if (mainImageUrl) detailImages.push(mainImageUrl);
        }

        existingProducts.push({
          id: product.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          name: product.name || "",
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
            color: "Default",
            size: "One Size",
            image: mainImageUrl || product.mainImage || "",
            stock: 999,
          }],
          detailImages: detailImages.length > 0 ? detailImages : product.detailImages || [],
          featured: false,
          createdAt: new Date().toISOString().split("T")[0],
          sourceTag: product.sourceTag || "",
          searchCode: product.searchCode || "",
          sourceId: product.sourceId || "",
        });

        results.success++;
        results.hdUploaded += hdUploadedCount;
      } catch (error: any) {
        results.failed++;
        results.errors.push(error.message || "Unknown error");
      }
    }

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
