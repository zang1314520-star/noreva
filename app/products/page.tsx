"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  image: string;
}

const CATEGORIES = [
  { key: "all", name: "All", nameCn: "全部" },
  { key: "clothing", name: "Clothing", nameCn: "衣服" },
  { key: "pants", name: "Pants", nameCn: "裤子" },
  { key: "bags", name: "Bags", nameCn: "包包" },
  { key: "watches", name: "Watches", nameCn: "手表" },
  { key: "jewelry", name: "Jewelry", nameCn: "首饰" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="font-display text-2xl tracking-wider">
            NOREVA
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-4">The Objects</h1>
        <p className="text-gray-600 font-body">Carefully crafted. Made to last.</p>
      </section>

      {/* Categories */}
      <section className="px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-2 text-sm tracking-wider transition-colors ${
                  activeCategory === cat.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {cat.nameCn} / {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="label text-[#A8A4A0] block mb-2">{product.categoryName}</span>
                    <h3 className="font-display text-xl mb-1">{product.name}</h3>
                    {product.nameCn && (
                      <p className="text-gray-500 text-sm mb-2">{product.nameCn}</p>
                    )}
                    <p className="text-[#C9A96E]">
                      €{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="font-display text-xl tracking-wider">
            NOREVA
          </Link>
          <p className="text-gray-500 text-sm mt-2">Quiet refinement. Timeless objects.</p>
        </div>
      </footer>
    </div>
  );
}
