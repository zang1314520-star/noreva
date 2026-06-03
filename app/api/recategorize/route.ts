import { NextResponse } from "next/server";
import { getRedis, parseRedisList } from "@/lib/redis";

const redis = getRedis();

function autoCategorize(tag: string, desc: string) {
  const text = `${tag} ${desc}`.toLowerCase();

  if (/travel|transit|airport|weekend|25l|luggage|suitcase|trip/.test(text)) {
    return { category: "backpacks", categoryName: "Travel Backpacks", categoryNameCn: "旅行背包", brand: "NOREVA" };
  }

  if (/business|executive|office|meeting|document|work/.test(text)) {
    return { category: "backpacks", categoryName: "Business Backpacks", categoryNameCn: "商务背包", brand: "NOREVA" };
  }

  if (/weather|rain|water|rolltop|roll-top|water-resistant/.test(text)) {
    return { category: "backpacks", categoryName: "Weather-Ready Backpacks", categoryNameCn: "防泼水背包", brand: "NOREVA" };
  }

  return { category: "backpacks", categoryName: "Commuter Backpacks", categoryNameCn: "通勤背包", brand: "NOREVA" };
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
    const changes: { id: string; name: string; oldCategory: string; newCategory: string }[] = [];

    for (const product of products) {
      const catInfo = autoCategorize(product.sourceTag || "", product.descriptionCn || product.description || product.name || "");
      const changed = product.category !== catInfo.category || product.categoryName !== catInfo.categoryName || product.brand !== catInfo.brand;

      if (changed) {
        changes.push({
          id: product.id,
          name: product.nameCn || product.name,
          oldCategory: product.categoryNameCn || product.categoryName || product.category,
          newCategory: catInfo.categoryName,
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
