import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { folderPath } = await request.json();

    if (!folderPath) {
      return NextResponse.json({ error: "No folder path provided" }, { status: 400 });
    }

    // Security: Only allow paths under user's desktop or home directory
    const resolvedPath = path.resolve(folderPath);
    const allowedPrefixes = [
      process.env.HOME || process.env.USERPROFILE || "",
      "C:\\Users\\",
      "/c/Users/",
    ].filter(Boolean);

    const isAllowed = allowedPrefixes.some(prefix =>
      resolvedPath.toLowerCase().startsWith(prefix.toLowerCase())
    );

    if (!isAllowed) {
      return NextResponse.json({ error: "Path not allowed for security reasons" }, { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: "Folder does not exist" }, { status: 400 });
    }

    const stat = fs.statSync(resolvedPath);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: "Path is not a directory" }, { status: 400 });
    }

    const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
    const products: any[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(resolvedPath, entry.name);
      let images: string[] = [];

      try {
        const files = fs.readdirSync(fullPath);
        images = files
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
          .sort()
          .map(f => path.join(fullPath, f));
      } catch (e) {
        // Skip folders we can't read
      }

      if (images.length > 0) {
        products.push({
          folderName: entry.name,
          folderPath: fullPath,
          images: images,
          imageCount: images.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      folderPath: resolvedPath,
      products: products,
    });
  } catch (error: any) {
    console.error("Scan folder error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
