"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

// 三大类配置
const CATEGORIES = [
  {
    key: "clothing",
    name: "服装",
    nameEn: "Clothing",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    subcategories: [
      { name: "T恤", nameEn: "T-Shirts", slug: "tshirts" },
      { name: "外套", nameEn: "Outerwear", slug: "outerwear" },
      { name: "裤子", nameEn: "Pants", slug: "pants" },
      { name: "卫衣", nameEn: "Hoodies", slug: "hoodies" },
      { name: "衬衫", nameEn: "Shirts", slug: "shirts" },
      { name: "连衣裙", nameEn: "Dresses", slug: "dresses" },
    ]
  },
  {
    key: "bagshoes",
    name: "鞋包",
    nameEn: "Shoes & Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    subcategories: [
      { name: "鞋子", nameEn: "Shoes", slug: "shoes" },
      { name: "包包", nameEn: "Bags", slug: "bags" },
    ]
  },
  {
    key: "accessories",
    name: "配饰",
    nameEn: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    subcategories: [
      { name: "手表", nameEn: "Watches", slug: "watches" },
      { name: "皮带", nameEn: "Belts", slug: "belts" },
    ]
  }
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

function CategoryCard({ category, isActive, onClick, onHover, onLeave, isHovered }: { 
  category: typeof CATEGORIES[0]; 
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-[#C9A96E]' : ''}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : ""}`}
          sizes="(max-width: 768px) 33vw, 300px"
        />
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4"
            >
              <h3 className="font-display text-xl text-white mb-3">{category.nameEn}</h3>
              <div className="flex flex-wrap justify-center gap-2 max-w-full">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/products?category=${sub.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 bg-white rounded-full text-xs text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors"
                  >
                    {sub.nameEn}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center mt-3">
        <h3 className={`font-display text-lg transition-colors ${isActive ? "text-[#C9A96E]" : "text-[#1A1A1A]"}`}>
          {category.nameEn}
        </h3>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = !activeGroup
    ? products
    : products.filter((p) => {
        const groupMap: Record<string, string[]> = {
          clothing: ["tshirts", "outerwear", "pants", "hoodies", "shirts", "dresses"],
          bagshoes: ["shoes", "bags"],
          accessories: ["watches", "belts"],
        };
        return groupMap[activeGroup]?.includes(p.category);
      });

  return (
    <main className="relative bg-[#FAFAFA] min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-8 md:px-16 text-center">
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

      {/* Category Cards with Hover */}
      <section className="px-8 md:px-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                isActive={activeGroup === category.key}
                onClick={() => setActiveGroup(activeGroup === category.key ? null : category.key)}
                onHover={() => setHoveredCategory(category.key)}
                onLeave={() => setHoveredCategory(null)}
                isHovered={hoveredCategory === category.key}
              />
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
                  <div className="aspect-[4/5] overflow-hidden bg-[#F0EFED] mb-6 relative">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8E6E2]" />
                    )}
                    <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-500" />
                  </div>
                  
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

      <Footer />
    </main>
  );
}