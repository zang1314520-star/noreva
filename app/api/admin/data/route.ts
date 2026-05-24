import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return NextResponse.json({ products: [] });
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    return NextResponse.json({ products: Array.isArray(data) ? data : [] });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
