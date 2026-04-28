"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

const ALL_CATEGORIES = [
  { key: "all", name: "All" },
  { key: "clothing", name: "Clothing" },
  { key: "bags", name: "Bags" },
  { key: "watches", name: "Watches" },
  { key: "belts", name: "Belts" },
  { key: "jewelry", name: "Jewelry" },
  { key: "accessories", name: "Accessories" },
];

interface ProductSpec {
  id: string;
  color: string;
  size: string;
  image: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  mainImage: string;
  specs: ProductSpec[];
  featured?: boolean;
}

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
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = search === "" || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.nameCn && product.nameCn.includes(search));
    
    const matchesCategory = selectedCategory === "all" || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "all") {
      const cat = ALL_CATEGORIES.find(c => c.key === selectedCategory);
      return cat ? cat.name : selectedCategory;
    }
    return "All Products";
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 pb-24 px-8 md:px-16">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#8A8A8A]">Loading products...</p>
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
              <p className="text-sm text-[#8A8A8A] mt-2">{filteredProducts.length} products</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F4F2] border-0 focus:outline-none focus:ring-1 focus:ring-[#C9A96E] text-sm"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all ${
                  selectedCategory === cat.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#8A8A8A] hover:text-[#1A1A1A]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8A8A8A] text-sm">No products found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="mt-4 cta-link text-xs"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="img-zoom overflow-hidden mb-3">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="w-full aspect-[4/5] object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-[#F5F4F2]" />
                    )}
                  </div>
                  <h3 className="font-display text-sm font-light text-[#1A1A1A] mb-1 group-hover:text-[#C9A96E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mb-1">{product.categoryName}</p>
                  {product.price > 0 && (
                    <p className="text-sm text-[#1A1A1A]">
                      {product.currency === "USD" ? "$" : "€"}
                      {product.price}
                    </p>
                  )}
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
