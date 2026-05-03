import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
  brand: string;            // e.g. "Ferragamo", "Gucci"
  category: string;          // e.g. "belts", "scarves", "bags"
  categoryName: string;      // e.g. "Belts"
  categoryNameCn?: string;   // e.g. "皮带"
  price: number;
  currency: string;
  description: string;
  descriptionCn?: string;
  mainImage: string;
  specs: ProductSpec[];
  detailImages: string[];
  featured?: boolean;
  createdAt: string;
  sourceTag?: string;        // original tag from import
  searchCode?: string;       // search code from import
  sourceId?: string;         // original product ID from import
}

// Category hierarchy definition
export const CATEGORY_TREE = {
  accessories: {
    name: "Accessories",
    nameCn: "配饰",
    subcategories: {
      belts: { name: "Belts", nameCn: "皮带" },
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
      dresses: { name: "Dresses", nameCn: "裙装" },
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const data: Product[] = (await redis.get("products")) || [];

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
    const products: Product[] = (await redis.get("products")) || [];

    if (!product.specs) product.specs = [];
    if (!product.detailImages) product.detailImages = [];
    if (!product.createdAt) product.createdAt = new Date().toISOString().split("T")[0];

    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }

    await redis.set("products", products);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const product = await request.json();
    const products: Product[] = (await redis.get("products")) || [];

    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...products[index], ...product };
      await redis.set("products", products);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, ids } = await request.json();

    const products: Product[] = (await redis.get("products")) || [];

    let filtered: Product[];
    if (ids && Array.isArray(ids)) {
      // Batch delete
      const idSet = new Set(ids);
      filtered = products.filter((p) => !idSet.has(p.id));
    } else {
      filtered = products.filter((p) => p.id !== id);
    }

    await redis.set("products", filtered);
    return NextResponse.json({ success: true, remaining: filtered.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
