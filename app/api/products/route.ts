import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: "clothing" | "pants" | "bags" | "watches" | "jewelry";
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  descriptionCn?: string;
  image: string;
  images: string[];
  featured?: boolean;
  createdAt: string;
}

const DEFAULT_PRODUCTS: Product[] = [];

export async function GET() {
  try {
    const data = await redis.get("products");
    if (!data) {
      return NextResponse.json(DEFAULT_PRODUCTS);
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(DEFAULT_PRODUCTS);
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const products: Product[] = await redis.get("products") || [];
    
    // Update or add product
    const index = products.findIndex(p => p.id === product.id);
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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const products: Product[] = await redis.get("products") || [];
    const filtered = products.filter(p => p.id !== id);
    await redis.set("products", filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
