import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

export async function POST(request: Request) {
  try {
    const { products } = await request.json();
    if (!Array.isArray(products)) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const dir = path.dirname(PRODUCTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
