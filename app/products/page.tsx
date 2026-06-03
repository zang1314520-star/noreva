"use client";

import { Suspense, useDeferredValue, useEffect, useState } from "react";
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
  highlights?: string[];
  techSpecs?: Record<string, string>;
}

const USE_FILTERS = [
  { key: "all", name: "All Backpacks", nameCn: "全部背包" },
  { key: "commute", name: "Commute", nameCn: "通勤" },
  { key: "travel", name: "Travel", nameCn: "旅行" },
  { key: "business", name: "Business", nameCn: "商务" },
  { key: "weather", name: "Weather Ready", nameCn: "防泼水" },
];

function cdnThumb(url: string, w: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
}

function ProductGridSkeleton() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <section className="pt-40 pb-12 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-24 bg-[#F5F4F2] animate-pulse rounded mb-4" />
          <div className="h-12 w-72 bg-[#F5F4F2] animate-pulse rounded" />
          <div className="mt-8 flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 bg-[#F5F4F2] animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] bg-[#F5F4F2] animate-pulse rounded" />
              <div className="h-3 w-3/4 bg-[#F5F4F2] animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-[#F5F4F2] animate-pulse rounded" />
            </div>
          ))}
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
  const wishlist = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedUse, setSelectedUse] = useState("all");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setProducts((data || []).filter((item: Product) => item.category === "backpacks"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const use = searchParams.get("use");
    const query = searchParams.get("search") || searchParams.get("q");
    const wl = searchParams.get("wishlist");
    if (use) setSelectedUse(use);
    if (query) setSearch(query);
    if (wl === "1") setSelectedUse("wishlist");
  }, [searchParams]);

  const useFilters =
    selectedUse === "wishlist"
      ? [...USE_FILTERS, { key: "wishlist", name: "Wishlist", nameCn: "我的收藏" }]
      : USE_FILTERS;

  const filtered = products.filter((product) => {
    if (selectedUse === "wishlist") return wishlist.has(product.id);

    const text = [
      product.name,
      product.nameCn,
      product.description,
      ...(product.highlights || []),
      ...Object.values(product.techSpecs || {}),
    ]
      .join(" ")
      .toLowerCase();

    if (deferredSearch && !text.includes(deferredSearch.toLowerCase())) return false;
    if (selectedUse === "all") return true;
    if (selectedUse === "commute") return /commute|daily|urban|18l/.test(text);
    if (selectedUse === "travel") return /travel|25l|weekend|suitcase|airport|transit/.test(text);
    if (selectedUse === "business") return /business|executive|meeting|office|document|20l/.test(text);
    if (selectedUse === "weather") return /weather|water-resistant|rain|rolltop|22l/.test(text);
    return true;
  });

  const title = useFilters.find((item) => item.key === selectedUse);

  if (loading) return <ProductGridSkeleton />;

  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <section className="pt-40 pb-12 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="label text-[#8A8A8A] block mb-3">Backpack Collection</span>
              <h1 className="font-display text-3xl md:text-5xl font-light text-[#1A1A1A]">
                {isCn ? title?.nameCn : title?.name}
              </h1>
              <p className="text-sm text-[#8A8A8A] mt-3">
                {filtered.length} {isCn ? "款背包" : "backpacks"} · 18L to 25L · laptop and travel ready
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={isCn ? "搜索容量、电脑尺寸、通勤场景..." : "Search capacity, laptop size, commute..."}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full px-4 py-3 bg-[#F5F4F2] border-0 focus:outline-none focus:ring-1 focus:ring-[#C9A96E] text-sm"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {useFilters.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedUse(item.key)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all ${
                  selectedUse === item.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
                }`}
              >
                {isCn ? item.nameCn : item.name}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 border-y border-[#E8E6E2] py-5">
            {[
              ["Free Global Shipping", "Shipping timing confirmed before payment."],
              ["30-Day Easy Returns", "A clearer return promise for first-time buyers."],
              ["24-Month Warranty", "Manufacturing defects are covered."],
              ["Pack Finder Support", "Ask us which size fits your laptop and trip style."],
            ].map(([heading, body]) => (
              <div key={heading}>
                <p className="label text-[#1A1A1A] mb-1">{heading}</p>
                <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-xl text-[#8A8A8A] mb-2">
                {isCn ? "未找到匹配背包" : "No backpacks found"}
              </p>
              <button onClick={() => { setSearch(""); setSelectedUse("all"); }} className="cta-link text-xs">
                {isCn ? "清除筛选" : "Clear filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="group relative">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="img-zoom overflow-hidden mb-4 relative bg-[#F7F5F1] rounded-[18px]">
                      <Image
                        src={cdnThumb(product.mainImage, 520)}
                        alt={product.name}
                        width={520}
                        height={650}
                        className="w-full aspect-[4/5] object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-[#C9A96E]">{product.brand}</span>
                    <h3 className="font-display text-lg font-light text-[#1A1A1A] mt-1 group-hover:text-[#C9A96E] transition-colors">
                      {isCn ? product.nameCn || product.name : product.name}
                    </h3>
                    <p className="font-body text-sm text-[#1A1A1A] mt-2">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: product.currency,
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-1.5">
                      {(product.highlights || []).slice(0, 4).map((item) => (
                        <span key={item} className="bg-[#F5F4F2] px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-[#8A8A8A]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </Link>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      wishlist.toggle(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/85 backdrop-blur-sm"
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
