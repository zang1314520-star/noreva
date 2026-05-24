import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Try Redis, fallback to local JSON
let redis: any = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require("@upstash/redis");
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
} catch {}

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

function ensureDataDir() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readLocal(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocal(products: Product[]) {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export interface ProductSpec {
  id: string;
  color: string;
  size: string;
  image: string;
  stock: number;
}

export interface Product {
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

export const CATEGORY_TREE = {
  accessories: {
    name: "Accessories", nameCn: "配饰",
    subcategories: {
      belts: { name: "Belts", nameCn: "皮带" },
      scarves: { name: "Scarves", nameCn: "丝巾/围巾" },
      jewelry: { name: "Jewelry", nameCn: "珠宝" },
      sunglasses: { name: "Sunglasses", nameCn: "太阳镜" },
    },
  },
  clothing: {
    name: "Clothing", nameCn: "服装",
    subcategories: {
      tops: { name: "Tops", nameCn: "上装" },
      pants: { name: "Pants", nameCn: "裤装" },
      dresses: { name: "Dresses", nameCn: "裙装" },
      outerwear: { name: "Outerwear", nameCn: "外套" },
    },
  },
  bags: {
    name: "Bags & Luggage", nameCn: "箱包",
    subcategories: {
      handbags: { name: "Handbags", nameCn: "手提包" },
      crossbody: { name: "Crossbody", nameCn: "斜挎包" },
      backpacks: { name: "Backpacks", nameCn: "双肩包" },
      wallets: { name: "Wallets", nameCn: "钱包" },
    },
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let data: Product[] = [];
    
    // Try Redis first
    if (redis) {
      try {
        data = (await redis.get("products")) || [];
      } catch {}
    }
    
    // Fallback to local JSON
    if (!data || data.length === 0) {
      data = readLocal();
    }

    if (id) {
      const product = data.find((p) => p.id === id);
      if (product) return NextResponse.json(product);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    let products: Product[] = [];

    if (redis) {
      try { products = (await redis.get("products")) || []; } catch {}
    }
    if (products.length === 0) products = readLocal();

    if (!product.specs) product.specs = [];
    if (!product.detailImages) product.detailImages = [];
    if (!product.createdAt) product.createdAt = new Date().toISOString().split("T")[0];

    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }

    // Save to both
    writeLocal(products);
    if (redis) {
      try { await redis.set("products", JSON.stringify(products)); } catch {}
    }

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

    let products = readLocal();
    products = products.filter((p) => p.id !== id);

    writeLocal(products);
    if (redis) {
      try { await redis.set("products", JSON.stringify(products)); } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
