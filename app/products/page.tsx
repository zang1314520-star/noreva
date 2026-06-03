"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useWishlist } from "@/lib/useWishlist";

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

// Cloudinary optimized thumbnail helper
function cdnThumb(url: string, w: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
}

// ========== Skeleton Grid ==========
function ProductGridSkeleton() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <section className="pt-32 pb-12 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="h-3 w-20 bg-[#F5F4F2] animate-pulse rounded mb-3" />
              <div className="h-10 w-48 bg-[#F5F4F2] animate-pulse rounded" />
              <div className="h-3 w-24 bg-[#F5F4F2] animate-pulse rounded mt-3" />
            </div>
            <div className="h-12 w-full md:w-80 bg-[#F5F4F2] animate-pulse rounded" />
          </div>
          {/* Filter skeleton */}
          <div className="mt-8 flex gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-9 w-20 bg-[#F5F4F2] animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-2.5 w-16 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-3/4 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-2.5 w-12 bg-[#F5F4F2] animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
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
  const wishlist = useWishlist();

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
    const wl = searchParams.get("wishlist");
    if (cat) setSelectedCategory(cat);
    if (brand) setSelectedBrand(brand);
    if (wl === "1") setSelectedCategory("wishlist");
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
    if (selectedCategory === "wishlist") return wishlist.has(p.id);
    if (search) {
      const q = search.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.nameCn?.includes(search) && !p.brand?.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (selectedBrand !== "all" && p.brand !== selectedBrand) return false;
    return true;
  });

  const getPageTitle = () => {
    if (selectedCategory === "wishlist") return isCn ? "我的收藏" : "My Wishlist";
    if (selectedBrand !== "all") return selectedBrand;
    if (selectedCategory !== "all") {
      const cat = categoryDisplay.find(c => c.key === selectedCategory);
      return isCn ? (cat?.nameCn || selectedCategory) : (cat?.name || selectedCategory);
    }
    return isCn ? "全部产品" : "All Products";
  };

  if (loading) return <ProductGridSkeleton />;

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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-[#E8E6E2] py-5">
            <div>
              <p className="label text-[#1A1A1A] mb-1">{isCn ? "私人选品支持" : "Private styling support"}</p>
              <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">
                {isCn ? "通过 WhatsApp 咨询尺码、搭配和库存。" : "Ask about sizing, styling, and availability over WhatsApp."}
              </p>
            </div>
            <div>
              <p className="label text-[#1A1A1A] mb-1">{isCn ? "全球配送" : "Worldwide delivery"}</p>
              <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">
                {isCn ? "付款前确认配送方式与时效。" : "Shipping method and timing confirmed before payment."}
              </p>
            </div>
            <div>
              <p className="label text-[#1A1A1A] mb-1">{isCn ? "清晰退换" : "Clear returns"}</p>
              <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">
                {isCn ? "符合条件商品支持 14 天退换说明。" : "Eligible items include a clear 14-day return window."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-[#E8E6E2] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-display text-xl text-[#8A8A8A] mb-2">{isCn ? "未找到匹配产品" : "No products found"}</p>
              <p className="text-sm text-[#A8A4A0] mb-6">{isCn ? "试试搜索 Ferragamo 或 Gucci" : "Try searching for Ferragamo or Gucci"}</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedBrand("all"); }}
                className="cta-link text-xs"
              >
                {isCn ? "清除筛选" : "Clear filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="group relative">
                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                  >
                    <div className="img-zoom overflow-hidden mb-3 relative">
                      {product.mainImage ? (
                        <Image
                          src={cdnThumb(product.mainImage, 400)}
                          alt={product.name || ""}
                          width={400}
                          height={500}
                          className="w-full aspect-[4/5] object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                          <svg className="w-12 h-12 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-end justify-center pb-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A] px-4 py-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          {isCn ? "查看详情" : "View Details"}
                        </span>
                      </div>
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
                  {/* Wishlist heart */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); wishlist.toggle(product.id); }}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    aria-label="Toggle wishlist"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlist.has(product.id) ? "#C9A96E" : "none"} stroke={wishlist.has(product.id) ? "#C9A96E" : "#8A8A8A"} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
