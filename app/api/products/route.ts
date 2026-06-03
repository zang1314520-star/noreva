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
  featured?: boolean;
  createdAt: string;
}

const CATEGORY_TREE = {
  accessories: {
    name: "Accessories",
    nameCn: "配饰",
    subcategories: {
      belts: { name: "Belts", nameCn: "腰带" },
      scarves: { name: "Scarves", nameCn: "丝巾/围巾" },
      jewelry: { name: "Jewelry", nameCn: "珠宝" },
      sunglasses: { name: "Sunglasses", nameCn: "太阳镜" },
    },
  },
  clothing: {
    name: "Clothing",
    nameCn: "服装",
    subcategories: {
      tops: { name: "Tops", nameCn: "上装" },
      pants: { name: "Pants", nameCn: "裤装" },
      dresses: { name: "Dresses", nameCn: "连衣裙" },
      outerwear: { name: "Outerwear", nameCn: "外套" },
    },
  },
  bags: {
    name: "Bags & Luggage",
    nameCn: "箱包",
    subcategories: {
      handbags: { name: "Handbags", nameCn: "手提包" },
      crossbody: { name: "Crossbody", nameCn: "斜挎包" },
      backpacks: { name: "Backpacks", nameCn: "双肩包" },
      wallets: { name: "Wallets", nameCn: "钱包" },
    },
  },
};

function ensureDataDir() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readLocal(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocal(products: Product[]) {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

async function readProducts() {
  if (redis) {
    try {
      const data = await redis.get("products");
      const products = parseRedisList<Product>(data);
      if (products.length > 0) return products;
    } catch {}
  }

  return readLocal();
}

async function writeProducts(products: Product[]) {
  writeLocal(products);
  if (redis) {
    try {
      await redis.set("products", products);
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
    const product = await request.json();
    const products = await readProducts();

    const normalizedProduct: Product = {
      ...product,
      specs: product.specs || [],
      detailImages: product.detailImages || [],
      createdAt: product.createdAt || new Date().toISOString().split("T")[0],
    };

    const index = products.findIndex((p) => p.id === normalizedProduct.id);
    if (index >= 0) {
      products[index] = normalizedProduct;
    } else {
      products.unshift(normalizedProduct);
    }

    await writeProducts(products);
    return NextResponse.json(normalizedProduct);
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
