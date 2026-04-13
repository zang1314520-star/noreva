import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 支持 JSON (base64) 或 FormData (文件上传)
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    let imageUrl: string;
    
    if (contentType.includes("multipart/form-data")) {
      // FormData 方式 - 直接上传文件
      const formData = await request.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;
      imageUrl = dataUri;
    } else {
      // JSON 方式 - base64
      const { image } = await request.json();
      if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }
      imageUrl = image;
    }
    
    // 上传到 Cloudinary，自动转 WebP/AVIF + 压缩
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "noreva",
      transformation: [
        { quality: "auto:good", fetch_format: "auto" }, // 自动质量 + 格式
        { width: 1920, crop: "limit" }, // 最大宽度限制
      ],
    });
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
