import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function autoCategorizeCn(tag: string, desc: string): { category: string; categoryName: string; categoryNameCn: string; brand: string } {
  let brand = "Unknown";
  const brandText = (tag + " " + desc);
  if (/ferragamo|菲拉格慕/i.test(brandText)) brand = "Ferragamo";
  else if (/gucci|古驰/i.test(brandText)) brand = "Gucci";
  else if (/louis\s*vuitton|\blv\b/i.test(brandText)) brand = "Louis Vuitton";
  else if (/hermes|hermès|爱马仕/i.test(brandText)) brand = "Hermès";
  else if (/chanel|香奈儿/i.test(brandText)) brand = "Chanel";
  else if (/dior|迪奥/i.test(brandText)) brand = "Dior";
  else if (/prada|普拉达/i.test(brandText)) brand = "Prada";
  else if (/burberry|巴宝莉/i.test(brandText)) brand = "Burberry";
  else if (/versace|范思哲/i.test(brandText)) brand = "Versace";
  else if (/fendi|芬迪/i.test(brandText)) brand = "Fendi";
  else if (/celine|赛琳/i.test(brandText)) brand = "Celine";
  else if (/bottega|葆蝶家/i.test(brandText)) brand = "Bottega Veneta";
  else if (/valentino|华伦天奴/i.test(brandText)) brand = "Valentino";
  else if (/armani|阿玛尼/i.test(brandText)) brand = "Armani";
  else if (/coach|蔻驰/i.test(brandText)) brand = "Coach";

  const text = (tag + " " + desc).toLowerCase();
  if (/丝巾|围巾|twilly|scarf|shawl/i.test(text)) {
    return { category: "scarves", categoryName: "Scarves", categoryNameCn: "丝巾/围巾", brand };
  }
  if (/手表|腕表|watch/i.test(text)) {
    return { category: "watches", categoryName: "Watches", categoryNameCn: "手表", brand };
  }
  if (/珠宝|首饰|jewelry|ring|necklace/i.test(text)) {
    return { category: "jewelry", categoryName: "Jewelry", categoryNameCn: "珠宝", brand };
  }
  if (/眼镜|太阳镜|sunglasses/i.test(text)) {
    return { category: "sunglasses", categoryName: "Sunglasses", categoryNameCn: "太阳镜", brand };
  }
  // 鞋类检测 - 优先于包检测
  if (/鞋|靴|shoe|sneaker|运动鞋|皮鞋|凉鞋|拖鞋|休闲鞋|正装鞋|马丁靴|切尔西靴/i.test(text)) {
    if (/运动鞋|sneaker|跑步鞋/i.test(text)) {
      return { category: "sneakers", categoryName: "Sneakers", categoryNameCn: "运动鞋", brand };
    }
    if (/靴|boot|马丁|切尔西/i.test(text)) {
      return { category: "boots", categoryName: "Boots", categoryNameCn: "靴子", brand };
    }
    if (/凉鞋|拖鞋|sandal|沙滩鞋/i.test(text)) {
      return { category: "sandals", categoryName: "Sandals", categoryNameCn: "凉鞋/拖鞋", brand };
    }
    if (/皮鞋|正装鞋|loafer|牛津鞋|德比鞋/i.test(text)) {
      return { category: "leather Shoes", categoryName: "Leather Shoes", categoryNameCn: "皮鞋", brand };
    }
    // 默认鞋类
    return { category: "sneakers", categoryName: "Sneakers", categoryNameCn: "运动鞋", brand };
  }
  if (/皮带|腰带|belt/i.test(text)) {
    return { category: "belts", categoryName: "Belts", categoryNameCn: "皮带", brand };
  }
  if (/手提包|bag(?!\w)|handbag|钱包|wallet/i.test(text)) {
    if (/钱包|wallet/i.test(text)) {
      return { category: "wallets", categoryName: "Wallets", categoryNameCn: "钱包", brand };
    }
    return { category: "handbags", categoryName: "Handbags", categoryNameCn: "手提包", brand };
  }
  return { category: "belts", categoryName: "Belts", categoryNameCn: "皮带", brand };
}

export async function POST() {
  try {
    const products: any[] = (await redis.get("products")) || [];

    if (products.length === 0) {
      return NextResponse.json({ success: true, updated: 0, message: "No products to recategorize" });
    }

    let updated = 0;
    const changes: { id: string; name: string; oldCategory: string; newCategory: string; oldBrand: string; newBrand: string }[] = [];

    for (const product of products) {
      const tag = product.sourceTag || "";
      const desc = product.descriptionCn || product.description || "";
      const catInfo = autoCategorizeCn(tag, desc);

      const changed =
        product.category !== catInfo.category ||
        product.brand !== catInfo.brand;

      if (changed) {
        changes.push({
          id: product.id,
          name: product.nameCn || product.name,
          oldCategory: product.categoryNameCn || product.category,
          newCategory: catInfo.categoryNameCn,
          oldBrand: product.brand,
          newBrand: catInfo.brand,
        });

        product.category = catInfo.category;
        product.categoryName = catInfo.categoryName;
        product.categoryNameCn = catInfo.categoryNameCn;
        product.brand = catInfo.brand;
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
    console.error("Recategorize error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
