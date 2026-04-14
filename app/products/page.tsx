"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
}

// 新的分类结构
const CATEGORIES = [
  { key: "all", name: "全部", nameEn: "All" },
  // 服装
  { key: "tshirts", name: "T恤", nameEn: "T-Shirts", group: "clothing" },
  { key: "outerwear", name: "外套", nameEn: "Outerwear", group: "clothing" },
  { key: "pants", name: "裤子", nameEn: "Pants", group: "clothing" },
  { key: "hoodies", name: "卫衣", nameEn: "Hoodies", group: "clothing" },
  { key: "shirts", name: "衬衫", nameEn: "Shirts", group: "clothing" },
  { key: "dresses", name: "连衣裙", nameEn: "Dresses", group: "clothing" },
  // 鞋包
  { key: "shoes", name: "鞋子", nameEn: "Shoes", group: "bagshoes" },
  { key: "bags", name: "包包", nameEn: "Bags", group: "bagshoes" },
  // 配饰
  { key: "watches", name: "手表", nameEn: "Watches", group: "accessories" },
  { key: "belts", name: "皮带", nameEn: "Belts", group: "accessories" },
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

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

  return (
    <main className="relative bg-[#FAFAFA] min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-8 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="label text-[#8A8A8A] block mb-4">Collection</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            The Objects
          </h1>
          <p className="font-body text-[#8A8A8A] text-base md:text-lg leading-relaxed">
            Carefully chosen. Made to last.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-8 md:px-16 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
            {CATEGORIES.map((cat, index) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`font-body text-xs md:text-sm tracking-[0.2em] uppercase px-4 md:px-6 py-2 transition-all duration-300 ${
                  activeCategory === cat.key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#8A8A8A] hover:text-[#1A1A1A] border border-[#E8E6E2]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-32">
              <p className="font-body text-[#8A8A8A]">Loading...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-body text-[#8A8A8A]">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  {/* Image with placeholder */}
                  <div className="aspect-[4/5] overflow-hidden bg-[#F0EFED] mb-6 relative">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={shimmer}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8E6E2]" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-500" />
                  </div>
                  
                  {/* Info */}
                  <div className="text-center">
                    <span className="label text-[#A8A4A0] block mb-2 text-xs">
                      {product.categoryName}
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-light mb-1 text-[#1A1A1A]">
                      {product.name}
                    </h2>
                    {product.nameCn && (
                      <p className="font-body text-sm text-[#8A8A8A] mb-3">
                        {product.nameCn}
                      </p>
                    )}
                    <p className="font-body text-sm text-[#C9A96E] tracking-wide">
                      €{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-8 md:px-16 py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-[#1A1A1A] italic leading-relaxed">
            "Each piece begins with a conversation."
          </p>
          <p className="font-body text-[#8A8A8A] text-sm mt-6 tracking-widest uppercase">
            — Maison NOREVA
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
