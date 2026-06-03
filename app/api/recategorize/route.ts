import { NextResponse } from "next/server";
import { getRedis, parseRedisList } from "@/lib/redis";

const redis = getRedis();

function detectBrand(text: string) {
  const normalized = text.toLowerCase();
  const brands = [
    "Bottega Veneta",
    "Louis Vuitton",
    "Ferragamo",
    "Burberry",
    "Valentino",
    "Versace",
    "Hermes",
    "Chanel",
    "Celine",
    "Prada",
    "Gucci",
    "Dior",
    "Fendi",
    "Coach",
    "Armani",
  ];

  return brands.find((brand) => normalized.includes(brand.toLowerCase())) || "Unknown";
}

function autoCategorize(tag: string, desc: string) {
  const text = `${tag} ${desc}`.toLowerCase();
  const brand = detectBrand(text);

  if (/watch|timepiece|腕表|手表/.test(text)) {
    return { category: "watches", categoryName: "Watches", categoryNameCn: "腕表", brand };
  }
  if (/jewelry|ring|necklace|bracelet|珠宝|戒指|项链/.test(text)) {
    return { category: "jewelry", categoryName: "Jewelry", categoryNameCn: "珠宝", brand };
  }
  if (/scarf|shawl|twilly|丝巾|围巾/.test(text)) {
    return { category: "scarves", categoryName: "Scarves", categoryNameCn: "丝巾/围巾", brand };
  }
  if (/sunglasses|eyewear|太阳镜|眼镜/.test(text)) {
    return { category: "sunglasses", categoryName: "Sunglasses", categoryNameCn: "太阳镜", brand };
  }
  if (/bag|handbag|wallet|tote|pouch|包|钱包/.test(text)) {
    if (/wallet|钱包/.test(text)) {
      return { category: "wallets", categoryName: "Wallets", categoryNameCn: "钱包", brand };
    }
    return { category: "handbags", categoryName: "Handbags", categoryNameCn: "手提包", brand };
  }
  if (/shoe|sneaker|boot|sandal|loafer|鞋|靴|凉鞋/.test(text)) {
    if (/boot|靴/.test(text)) return { category: "boots", categoryName: "Boots", categoryNameCn: "靴子", brand };
    if (/sandal|凉鞋/.test(text)) return { category: "sandals", categoryName: "Sandals", categoryNameCn: "凉鞋", brand };
    if (/loafer|leather/.test(text)) return { category: "leather-shoes", categoryName: "Leather Shoes", categoryNameCn: "皮鞋", brand };
    return { category: "sneakers", categoryName: "Sneakers", categoryNameCn: "运动鞋", brand };
  }

  return { category: "belts", categoryName: "Belts", categoryNameCn: "腰带", brand };
}

export async function POST() {
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  try {
    const products = parseRedisList<any>(await redis.get("products"));
    if (products.length === 0) {
      return NextResponse.json({ success: true, updated: 0, message: "No products to recategorize" });
    }

    let updated = 0;
    const changes: { id: string; name: string; oldCategory: string; newCategory: string; oldBrand: string; newBrand: string }[] = [];

    for (const product of products) {
      const catInfo = autoCategorize(product.sourceTag || "", product.descriptionCn || product.description || product.name || "");
      const changed = product.category !== catInfo.category || product.brand !== catInfo.brand;

      if (changed) {
        changes.push({
          id: product.id,
          name: product.nameCn || product.name,
          oldCategory: product.categoryNameCn || product.category,
          newCategory: catInfo.categoryNameCn,
          oldBrand: product.brand,
          newBrand: catInfo.brand,
        });

        Object.assign(product, catInfo);
        updated++;
      }
    }

    await redis.set("products", products);

    return NextResponse.json({
      success: true,
      total: products.length,
      updated,
      changes: changes.slice(0, 20),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
