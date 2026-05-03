"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

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
  mainImage: string;
  specs: any[];
  featured?: boolean;
}

const CATEGORY_TREE: Record<string, { name: string; nameCn: string; subcategories: Record<string, { name: string; nameCn: string }> }> = {
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 pb-24 px-8 md:px-16">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#8A8A8A]">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const isCn = lang === "zh";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Apply URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    const brand = searchParams.get("brand");
    if (cat) setSelectedCategory(cat);
    if (brand) setSelectedBrand(brand);
  }, [searchParams]);

  // Derive available brands and categories from products
  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const availableCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Build category display list
  const categoryDisplay = [
    { key: "all", name: "All", nameCn: "全部" },
    ...availableCategories.map(key => {
      const sub = Object.values(CATEGORY_TREE)
        .flatMap(g => Object.entries(g.subcategories))
        .find(([k]) => k === key);
      return { key, name: sub?.[1]?.name || key, nameCn: sub?.[1]?.nameCn || key };
    })
  ];

  // Filter
  const filtered = products.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.nameCn?.includes(search) && !p.brand?.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (selectedBrand !== "all" && p.brand !== selectedBrand) return false;
    return true;
  });

  const getPageTitle = () => {
    if (selectedBrand !== "all") return selectedBrand;
    if (selectedCategory !== "all") {
      const cat = categoryDisplay.find(c => c.key === selectedCategory);
      return isCn ? (cat?.nameCn || selectedCategory) : (cat?.name || selectedCategory);
    }
    return isCn ? "全部产品" : "All Products";
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 pb-24 px-8 md:px-16">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <section className="pt-32 pb-12 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="label text-[#8A8A8A] block mb-3">Collection</span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A]">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-[#8A8A8A] mt-2">{filtered.length} {isCn ? "个产品" : "products"}</p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={isCn ? "搜索产品..." : "Search products..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F4F2] border-0 focus:outline-none focus:ring-1 focus:ring-[#C9A96E] text-sm"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-8 flex flex-wrap gap-3">
            {categoryDisplay.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setSelectedCategory(cat.key); setSelectedBrand("all"); }}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all ${
                  selectedCategory === cat.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
                }`}
              >
                {isCn ? cat.nameCn : cat.name}
              </button>
            ))}
          </div>

          {/* Brand filters */}
          {availableBrands.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  selectedBrand === "all"
                    ? "bg-[#C9A96E] text-white"
                    : "bg-[#F5F4F2] text-[#8A8A8A] hover:text-[#1A1A1A]"
                }`}
              >
                {isCn ? "全部品牌" : "All Brands"}
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                    selectedBrand === brand
                      ? "bg-[#C9A96E] text-white"
                      : "bg-[#F5F4F2] text-[#8A8A8A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8A8A8A] text-sm">{isCn ? "暂无产品" : "No products found"}</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedBrand("all"); }}
                className="mt-4 cta-link text-xs"
              >
                {isCn ? "清除筛选" : "Clear filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="img-zoom overflow-hidden mb-3">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name || ""}
                        width={400}
                        height={500}
                        className="w-full aspect-[4/5] object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {product.brand && (
                      <span className="text-[10px] tracking-widest uppercase text-[#C9A96E]">{product.brand}</span>
                    )}
                  </div>
                  <h3 className="font-display text-sm font-light text-[#1A1A1A] mb-1 group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                    {isCn ? (product.nameCn || product.name) : product.name}
                  </h3>
                  <p className="text-xs text-[#8A8A8A]">
                    {isCn ? (product.categoryNameCn || product.categoryName) : product.categoryName}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
