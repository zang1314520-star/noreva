"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useTranslation } from "@/lib/useTranslation";

const ALL_BRANDS = [
  "LV", "Dior", "Gucci", "Prada", "Burberry", "Hermes", "Balenciaga", "Chanel", 
  "Fendi", "Versace", "Off-White", "Stone Island", "Moncler", "Celine", "Miu Miu",
  "Valentino", "Givenchy", "Loro Piana", "Armani", "Loewe", "Nike", "Jordan",
  "Rolex", "Omega", "Cartier", "Patek Philippe", "Audemars Piguet", "Golden Goose"
];

const ALL_CATEGORIES = [
  { key: "all", name: "All" },
  { key: "tshirts", name: "T-Shirts" },
  { key: "hoodies", name: "Hoodies" },
  { key: "jackets", name: "Jackets" },
  { key: "jeans", name: "Jeans" },
  { key: "pants", name: "Pants" },
  { key: "dresses", name: "Dresses" },
  { key: "womenswear", name: "Womenswear" },
  { key: "sneakers", name: "Sneakers" },
  { key: "luxury-shoes", name: "Luxury Shoes" },
  { key: "handbags", name: "Handbags" },
  { key: "backpacks", name: "Backpacks" },
  { key: "wallets", name: "Wallets" },
  { key: "sunglasses", name: "Sunglasses" },
  { key: "watches", name: "Watches" },
  { key: "belts", name: "Belts" },
  { key: "jewelry", name: "Jewelry" },
  { key: "hats", name: "Hats" },
  { key: "scarves", name: "Scarves" },
];

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
        <BackToTop />
      </main>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const group = searchParams.get("group");
    
    if (brand) setSelectedBrand(decodeURIComponent(brand));
    if (category) setSelectedCategory(decodeURIComponent(category));
    if (group) setSelectedCategory(decodeURIComponent(group));
  }, [searchParams]);
  
  const getPageTitle = () => {
    if (selectedBrand) return selectedBrand;
    if (selectedCategory && selectedCategory !== "all") {
      const cat = ALL_CATEGORIES.find(c => c.key === selectedCategory);
      return cat ? cat.name : selectedCategory;
    }
    return t("productsTitle");
  };
  
  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedCategory("all");
    setSearch("");
    router.push("/products");
  };
  
  const hasActiveFilters = selectedBrand || selectedCategory !== "all" || search;

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
            </div>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={t("searchProducts")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F4F2] border-0 focus:outline-none focus:ring-1 focus:ring-[#C9A96E] text-sm"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A] text-sm hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t("filters")}
              {hasActiveFilters && <span className="w-2 h-2 bg-[#C9A96E] rounded-full"></span>}
            </button>
            
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={hasActiveFilters ? "px-4 py-2 text-sm text-[#C9A96E] hover:underline" : "px-4 py-2 text-sm text-[#8A8A8A] cursor-not-allowed"}
            >
              {t("viewAll")}
            </button>
            
            {selectedBrand && (
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-sm flex items-center gap-2">
                {selectedBrand}
                <button onClick={() => setSelectedBrand(null)} className="hover:text-[#C9A96E]">x</button>
              </span>
            )}
            
            {selectedCategory !== "all" && (
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-sm flex items-center gap-2">
                {ALL_CATEGORIES.find(c => c.key === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("all")} className="hover:text-[#C9A96E]">x</button>
              </span>
            )}
          </div>
          
          {showFilters && (
            <div className="mt-6 p-6 bg-[#F5F4F2] grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-sm mb-4 text-[#1A1A1A]">Brand</h3>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
<button onClick={() => setSelectedBrand(null)} className="px-3 py-1.5 text-xs rounded-full bg-white text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors">All</button>
{ALL_BRANDS.map(brand => <button key={brand} onClick={() => setSelectedBrand(brand)} className="px-3 py-1.5 text-xs rounded-full bg-white text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors">{brand}</button>)}
</div></div><div><h3 className="font-display text-sm mb-4 text-[#1A1A1A]">Category</h3><div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
<button onClick={() => setSelectedCategory("all")} className="px-3 py-1.5 text-xs rounded-full bg-white text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors">All</button>
{ALL_CATEGORIES.filter(c => c.key !== "all").map(cat => <button key={cat.key} onClick={() => setSelectedCategory(cat.key)} className="px-3 py-1.5 text-xs rounded-full bg-white text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors">{cat.name}</button>)}
</div></div></div>          )}        </div>      </section>

      <section className="px-8 md:px-16 pb-24">        <div className="max-w-6xl mx-auto">
          {hasActiveFilters && <p className="text-sm text-[#8A8A8A] mb-6">Showing {selectedBrand || "all brands"}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (<div key={i} className="group"><div className="relative aspect-[3/4] bg-[#F5F4F2] mb-4 flex items-center justify-center"><span className="text-[#8A8A8A] text-sm">Product {i}</span></div><p className="text-xs text-[#8A8A8A] mb-1">Category</p><h3 className="font-display text-base text-[#1A1A1A]">Product Name</h3><p className="text-sm text-[#1A1A1A] mt-1">0.00</p></div>))}
          </div>
          {!hasActiveFilters && (<div className="mt-16 text-center"><p className="text-[#8A8A8A] mb-6">{t("browseCategory")}</p><div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
<a href="/products?group=clothing" className="p-8 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors text-center"><h3 className="font-display text-lg">Clothing</h3><p className="text-xs text-[#8A8A8A] mt-2">T-Shirts, Hoodies, Jackets</p></a>
<a href="/products?group=shoesbags" className="p-8 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors text-center"><h3 className="font-display text-lg">Shoes & Bags</h3><p className="text-xs text-[#8A8A8A] mt-2">Sneakers, Handbags, Wallets</p></a>
<a href="/products?group=accessories" className="p-8 border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors text-center"><h3 className="font-display text-lg">Accessories</h3><p className="text-xs text-[#8A8A8A] mt-2">Watches, Belts, Jewelry</p></a></div></div>)}
        </div>
      </section>
      <Footer />
    </main>
  );
}
