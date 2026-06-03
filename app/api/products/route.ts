import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getRedis, parseRedisList } from "@/lib/redis";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const redis = getRedis();

interface ProductSpec {
  id: string;
  color: string;
  size: string;
  image: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  brand: string;
  category: string;
  categoryName: string;
  categoryNameCn?: string;
  price: number;
  currency: string;
  description: string;
  descriptionCn?: string;
  mainImage: string;
  specs: ProductSpec[];
  detailImages: string[];
  highlights?: string[];
  techSpecs?: Record<string, string>;
  warranty?: string;
  featured?: boolean;
  createdAt: string;
  [key: string]: any;
}

function ensureDataDir() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeProduct(product: Partial<Product>): Product {
  return {
    ...product,
    id: product.id || `bp_${Date.now()}`,
    name: product.name || "NOREVA Backpack",
    nameCn: product.nameCn,
    brand: product.brand || "NOREVA",
    category: "backpacks",
    categoryName: product.categoryName || "Backpacks",
    categoryNameCn: product.categoryNameCn || "双肩背包",
    price: Number(product.price) || 0,
    currency: product.currency || "USD",
    description: product.description || "",
    descriptionCn: product.descriptionCn,
    mainImage: product.mainImage || "",
    specs: product.specs || [],
    detailImages: product.detailImages || [],
    featured: Boolean(product.featured),
    createdAt: product.createdAt || new Date().toISOString().split("T")[0],
  };
}

function readLocal(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

function writeLocal(products: Product[]) {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products.map(normalizeProduct), null, 2), "utf-8");
}

async function readProducts() {
  if (redis) {
    try {
      const products = parseRedisList<Product>(await redis.get("products"));
      if (products.length > 0) return products.map(normalizeProduct);
    } catch {}
  }

  return readLocal();
}

async function writeProducts(products: Product[]) {
  const normalized = products.map(normalizeProduct);
  writeLocal(normalized);
  if (redis) {
    try {
      await redis.set("products", normalized);
    } catch {}
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const products = await readProducts();

    if (id) {
      const product = products.find((p) => p.id === id);
      if (product) return NextResponse.json(product);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const product = normalizeProduct(await request.json());
    const products = await readProducts();
    const index = products.findIndex((p) => p.id === product.id);

    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }

    await writeProducts(products);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const products = (await readProducts()).filter((p) => p.id !== id);
    await writeProducts(products);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
