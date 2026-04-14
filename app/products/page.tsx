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

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="relative bg-[#FAFAFA] min-h-screen">
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

      {/* Products Grid - 原来的4个产品展示 */}
      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-32">
              <p className="font-body text-[#8A8A8A]">Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-body text-[#8A8A8A]">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#F0EFED] mb-4 relative">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL={shimmer}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8E6E2]" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <span className="label text-[#A8A4A0] text-xs">{product.categoryName}</span>
                    <h2 className="font-display text-sm md:text-base font-light text-[#1A1A1A] leading-snug">
                      {product.name}
                    </h2>
                    {product.nameCn && (
                      <p className="font-body text-xs text-[#8A8A8A]">{product.nameCn}</p>
                    )}
                    <p className="font-body text-xs text-[#C9A96E]">
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
